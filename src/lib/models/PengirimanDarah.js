import mongoose from "mongoose";

// Auto-generate a human-readable shipment reference: PMI-YYYYMMDD-XXXXX
function generateNomorResi() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `PMI-${date}-${suffix}`;
}

const PengirimanDarahSchema = new mongoose.Schema(
  {
    nomorResi: {
      type: String,
      required: true,
      unique: true,
      default: generateNomorResi,
      index: true,
    },

    // The blood request this shipment fulfils (1-to-1)
    permintaanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PermintaanDarah",
      required: true,
      index: true,
    },

    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PmiCabang",
      required: true,
      index: true,
    },

    rumahSakitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RumahSakit",
      required: true,
      index: true,
    },

    // The individual blood bags included in this shipment
    kantongIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "KantongDarah",
      },
    ],

    // disiapkan → dikirim → diterima → selesai
    // "disiapkan" means ready to ship but not yet dispatched.
    // "selesai"   means RS has confirmed all bags are accounted for.
    status: {
      type: String,
      enum: ["disiapkan", "dikirim", "diterima", "selesai"],
      default: "disiapkan",
      index: true,
    },

    // Set when the PMI officer dispatches the shipment
    tanggalKirim: { type: Date, default: null },
    estimasiTiba: { type: Date, default: null },
    petugasKirimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    catatanPengiriman: { type: String, default: "" },

    // Set when the RS confirms receipt
    tanggalTiba: { type: Date, default: null },
    penerimaDiRSId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    catatanPenerimaan: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.PengirimanDarah ||
  mongoose.model("PengirimanDarah", PengirimanDarahSchema);
