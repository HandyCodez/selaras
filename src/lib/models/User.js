import mongoose from "mongoose";
import { GOLONGAN_DARAH } from "../blood-types.js";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["pendonor", "petugas", "rumah_sakit", "admin"],
      required: true,
      index: true,
    },
    nama: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    telepon: { type: String, default: "" },
    isActive: { type: Boolean, default: true },

    pendonor: {
      tanggalLahir: { type: Date },
      jenisKelamin: { type: String, enum: ["L", "P"] },
      golonganDarah: { type: String, enum: [...GOLONGAN_DARAH, null], default: null },
      alamat: { type: String, default: "" },
    },

    petugas: {
      cabangId: { type: mongoose.Schema.Types.ObjectId, ref: "PmiCabang" },
      jabatan: { type: String, enum: ["staff", "dokter"] },
    },

    rumahSakit: {
      rumahSakitId: { type: mongoose.Schema.Types.ObjectId, ref: "RumahSakit" },
      defaultCabangId: { type: mongoose.Schema.Types.ObjectId, ref: "PmiCabang" },
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
