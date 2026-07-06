"use server";

import { z } from "zod";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Partisipasi, Kegiatan, User } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { verifyDonorQrPayload } from "@/lib/qr";
import { adjustStokDarah } from "@/actions/stok.actions";
import { GOLONGAN_DARAH } from "@/lib/blood-types";
import { isPendonorProfileComplete, tanggalBolehDonorLagi } from "@/lib/pendonor";
import {
  KUESIONER_QUESTIONS,
  isQuestionApplicable,
  evaluateKuesioner,
} from "@/lib/kuesioner-questions";

const kuesionerSchema = z.object({
  kegiatanId: z.string().min(1),
  kehamilanKe: z.coerce.number().optional(),
  catatanTambahan: z.string().optional(),
});

export async function daftarKegiatan(prevState, formData) {
  const session = await requireRole("pendonor");
  const parsed = kuesionerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Jawaban kuesioner tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const donor = await User.findById(session.userId).lean();
  if (!isPendonorProfileComplete(donor)) {
    return {
      error: "Lengkapi data diri Anda terlebih dahulu sebelum mendonorkan darah.",
    };
  }

  const applicableQuestions = KUESIONER_QUESTIONS.filter((q) =>
    isQuestionApplicable(q, donor.pendonor?.jenisKelamin),
  );
  const jawaban = {};
  for (const q of applicableQuestions) {
    const value = formData.get(q.id);
    if (value !== "ya" && value !== "tidak") {
      return { error: "Jawaban kuesioner tidak lengkap atau tidak valid." };
    }
    jawaban[q.id] = value === "ya";
  }
  const { lolos: lolosOtomatis, bermasalah } = evaluateKuesioner(
    jawaban,
    donor.pendonor?.jenisKelamin,
  );

  const lastDonasi = await Partisipasi.findOne({
    donorId: session.userId,
    status: "selesai",
  })
    .sort({ selesaiAt: -1 })
    .lean();
  const eligibleDate = tanggalBolehDonorLagi(lastDonasi?.selesaiAt);
  if (eligibleDate && new Date() < eligibleDate) {
    return {
      error: `Anda baru bisa donor lagi mulai ${eligibleDate.toLocaleDateString("id-ID")} (jarak minimal antar donor).`,
    };
  }

  const kegiatan = await Kegiatan.findOne({
    _id: data.kegiatanId,
    status: "aktif",
  });
  if (!kegiatan) {
    return { error: "Kegiatan tidak ditemukan atau tidak aktif." };
  }

  const terisi = await Partisipasi.countDocuments({ kegiatanId: data.kegiatanId });
  if (terisi >= kegiatan.kuota) {
    return { error: "Kuota kegiatan ini sudah penuh." };
  }

  let partisipasi;
  try {
    partisipasi = await Partisipasi.create({
      donorId: session.userId,
      kegiatanId: data.kegiatanId,
      status: "menunggu_checkin",
      kuesioner: {
        jawaban,
        kehamilanKe: jawaban.sedangHamil ? data.kehamilanKe || undefined : undefined,
        catatanTambahan: data.catatanTambahan || "",
        submittedAt: new Date(),
        lolosOtomatis,
        bermasalah,
      },
    });
  } catch (err) {
    if (err?.code === 11000) {
      return { error: "Anda sudah terdaftar untuk kegiatan ini." };
    }
    throw err;
  }

  revalidatePath("/dashboard/pendonor/kegiatan");
  redirect(`/dashboard/pendonor/kuesioner/${partisipasi._id}`);
}

// Hard-deletes the record rather than marking a "cancelled" status — a
// withdrawn pre-checkin registration has no audit value worth keeping, and
// deleting it frees the donor to register again later (the unique
// {donorId, kegiatanId} index would otherwise block a fresh registration).
export async function batalkanPendaftaran(partisipasiId, prevState, formData) {
  const session = await requireRole("pendonor");
  await connectDB();

  const partisipasi = await Partisipasi.findOne({
    _id: partisipasiId,
    donorId: session.userId,
  });
  if (!partisipasi) {
    return { error: "Pendaftaran tidak ditemukan." };
  }
  if (partisipasi.status !== "menunggu_checkin") {
    return { error: "Pendaftaran ini sudah diproses dan tidak bisa dibatalkan." };
  }

  const kegiatanId = partisipasi.kegiatanId.toString();
  await partisipasi.deleteOne();

  revalidatePath("/dashboard/pendonor/kegiatan");
  revalidatePath(`/dashboard/pendonor/kegiatan/${kegiatanId}`);
  revalidatePath("/dashboard/pendonor/riwayat");
  return { success: true, message: "Pendaftaran berhasil dibatalkan." };
}

const checkinSchema = z.object({
  qrPayload: z.string().min(1),
  kegiatanId: z.string().min(1),
});

export async function checkinDonor(prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = checkinSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data check-in tidak valid." };
  }

  const donorId = verifyDonorQrPayload(parsed.data.qrPayload);
  if (!donorId) {
    return { error: "QR Code tidak valid." };
  }

  await connectDB();
  const donor = await User.findOne({ _id: donorId, role: "pendonor" }).lean();
  if (!donor) {
    return { error: "Akun pendonor tidak ditemukan." };
  }

  const existingCheckedIn = await Partisipasi.findOne({
    donorId,
    kegiatanId: parsed.data.kegiatanId,
    status: { $in: ["checked_in", "lolos_donor", "tidak_lolos", "selesai"] },
  }).lean();
  if (existingCheckedIn) {
    return {
      success: true,
      message: `${donor.nama} sudah check-in sebelumnya.`,
      nama: donor.nama,
    };
  }

  const partisipasi = await Partisipasi.findOneAndUpdate(
    { donorId, kegiatanId: parsed.data.kegiatanId, status: "menunggu_checkin" },
    {
      status: "checked_in",
      checkedInAt: new Date(),
      checkedInBy: session.userId,
    },
    { returnDocument: "after" },
  );

  if (!partisipasi) {
    return {
      error: `${donor.nama} belum mendaftar untuk kegiatan ini.`,
    };
  }

  revalidatePath("/dashboard/petugas/checkin");
  return { success: true, message: `${donor.nama} berhasil check-in.`, nama: donor.nama };
}

const scanForWawancaraSchema = z.object({
  qrPayload: z.string().min(1),
  kegiatanId: z.string().min(1),
});

export async function findPartisipasiForWawancara(prevState, formData) {
  await requireRole("petugas");
  const parsed = scanForWawancaraSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak valid." };
  }

  const donorId = verifyDonorQrPayload(parsed.data.qrPayload);
  if (!donorId) {
    return { error: "QR Code tidak valid." };
  }

  await connectDB();
  const partisipasi = await Partisipasi.findOne({
    donorId,
    kegiatanId: parsed.data.kegiatanId,
    status: "checked_in",
  })
    .populate("donorId", "nama telepon pendonor")
    .lean();

  if (!partisipasi) {
    const donor = await User.findById(donorId).lean();
    return {
      error: `${donor?.nama || "Pendonor"} belum check-in atau sudah diwawancara untuk kegiatan ini.`,
    };
  }

  return { success: true, partisipasi: JSON.parse(JSON.stringify(partisipasi)) };
}

const wawancaraSchema = z.object({
  tensiSistol: z.coerce.number().min(1),
  tensiDiastol: z.coerce.number().min(1),
  beratBadan: z.coerce.number().min(1),
  hemoglobin: z.coerce.number().min(1),
  golonganDarah: z.enum(GOLONGAN_DARAH).optional(),
  catatan: z.string().optional(),
  hasil: z.enum(["lolos", "tidak_lolos"]),
});

export async function submitWawancara(partisipasiId, prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = wawancaraSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data wawancara tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const partisipasi = await Partisipasi.findOne({
    _id: partisipasiId,
    status: "checked_in",
  });
  if (!partisipasi) {
    return { error: "Data partisipasi tidak ditemukan atau sudah diproses." };
  }

  const kegiatan = await Kegiatan.findById(partisipasi.kegiatanId).lean();
  const wawancara = {
    tensiSistol: data.tensiSistol,
    tensiDiastol: data.tensiDiastol,
    beratBadan: data.beratBadan,
    hemoglobin: data.hemoglobin,
    catatan: data.catatan || "",
    hasil: data.hasil,
    petugasId: session.userId,
    interviewedAt: new Date(),
  };

  if (data.hasil === "tidak_lolos") {
    partisipasi.wawancara = wawancara;
    partisipasi.status = "tidak_lolos";
    await partisipasi.save();
    revalidatePath("/dashboard/petugas/wawancara");
    return { success: true, message: "Hasil wawancara: tidak lolos donor." };
  }

  if (!data.golonganDarah) {
    return { error: "Golongan darah wajib diisi untuk menyelesaikan donor." };
  }

  const mongoSession = await mongoose.startSession();
  try {
    await mongoSession.withTransaction(async () => {
      partisipasi.wawancara = wawancara;
      partisipasi.status = "selesai";
      partisipasi.selesaiAt = new Date();
      partisipasi.golonganDarahSaatDonor = data.golonganDarah || null;
      await partisipasi.save({ session: mongoSession });

      if (data.golonganDarah) {
        await User.updateOne(
          { _id: partisipasi.donorId, "pendonor.golonganDarah": null },
          { $set: { "pendonor.golonganDarah": data.golonganDarah } },
          { session: mongoSession },
        );
      }

      const result = await adjustStokDarah({
        cabangId: kegiatan.cabangId,
        golonganDarah: data.golonganDarah,
        // A fresh donation always yields whole blood — PMI lab staff split
        // it into other components later via manual stock correction.
        komponenDarah: "WB",
        delta: 1,
        alasan: "donasi_selesai",
        refId: partisipasi._id,
        actorId: session.userId,
        session: mongoSession,
      });

      if (!result) {
        throw new Error("Gagal memperbarui stok darah.");
      }
    });
  } finally {
    await mongoSession.endSession();
  }

  revalidatePath("/dashboard/petugas/wawancara");
  revalidatePath("/dashboard/petugas/stok");
  return { success: true, message: "Donor selesai, stok darah diperbarui." };
}
