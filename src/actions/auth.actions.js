"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User, RumahSakit, PmiCabang } from "@/lib/models";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSessionCookie, destroySessionCookie } from "@/lib/session";
import { GOLONGAN_DARAH } from "@/lib/blood-types";

function roleHome(role) {
  if (role === "petugas") return "/dashboard/petugas";
  if (role === "rumah_sakit") return "/dashboard/rumah-sakit";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/pendonor";
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(prevState, formData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Email atau kata sandi tidak valid." };
  }

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email }).select(
    "+passwordHash",
  );
  if (!user || !user.isActive) {
    return { error: "Email atau kata sandi salah." };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "Email atau kata sandi salah." };
  }

  await createSessionCookie(user);
  redirect(roleHome(user.role));
}

export async function logout() {
  await destroySessionCookie();
  redirect("/login");
}

const registerPendonorSchema = z.object({
  nama: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  telepon: z.string().min(1),
  tanggalLahir: z.string().min(1),
  jenisKelamin: z.enum(["L", "P"]),
  golonganDarah: z.enum([...GOLONGAN_DARAH, ""]).optional(),
  alamat: z.string().optional(),
});

export async function registerPendonor(prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = registerPendonorSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Data pendaftaran tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    return { error: "Email sudah terdaftar." };
  }

  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    role: "pendonor",
    nama: data.nama,
    email: data.email,
    passwordHash,
    telepon: data.telepon,
    pendonor: {
      tanggalLahir: data.tanggalLahir,
      jenisKelamin: data.jenisKelamin,
      golonganDarah: data.golonganDarah || null,
      alamat: data.alamat || "",
    },
  });

  await createSessionCookie(user);
  redirect(roleHome("pendonor"));
}

const registerRumahSakitSchema = z.object({
  nama: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  telepon: z.string().min(1),
  namaRumahSakit: z.string().min(1),
  kotaRumahSakit: z.string().min(1),
  alamatRumahSakit: z.string().optional(),
  defaultCabangId: z.string().min(1),
});

export async function registerRumahSakit(prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = registerRumahSakitSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Data pendaftaran tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    return { error: "Email sudah terdaftar." };
  }

  const cabang = await PmiCabang.findById(data.defaultCabangId);
  if (!cabang) {
    return { error: "Cabang PMI tidak ditemukan." };
  }

  let rumahSakit = await RumahSakit.findOne({
    nama: new RegExp(`^${data.namaRumahSakit.trim()}$`, "i"),
  });
  if (!rumahSakit) {
    rumahSakit = await RumahSakit.create({
      nama: data.namaRumahSakit,
      kota: data.kotaRumahSakit,
      alamat: data.alamatRumahSakit || "",
    });
  }

  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    role: "rumah_sakit",
    nama: data.nama,
    email: data.email,
    passwordHash,
    telepon: data.telepon,
    rumahSakit: {
      rumahSakitId: rumahSakit._id,
      defaultCabangId: cabang._id,
    },
  });

  await createSessionCookie(user);
  redirect(roleHome("rumah_sakit"));
}
