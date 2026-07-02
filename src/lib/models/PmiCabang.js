import mongoose from "mongoose";

const PmiCabangSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    kota: { type: String, required: true },
    alamat: { type: String, default: "" },
    telepon: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.PmiCabang ||
  mongoose.model("PmiCabang", PmiCabangSchema);
