import mongoose from "mongoose";
import { GOLONGAN_DARAH } from "../blood-types.js";

const StokDarahLogSchema = new mongoose.Schema(
  {
    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PmiCabang",
      required: true,
      index: true,
    },
    golonganDarah: { type: String, enum: GOLONGAN_DARAH, required: true },
    delta: { type: Number, required: true },
    alasan: {
      type: String,
      enum: ["donasi_selesai", "permintaan_dipenuhi", "koreksi_manual"],
      required: true,
    },
    refId: { type: mongoose.Schema.Types.ObjectId },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.models.StokDarahLog ||
  mongoose.model("StokDarahLog", StokDarahLogSchema);
