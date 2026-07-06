"use server";

import { z } from "zod";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { PermintaanDarah, User } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { logout } from "@/actions/auth.actions";
import { adjustStokDarah } from "@/actions/stok.actions";
import { GOLONGAN_DARAH } from "@/lib/blood-types";
import { KOMPONEN_DARAH, fulfillFieldName } from "@/lib/blood-components";

const createSchema = z.object({
  cabangId: z.string().min(1),
  urgensi: z.enum(["biasa", "mendesak"]),
  catatan: z.string().optional(),
});

const permintaanItemSchema = z.object({
  golonganDarah: z.enum(GOLONGAN_DARAH),
  komponenDarah: z.enum(KOMPONEN_DARAH),
  jumlah: z.coerce.number().int().min(1),
});

export async function createPermintaan(prevState, formData) {
  const session = await requireRole("rumah_sakit");
  const raw = Object.fromEntries(formData.entries());
  const parsed = createSchema.safeParse(raw);

  let itemsRaw;
  try {
    itemsRaw = JSON.parse(raw.itemsJson || "[]");
  } catch {
    return { error: "Data permintaan tidak valid." };
  }
  const itemsParsed = z.array(permintaanItemSchema).safeParse(itemsRaw);
  if (!parsed.success || !itemsParsed.success || itemsParsed.data.length === 0) {
    return { error: "Isi minimal satu kantong darah yang dibutuhkan." };
  }

  // Merge duplicate golongan+komponen rows the donor may have entered twice.
  const merged = new Map();
  for (const item of itemsParsed.data) {
    const key = `${item.golonganDarah}|${item.komponenDarah}`;
    merged.set(key, (merged.get(key) || 0) + item.jumlah);
  }
  const items = [...merged.entries()].map(([key, jumlah]) => {
    const [golonganDarah, komponenDarah] = key.split("|");
    return { golonganDarah, komponenDarah, jumlahDiminta: jumlah };
  });

  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user?.rumahSakit?.rumahSakitId) {
    await logout();
  }

  const permintaan = await PermintaanDarah.create({
    rumahSakitId: user.rumahSakit.rumahSakitId,
    cabangId: parsed.data.cabangId,
    requestedBy: session.userId,
    items,
    urgensi: parsed.data.urgensi,
    catatan: parsed.data.catatan || "",
  });

  revalidatePath("/dashboard/rumah-sakit/permintaan");
  redirect(`/dashboard/rumah-sakit/permintaan/${permintaan._id}`);
}

export async function tolakPermintaan(permintaanId, prevState, formData) {
  const session = await requireRole("petugas");
  await connectDB();

  const permintaan = await PermintaanDarah.findOne({
    _id: permintaanId,
    cabangId: session.cabangId,
    status: "menunggu",
  });
  if (!permintaan) {
    return { error: "Permintaan tidak ditemukan atau sudah diproses." };
  }

  permintaan.status = "ditolak";
  permintaan.catatanPetugas = formData.get("catatan") || "";
  permintaan.handledBy = session.userId;
  permintaan.handledAt = new Date();
  await permintaan.save();

  revalidatePath(`/dashboard/petugas/permintaan/${permintaanId}`);
  revalidatePath("/dashboard/petugas/permintaan");
  revalidatePath(`/dashboard/rumah-sakit/permintaan/${permintaanId}`);
  return { success: true, message: "Permintaan ditolak." };
}

// Only allowed while still "menunggu" — nothing has touched stock yet at
// that point, so a hard delete is safe (matches batalkanPendaftaran's
// pattern for pre-commitment cancellations).
export async function batalkanPermintaan(permintaanId, prevState, formData) {
  const session = await requireRole("rumah_sakit");
  await connectDB();

  const user = await User.findById(session.userId).lean();
  if (!user?.rumahSakit?.rumahSakitId) {
    await logout();
  }

  const permintaan = await PermintaanDarah.findOne({
    _id: permintaanId,
    rumahSakitId: user.rumahSakit.rumahSakitId,
    status: "menunggu",
  });
  if (!permintaan) {
    return { error: "Permintaan tidak ditemukan atau sudah diproses." };
  }

  await permintaan.deleteOne();

  revalidatePath("/dashboard/rumah-sakit/permintaan");
  return { success: true, message: "Permintaan dibatalkan." };
}

export async function konfirmasiPermintaan(permintaanId, prevState, formData) {
  const session = await requireRole("petugas");
  await connectDB();

  const permintaan = await PermintaanDarah.findOne({
    _id: permintaanId,
    cabangId: session.cabangId,
    status: "menunggu",
  });
  if (!permintaan) {
    return { error: "Permintaan tidak ditemukan atau sudah diproses." };
  }

  const mongoSession = await mongoose.startSession();
  let anyFulfilled = false;
  let allFulfilled = true;

  try {
    await mongoSession.withTransaction(async () => {
      for (const item of permintaan.items) {
        const requestedFulfill = Math.min(
          Number(
            formData.get(fulfillFieldName(item.golonganDarah, item.komponenDarah)) || 0,
          ),
          item.jumlahDiminta,
        );
        if (requestedFulfill <= 0) {
          allFulfilled = false;
          continue;
        }

        const result = await adjustStokDarah({
          cabangId: permintaan.cabangId,
          golonganDarah: item.golonganDarah,
          komponenDarah: item.komponenDarah,
          delta: -requestedFulfill,
          alasan: "permintaan_dipenuhi",
          refId: permintaan._id,
          actorId: session.userId,
          session: mongoSession,
        });

        if (!result) {
          allFulfilled = false;
          continue;
        }

        item.jumlahDipenuhi = requestedFulfill;
        anyFulfilled = true;
        if (requestedFulfill < item.jumlahDiminta) {
          allFulfilled = false;
        }
      }

      permintaan.status = anyFulfilled
        ? allFulfilled
          ? "dikonfirmasi"
          : "sebagian"
        : "ditolak";
      permintaan.catatanPetugas = formData.get("catatan") || "";
      permintaan.handledBy = session.userId;
      permintaan.handledAt = new Date();
      await permintaan.save({ session: mongoSession });
    });
  } finally {
    await mongoSession.endSession();
  }

  revalidatePath(`/dashboard/petugas/permintaan/${permintaanId}`);
  revalidatePath("/dashboard/petugas/permintaan");
  revalidatePath("/dashboard/petugas/stok");
  revalidatePath(`/dashboard/rumah-sakit/permintaan/${permintaanId}`);

  if (!anyFulfilled) {
    return { error: "Stok tidak mencukupi untuk memenuhi permintaan ini." };
  }
  return {
    success: true,
    message: allFulfilled
      ? "Permintaan berhasil dikonfirmasi penuh."
      : "Permintaan dipenuhi sebagian (stok tidak mencukupi untuk sisanya).",
  };
}
