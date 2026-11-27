"use server";

import { z } from "zod";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { PengirimanDarah, KantongDarah, PermintaanDarah, User } from "@/lib/models";
import { requireRole } from "@/lib/auth";

// ─── Petugas: Buat pengiriman dari permintaan yang sudah dikonfirmasi ─────────

const buatPengirimanSchema = z.object({
  permintaanId: z.string().min(1),
  catatanPengiriman: z.string().optional(),
  estimasiTiba: z.string().optional(),
});

export async function buatPengiriman(prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = buatPengirimanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Data tidak valid." };
  const data = parsed.data;

  await connectDB();

  // Verify the permintaan belongs to this cabang and is in a fulfilled state
  const permintaan = await PermintaanDarah.findOne({
    _id: data.permintaanId,
    cabangId: session.cabangId,
    status: { $in: ["dikonfirmasi", "sebagian"] },
  }).lean();
  if (!permintaan) {
    return { error: "Permintaan tidak ditemukan atau belum dikonfirmasi." };
  }

  // Guard: prevent duplicate shipment for the same permintaan
  const existing = await PengirimanDarah.findOne({ permintaanId: data.permintaanId }).lean();
  if (existing) {
    return { error: "Pengiriman untuk permintaan ini sudah dibuat." };
  }

  // Collect available/allocated bags for this permintaan
  const kantongList = await KantongDarah.find({
    permintaanId: data.permintaanId,
    status: { $in: ["tersedia", "dialokasikan"] },
  })
    .select("_id")
    .lean();

  const mongoSession = await mongoose.startSession();
  let pengirimanId;
  try {
    await mongoSession.withTransaction(async () => {
      const [pengiriman] = await PengirimanDarah.create(
        [
          {
            permintaanId: data.permintaanId,
            cabangId: session.cabangId,
            rumahSakitId: permintaan.rumahSakitId,
            kantongIds: kantongList.map((k) => k._id),
            status: "disiapkan",
            estimasiTiba: data.estimasiTiba ? new Date(data.estimasiTiba) : null,
            catatanPengiriman: data.catatanPengiriman || "",
          },
        ],
        { session: mongoSession },
      );
      pengirimanId = pengiriman._id.toString();

      // Mark all bags as allocated to this shipment
      if (kantongList.length > 0) {
        await KantongDarah.updateMany(
          { _id: { $in: kantongList.map((k) => k._id) } },
          { status: "dialokasikan", pengirimanId: pengiriman._id },
          { session: mongoSession },
        );
      }
    });
  } finally {
    await mongoSession.endSession();
  }

  revalidatePath(`/dashboard/petugas/permintaan/${data.permintaanId}`);
  revalidatePath("/dashboard/petugas/pengiriman");
  redirect(`/dashboard/petugas/pengiriman/${pengirimanId}`);
}

// ─── Petugas: Tandai dikirim ──────────────────────────────────────────────────

export async function tandaiDikirim(pengirimanId, prevState, formData) {
  const session = await requireRole("petugas");
  await connectDB();

  const pengiriman = await PengirimanDarah.findOne({
    _id: pengirimanId,
    cabangId: session.cabangId,
    status: "disiapkan",
  });
  if (!pengiriman) {
    return { error: "Pengiriman tidak ditemukan atau sudah dikirim." };
  }

  const mongoSession = await mongoose.startSession();
  try {
    await mongoSession.withTransaction(async () => {
      pengiriman.status = "dikirim";
      pengiriman.tanggalKirim = new Date();
      pengiriman.petugasKirimId = session.userId;
      await pengiriman.save({ session: mongoSession });

      await KantongDarah.updateMany(
        { pengirimanId: pengiriman._id },
        { status: "dalam_pengiriman" },
        { session: mongoSession },
      );
    });
  } finally {
    await mongoSession.endSession();
  }

  revalidatePath(`/dashboard/petugas/pengiriman/${pengirimanId}`);
  revalidatePath("/dashboard/petugas/pengiriman");
  revalidatePath(`/dashboard/rumah-sakit/pengiriman/${pengirimanId}`);
  revalidatePath("/dashboard/rumah-sakit/pengiriman");
  return { success: true, message: "Pengiriman berhasil ditandai sebagai dikirim." };
}

// ─── RS: Konfirmasi terima ────────────────────────────────────────────────────

const konfirmasiTerimaSchema = z.object({
  catatanPenerimaan: z.string().optional(),
});

export async function konfirmasiTerima(pengirimanId, prevState, formData) {
  const session = await requireRole("rumah_sakit");
  const parsed = konfirmasiTerimaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Data tidak valid." };

  await connectDB();

  const user = await User.findById(session.userId).lean();
  if (!user?.rumahSakit?.rumahSakitId) {
    return { error: "Data akun rumah sakit tidak lengkap." };
  }

  const pengiriman = await PengirimanDarah.findOne({
    _id: pengirimanId,
    rumahSakitId: user.rumahSakit.rumahSakitId,
    status: "dikirim",
  });
  if (!pengiriman) {
    return { error: "Pengiriman tidak ditemukan atau belum dikirim." };
  }

  const mongoSession = await mongoose.startSession();
  try {
    await mongoSession.withTransaction(async () => {
      pengiriman.status = "diterima";
      pengiriman.tanggalTiba = new Date();
      pengiriman.penerimaDiRSId = session.userId;
      pengiriman.catatanPenerimaan = parsed.data.catatanPenerimaan || "";
      await pengiriman.save({ session: mongoSession });

      await KantongDarah.updateMany(
        { pengirimanId: pengiriman._id },
        { status: "diterima_rs", diterimaPadaTanggal: pengiriman.tanggalTiba },
        { session: mongoSession },
      );
    });
  } finally {
    await mongoSession.endSession();
  }

  revalidatePath(`/dashboard/rumah-sakit/pengiriman/${pengirimanId}`);
  revalidatePath("/dashboard/rumah-sakit/pengiriman");
  revalidatePath(`/dashboard/petugas/pengiriman/${pengirimanId}`);
  return { success: true, message: "Penerimaan berhasil dikonfirmasi." };
}

// ─── RS: Tandai satu kantong sebagai digunakan ───────────────────────────────

export async function tandaiDigunakan(kantongId, prevState, formData) {
  const session = await requireRole("rumah_sakit");
  await connectDB();

  const user = await User.findById(session.userId).lean();
  if (!user?.rumahSakit?.rumahSakitId) {
    return { error: "Data akun rumah sakit tidak lengkap." };
  }

  // Verify the bag belongs to a shipment destined for this RS
  const kantong = await KantongDarah.findOne({
    _id: kantongId,
    status: "diterima_rs",
  }).populate("pengirimanId", "rumahSakitId");
  if (!kantong) {
    return { error: "Kantong tidak ditemukan atau belum diterima." };
  }
  if (
    kantong.pengirimanId?.rumahSakitId?.toString() !==
    user.rumahSakit.rumahSakitId.toString()
  ) {
    return { error: "Akses ditolak." };
  }

  const catatanRS = formData.get("catatanRS") || "";
  const now = new Date();
  kantong.status = "digunakan";
  kantong.digunakanPadaTanggal = now;
  kantong.usedAt = now;
  kantong.catatanRS = catatanRS;
  await kantong.save();

  // Check whether all bags in the shipment are accounted for
  const pengirimanId = kantong.pengirimanId._id;
  const stillPending = await KantongDarah.countDocuments({
    pengirimanId,
    status: "diterima_rs",
  });
  if (stillPending === 0) {
    await PengirimanDarah.findByIdAndUpdate(pengirimanId, { status: "selesai" });
  }

  revalidatePath(`/dashboard/rumah-sakit/pengiriman/${pengirimanId}`);
  revalidatePath("/dashboard/rumah-sakit/pengiriman");
  return { success: true, message: "Kantong berhasil ditandai digunakan." };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getPengirimanByCabang({ cabangId, status, limit = 50 } = {}) {
  await connectDB();
  const filter = { cabangId };
  if (status) filter.status = status;
  return PengirimanDarah.find(filter)
    .populate("permintaanId", "urgensi status")
    .populate("rumahSakitId", "nama kota")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getPengirimanByRumahSakit({ rumahSakitId, status, limit = 50 } = {}) {
  await connectDB();
  const filter = { rumahSakitId };
  if (status) filter.status = status;
  return PengirimanDarah.find(filter)
    .populate("permintaanId", "urgensi status")
    .populate("cabangId", "nama kota")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getPengirimanDetail(id) {
  await connectDB();
  return PengirimanDarah.findById(id)
    .populate("permintaanId", "urgensi status catatan catatanPetugas items")
    .populate("cabangId", "nama kota alamat telepon")
    .populate("rumahSakitId", "nama kota alamat")
    .populate("petugasKirimId", "nama")
    .populate("penerimaDiRSId", "nama")
    .populate({
      path: "kantongIds",
      populate: { path: "donorId", select: "nama" },
    })
    .lean();
}

export async function getPengirimanByPermintaan(permintaanId) {
  await connectDB();
  return PengirimanDarah.findOne({ permintaanId })
    .populate("petugasKirimId", "nama")
    .populate("penerimaDiRSId", "nama")
    .lean();
}
