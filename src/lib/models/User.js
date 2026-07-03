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
    // Optional for pendonor: registration only collects telepon + password;
    // nama is filled in later via the "lengkapi profil" flow.
    nama: { type: String, default: "" },
    // Optional for pendonor (they log in with telepon instead) — still
    // required for petugas/rumah_sakit/admin via each action's own zod
    // schema. Sparse index lets many docs omit it without colliding.
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    // The pendonor login identifier — required and unique for every role.
    telepon: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },

    pendonor: {
      nik: { type: String, unique: true, sparse: true },
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
