import mongoose from "mongoose";
import { GOLONGAN_DARAH } from "../blood-types.js";

const StokDarahSchema = new mongoose.Schema(
  {
    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PmiCabang",
      required: true,
      index: true,
    },
    golonganDarah: { type: String, enum: GOLONGAN_DARAH, required: true },
    jumlahKantong: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

StokDarahSchema.index({ cabangId: 1, golonganDarah: 1 }, { unique: true });

export default mongoose.models.StokDarah ||
  mongoose.model("StokDarah", StokDarahSchema);
