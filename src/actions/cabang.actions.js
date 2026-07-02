"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { PmiCabang, User, Kegiatan, PermintaanDarah, StokDarah } from "@/lib/models";
import { requireRole } from "@/lib/auth";

const cabangSchema = z.object({
  nama: z.string().min(1),
  kota: z.string().min(1),
  alamat: z.string().optional(),
  telepon: z.string().optional(),
});

export async function createCabang(prevState, formData) {
  await requireRole("admin");
  const parsed = cabangSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data cabang tidak valid." };
  }

  await connectDB();
  await PmiCabang.create({
    nama: parsed.data.nama,
    kota: parsed.data.kota,
    alamat: parsed.data.alamat || "",
    telepon: parsed.data.telepon || "",
  });

  revalidatePath("/dashboard/admin/cabang");
  redirect("/dashboard/admin/cabang");
}

export async function updateCabang(cabangId, prevState, formData) {
  await requireRole("admin");
  const parsed = cabangSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data cabang tidak valid." };
  }

  await connectDB();
  const cabang = await PmiCabang.findById(cabangId);
  if (!cabang) {
    return { error: "Cabang tidak ditemukan." };
  }

  cabang.set({
    nama: parsed.data.nama,
    kota: parsed.data.kota,
    alamat: parsed.data.alamat || "",
    telepon: parsed.data.telepon || "",
  });
  await cabang.save();

  revalidatePath("/dashboard/admin/cabang");
  redirect("/dashboard/admin/cabang");
}

export async function toggleCabangActive(cabangId) {
  await requireRole("admin");
  await connectDB();
  const cabang = await PmiCabang.findById(cabangId);
  if (!cabang) return;
  cabang.isActive = !cabang.isActive;
  await cabang.save();
  revalidatePath("/dashboard/admin/cabang");
}

// Only allowed once the cabang has no dependent records left — petugas
// accounts, kegiatan, hospital requests, or blood stock all reference
// cabangId, and deleting through them would either orphan that data or
// silently erase audit trail (checkedInBy/petugasId/createdBy). Admin must
// reassign/deactivate petugas and clear stock/kegiatan/permintaan first.
export async function deleteCabang(cabangId, prevState, formData) {
  await requireRole("admin");
  await connectDB();

  const cabang = await PmiCabang.findById(cabangId);
  if (!cabang) {
    return { error: "Cabang tidak ditemukan." };
  }

  const [petugasCount, kegiatanCount, permintaanCount, stokAgg] = await Promise.all([
    User.countDocuments({ "petugas.cabangId": cabangId }),
    Kegiatan.countDocuments({ cabangId }),
    PermintaanDarah.countDocuments({ cabangId }),
    StokDarah.aggregate([
      { $match: { cabangId: cabang._id } },
      { $group: { _id: null, total: { $sum: "$jumlahKantong" } } },
    ]),
  ]);
  const stokTotal = stokAgg[0]?.total || 0;

  const reasons = [];
  if (petugasCount > 0) reasons.push(`${petugasCount} akun petugas`);
  if (kegiatanCount > 0) reasons.push(`${kegiatanCount} kegiatan donor`);
  if (permintaanCount > 0) reasons.push(`${permintaanCount} permintaan darah`);
  if (stokTotal > 0) reasons.push(`${stokTotal} kantong stok darah`);

  if (reasons.length > 0) {
    return {
      error: `Tidak bisa menghapus: masih ada ${reasons.join(", ")} yang terhubung ke cabang ini. Pindahkan/nonaktifkan petugas dan pastikan tidak ada kegiatan, permintaan, atau stok tersisa.`,
    };
  }

  await StokDarah.deleteMany({ cabangId });
  await cabang.deleteOne();

  revalidatePath("/dashboard/admin/cabang");
  return { success: true };
}
