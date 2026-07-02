"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { StokDarah, StokDarahLog } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { GOLONGAN_DARAH } from "@/lib/blood-types";

// Atomic stock adjustment. Never read-then-write: increments upsert (only
// insert-on-increase), decrements use a conditional $gte filter so two
// concurrent decrements can never overdraw the same document.
export async function adjustStokDarah({
  cabangId,
  golonganDarah,
  delta,
  alasan,
  refId,
  actorId,
  session,
}) {
  const filter = { cabangId, golonganDarah };
  if (delta < 0) {
    filter.jumlahKantong = { $gte: -delta };
  }

  const updated = await StokDarah.findOneAndUpdate(
    filter,
    { $inc: { jumlahKantong: delta } },
    { upsert: delta > 0, returnDocument: "after", session },
  );

  if (!updated) {
    return null; // insufficient stock (decrement) or no stock doc yet
  }

  await StokDarahLog.create(
    [{ cabangId, golonganDarah, delta, alasan, refId, actorId }],
    { session },
  );

  return updated;
}

export async function getStokByCabang(cabangId) {
  await connectDB();
  const docs = await StokDarah.find({ cabangId }).lean();
  const byGolongan = Object.fromEntries(
    docs.map((d) => [d.golonganDarah, d.jumlahKantong]),
  );
  return GOLONGAN_DARAH.map((gol) => ({
    golonganDarah: gol,
    jumlahKantong: byGolongan[gol] || 0,
  }));
}

const koreksiSchema = z.object({
  golonganDarah: z.enum(GOLONGAN_DARAH),
  delta: z.coerce.number().int(),
});

export async function koreksiStokManual(prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = koreksiSchema.safeParse({
    golonganDarah: formData.get("golonganDarah"),
    delta: formData.get("delta"),
  });
  if (!parsed.success || parsed.data.delta === 0) {
    return { error: "Jumlah koreksi tidak valid." };
  }

  await connectDB();
  const result = await adjustStokDarah({
    cabangId: session.cabangId,
    golonganDarah: parsed.data.golonganDarah,
    delta: parsed.data.delta,
    alasan: "koreksi_manual",
    actorId: session.userId,
  });

  if (!result) {
    return { error: "Stok tidak mencukupi untuk pengurangan ini." };
  }

  revalidatePath("/dashboard/petugas/stok");
  return { success: true };
}
