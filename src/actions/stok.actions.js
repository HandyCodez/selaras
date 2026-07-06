"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { StokDarah, StokDarahLog } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { GOLONGAN_DARAH } from "@/lib/blood-types";
import { KOMPONEN_DARAH } from "@/lib/blood-components";

// Atomic stock adjustment. Never read-then-write: increments upsert (only
// insert-on-increase), decrements use a conditional $gte filter so two
// concurrent decrements can never overdraw the same document.
export async function adjustStokDarah({
  cabangId,
  golonganDarah,
  komponenDarah,
  delta,
  alasan,
  refId,
  actorId,
  session,
}) {
  const filter = { cabangId, golonganDarah, komponenDarah };
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
    [{ cabangId, golonganDarah, komponenDarah, delta, alasan, refId, actorId }],
    { session },
  );

  return updated;
}

// Stock for a single komponen darah, one row per golongan darah.
export async function getStokByCabang(cabangId, komponenDarah) {
  await connectDB();
  const docs = await StokDarah.find({ cabangId, komponenDarah }).lean();
  const byGolongan = Object.fromEntries(
    docs.map((d) => [d.golonganDarah, d.jumlahKantong]),
  );
  return GOLONGAN_DARAH.map((gol) => ({
    golonganDarah: gol,
    komponenDarah,
    jumlahKantong: byGolongan[gol] || 0,
  }));
}

// Flat map of every {golonganDarah, komponenDarah} combo for a cabang,
// keyed as "golongan|komponen" — used where a single view spans multiple
// komponen at once (e.g. confirming a multi-item blood request).
export async function getStokMapByCabang(cabangId) {
  await connectDB();
  const docs = await StokDarah.find({ cabangId }).lean();
  return Object.fromEntries(
    docs.map((d) => [`${d.golonganDarah}|${d.komponenDarah}`, d.jumlahKantong]),
  );
}

const koreksiSchema = z.object({
  golonganDarah: z.enum(GOLONGAN_DARAH),
  komponenDarah: z.enum(KOMPONEN_DARAH),
  delta: z.coerce.number().int(),
});

export async function koreksiStokManual(prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = koreksiSchema.safeParse({
    golonganDarah: formData.get("golonganDarah"),
    komponenDarah: formData.get("komponenDarah"),
    delta: formData.get("delta"),
  });
  if (!parsed.success || parsed.data.delta === 0) {
    return { error: "Jumlah koreksi tidak valid." };
  }

  await connectDB();
  const result = await adjustStokDarah({
    cabangId: session.cabangId,
    golonganDarah: parsed.data.golonganDarah,
    komponenDarah: parsed.data.komponenDarah,
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
