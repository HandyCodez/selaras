import mongoose from "mongoose";

const KegiatanSchema = new mongoose.Schema(
  {
    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PmiCabang",
      required: true,
      index: true,
    },
    judul: { type: String, required: true },
    deskripsi: { type: String, default: "" },
    lokasi: { type: String, required: true },
    kuota: { type: Number, required: true, min: 1, default: 50 },
    tanggalMulai: { type: Date, required: true },
    tanggalSelesai: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "aktif", "selesai", "dibatalkan"],
      default: "draft",
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

KegiatanSchema.index({ cabangId: 1, status: 1, tanggalMulai: 1 });

export default mongoose.models.Kegiatan ||
  mongoose.model("Kegiatan", KegiatanSchema);
