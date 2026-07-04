import mongoose from "mongoose";
import { GOLONGAN_DARAH } from "../blood-types.js";

const KuesionerSchema = new mongoose.Schema(
  {
    // Keyed by question id from src/lib/kuesioner-questions.js -> boolean answer.
    jawaban: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
    kehamilanKe: { type: Number },
    catatanTambahan: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const WawancaraSchema = new mongoose.Schema(
  {
    tensiSistol: { type: Number },
    tensiDiastol: { type: Number },
    beratBadan: { type: Number },
    hemoglobin: { type: Number },
    catatan: { type: String, default: "" },
    hasil: { type: String, enum: ["lolos", "tidak_lolos"] },
    petugasId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    interviewedAt: { type: Date },
  },
  { _id: false },
);

const PartisipasiSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    kegiatanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kegiatan",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "menunggu_checkin",
        "checked_in",
        "lolos_donor",
        "tidak_lolos",
        "selesai",
      ],
      default: "menunggu_checkin",
      index: true,
    },
    kuesioner: { type: KuesionerSchema, default: () => ({}) },
    wawancara: { type: WawancaraSchema, default: undefined },
    golonganDarahSaatDonor: { type: String, enum: [...GOLONGAN_DARAH, null], default: null },
    checkedInAt: { type: Date },
    checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    selesaiAt: { type: Date },
  },
  { timestamps: true },
);

PartisipasiSchema.index({ donorId: 1, kegiatanId: 1 }, { unique: true });

export default mongoose.models.Partisipasi ||
  mongoose.model("Partisipasi", PartisipasiSchema);
