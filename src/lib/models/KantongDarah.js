import mongoose from "mongoose";
import { GOLONGAN_DARAH } from "../blood-types.js";
import { KOMPONEN_DARAH } from "../blood-components.js";

// Generates a unique bag number in the format SEL-YYYYMMDD-XXXXX.
function generateNomorKantong() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `SEL-${date}-${suffix}`;
}

// Expiry durations (days) per blood component, based on standard PMI / WHO guidelines.
const EXPIRY_DAYS = {
  WB: 35,
  PRC: 35,
  TC: 5,
  FFP: 365,
  AHF: 365,
  PRC_LD_TC: 35,
  AFERESIS: 5,
};

function computeExpiry(komponenDarah, tanggalDonor) {
  const days = EXPIRY_DAYS[komponenDarah] ?? 35;
  const d = new Date(tanggalDonor);
  d.setDate(d.getDate() + days);
  return d;
}

const KantongDarahSchema = new mongoose.Schema(
  {
    nomorKantong: {
      type: String,
      required: true,
      unique: true,
      default: generateNomorKantong,
      index: true,
    },

    // Donor identity
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The donation session that produced this bag
    partisipasiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partisipasi",
      required: true,
      index: true,
    },

    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PmiCabang",
      required: true,
      index: true,
    },

    golonganDarah: { type: String, enum: GOLONGAN_DARAH, required: true },
    // Always "WB" at creation; can be updated via manual correction.
    komponenDarah: { type: String, enum: KOMPONEN_DARAH, required: true, default: "WB" },

    tanggalDonor: { type: Date, required: true },
    tanggalKadaluarsa: { type: Date, required: true },

    // Full lifecycle:
    // tersedia → dialokasikan → dalam_pengiriman → diterima_rs → digunakan
    // Side exits: dikembalikan, kadaluarsa, dibuang
    status: {
      type: String,
      enum: [
        "tersedia",
        "dialokasikan",
        "dalam_pengiriman",
        "diterima_rs",
        "digunakan",
        "dikembalikan",
        "kadaluarsa",
        "dibuang",
      ],
      default: "tersedia",
      index: true,
    },

    // Filled when allocated to a blood request.
    permintaanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PermintaanDarah",
      default: null,
    },
    // Filled when included in a shipment.
    pengirimanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PengirimanDarah",
      default: null,
    },
    usedAt: { type: Date, default: null },
    diterimaPadaTanggal: { type: Date, default: null },
    digunakanPadaTanggal: { type: Date, default: null },
    catatanRS: { type: String, default: "" },
  },
  { timestamps: true },
);

KantongDarahSchema.index({ cabangId: 1, golonganDarah: 1, komponenDarah: 1, status: 1 });
KantongDarahSchema.index({ donorId: 1, createdAt: -1 });

// Convenience static — creates a WB bag from a completed partisipasi.
KantongDarahSchema.statics.createFromDonasi = function ({
  donorId,
  partisipasiId,
  cabangId,
  golonganDarah,
  tanggalDonor,
  mongoSession,
}) {
  const tanggalKadaluarsa = computeExpiry("WB", tanggalDonor);
  return this.create(
    [
      {
        nomorKantong: generateNomorKantong(),
        donorId,
        partisipasiId,
        cabangId,
        golonganDarah,
        komponenDarah: "WB",
        tanggalDonor,
        tanggalKadaluarsa,
        status: "tersedia",
      },
    ],
    { session: mongoSession },
  );
};

export { computeExpiry };
export default mongoose.models.KantongDarah ||
  mongoose.model("KantongDarah", KantongDarahSchema);
