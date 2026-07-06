import mongoose from "mongoose";
import { GOLONGAN_DARAH } from "../blood-types.js";
import { KOMPONEN_DARAH } from "../blood-components.js";

const PermintaanItemSchema = new mongoose.Schema(
  {
    golonganDarah: { type: String, enum: GOLONGAN_DARAH, required: true },
    komponenDarah: { type: String, enum: KOMPONEN_DARAH, required: true },
    jumlahDiminta: { type: Number, required: true, min: 1 },
    jumlahDipenuhi: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const PermintaanDarahSchema = new mongoose.Schema(
  {
    rumahSakitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RumahSakit",
      required: true,
      index: true,
    },
    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PmiCabang",
      required: true,
      index: true,
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: { type: [PermintaanItemSchema], required: true },
    urgensi: {
      type: String,
      enum: ["biasa", "mendesak"],
      default: "biasa",
    },
    status: {
      type: String,
      enum: ["menunggu", "dikonfirmasi", "sebagian", "ditolak", "selesai"],
      default: "menunggu",
      index: true,
    },
    catatan: { type: String, default: "" },
    catatanPetugas: { type: String, default: "" },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    handledAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.PermintaanDarah ||
  mongoose.model("PermintaanDarah", PermintaanDarahSchema);
