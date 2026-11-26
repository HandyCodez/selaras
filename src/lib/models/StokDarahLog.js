import mongoose from "mongoose";
import { GOLONGAN_DARAH } from "../blood-types.js";
import { KOMPONEN_DARAH } from "../blood-components.js";

const StokDarahLogSchema = new mongoose.Schema(
  {
    cabangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PmiCabang",
      required: true,
      index: true,
    },
    golonganDarah: { type: String, enum: GOLONGAN_DARAH, required: true },
    komponenDarah: { type: String, enum: KOMPONEN_DARAH, required: true },
    delta: { type: Number, required: true },
    alasan: {
      type: String,
      enum: ["donasi_selesai", "permintaan_dipenuhi", "koreksi_manual"],
      required: true,
    },
    refId: { type: mongoose.Schema.Types.ObjectId },
    // Set for logs triggered by a specific blood bag (donasi_selesai).
    kantongId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KantongDarah",
      default: null,
    },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.models.StokDarahLog ||
  mongoose.model("StokDarahLog", StokDarahLogSchema);
