"use server";

import { connectDB } from "@/lib/db";
import { KantongDarah } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { GOLONGAN_DARAH } from "@/lib/blood-types";
import { KOMPONEN_DARAH } from "@/lib/blood-components";

// Returns a paginated, filtered list of blood bags for a specific cabang.
// Used by the petugas stock traceability page.
export async function getKantongByCabang({
  cabangId,
  golonganDarah,
  komponenDarah,
  status,
  page = 1,
  limit = 50,
} = {}) {
  await connectDB();
  const filter = { cabangId };
  if (golonganDarah && GOLONGAN_DARAH.includes(golonganDarah)) {
    filter.golonganDarah = golonganDarah;
  }
  if (komponenDarah && KOMPONEN_DARAH.includes(komponenDarah)) {
    filter.komponenDarah = komponenDarah;
  }
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;
  const [kantongList, total] = await Promise.all([
    KantongDarah.find(filter)
      .populate("donorId", "nama pendonor.nik")
      .populate("partisipasiId", "kegiatanId")
      .sort({ tanggalKadaluarsa: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    KantongDarah.countDocuments(filter),
  ]);

  return { kantongList, total, page, limit };
}

// Returns all blood bags tied to a specific permintaan — used in the
// permintaan detail page for both petugas and rumah_sakit.
export async function getKantongByPermintaan(permintaanId) {
  await connectDB();
  return KantongDarah.find({ permintaanId })
    .populate("donorId", "nama pendonor.golonganDarah")
    .sort({ createdAt: 1 })
    .lean();
}

// Returns all blood bags for a specific donor — used in the pendonor riwayat page.
export async function getKantongByDonor(donorId) {
  await connectDB();
  return KantongDarah.find({ donorId })
    .sort({ tanggalDonor: -1 })
    .lean();
}

// Marks a blood bag as kadaluarsa. This is called from a cron-like admin
// task or a petugas action — not from donor-facing flows.
export async function markKantongKadaluarsa(kantongId) {
  await requireRole("petugas");
  await connectDB();
  return KantongDarah.findByIdAndUpdate(
    kantongId,
    { status: "kadaluarsa" },
    { returnDocument: "after" },
  ).lean();
}
