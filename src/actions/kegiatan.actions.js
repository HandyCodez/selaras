"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Kegiatan, Partisipasi } from "@/lib/models";
import { requireRole } from "@/lib/auth";

const kegiatanSchema = z.object({
  judul: z.string().min(1),
  deskripsi: z.string().optional(),
  lokasi: z.string().min(1),
  kuota: z.coerce.number().int().min(1),
  tanggalMulai: z.string().min(1),
  tanggalSelesai: z.string().min(1),
  status: z.enum(["draft", "aktif", "selesai", "dibatalkan"]),
  tipe: z.enum(["umum", "internal"]),
});

export async function createKegiatan(prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = kegiatanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data kegiatan tidak valid." };
  }
  const data = parsed.data;

  if (new Date(data.tanggalSelesai) < new Date(data.tanggalMulai)) {
    return { error: "Tanggal selesai harus setelah tanggal mulai." };
  }

  await connectDB();
  await Kegiatan.create({
    cabangId: session.cabangId,
    judul: data.judul,
    deskripsi: data.deskripsi || "",
    lokasi: data.lokasi,
    kuota: data.kuota,
    tanggalMulai: data.tanggalMulai,
    tanggalSelesai: data.tanggalSelesai,
    status: data.status,
    tipe: data.tipe,
    createdBy: session.userId,
  });

  revalidatePath("/dashboard/petugas/kegiatan");
  redirect("/dashboard/petugas/kegiatan");
}

export async function updateKegiatan(kegiatanId, prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = kegiatanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data kegiatan tidak valid." };
  }
  const data = parsed.data;

  if (new Date(data.tanggalSelesai) < new Date(data.tanggalMulai)) {
    return { error: "Tanggal selesai harus setelah tanggal mulai." };
  }

  await connectDB();
  const kegiatan = await Kegiatan.findOne({
    _id: kegiatanId,
    cabangId: session.cabangId,
  });
  if (!kegiatan) {
    return { error: "Kegiatan tidak ditemukan." };
  }

  const terisi = await Partisipasi.countDocuments({ kegiatanId });
  if (data.kuota < terisi) {
    return {
      error: `Kuota tidak boleh kurang dari jumlah pendonor yang sudah terdaftar (${terisi}).`,
    };
  }

  kegiatan.set({
    judul: data.judul,
    deskripsi: data.deskripsi || "",
    lokasi: data.lokasi,
    kuota: data.kuota,
    tanggalMulai: data.tanggalMulai,
    tanggalSelesai: data.tanggalSelesai,
    status: data.status,
    tipe: data.tipe,
  });
  await kegiatan.save();

  revalidatePath("/dashboard/petugas/kegiatan");
  revalidatePath(`/dashboard/petugas/kegiatan/${kegiatanId}`);
  redirect("/dashboard/petugas/kegiatan");
}

// Quick status change from the list/detail view (no need to open the edit
// form). Only allows the two "closing" transitions — reopening back to
// draft/aktif still goes through the full edit form.
export async function setKegiatanStatus(kegiatanId, status) {
  const session = await requireRole("petugas");
  if (!["selesai", "dibatalkan"].includes(status)) return;

  await connectDB();
  await Kegiatan.updateOne(
    { _id: kegiatanId, cabangId: session.cabangId },
    { status },
  );

  revalidatePath("/dashboard/petugas/kegiatan");
  revalidatePath(`/dashboard/petugas/kegiatan/${kegiatanId}`);
}

// Only allowed when no pendonor has registered yet — any Partisipasi record
// (even a still-pending one) represents real donor commitment/data that
// must not silently disappear when a kegiatan is removed.
export async function deleteKegiatan(kegiatanId, prevState, formData) {
  const session = await requireRole("petugas");
  await connectDB();

  const kegiatan = await Kegiatan.findOne({
    _id: kegiatanId,
    cabangId: session.cabangId,
  });
  if (!kegiatan) {
    return { error: "Kegiatan tidak ditemukan." };
  }

  const partisipasiCount = await Partisipasi.countDocuments({ kegiatanId });
  if (partisipasiCount > 0) {
    return {
      error: `Tidak bisa menghapus: sudah ada ${partisipasiCount} pendonor terdaftar di kegiatan ini. Batalkan kegiatan ini saja jika tidak jadi dilaksanakan.`,
    };
  }

  await kegiatan.deleteOne();

  revalidatePath("/dashboard/petugas/kegiatan");
  return { success: true };
}
