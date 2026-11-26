"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User, RumahSakit, PmiCabang } from "@/lib/models";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSessionCookie, destroySessionCookie } from "@/lib/session";
import { roleHome } from "@/lib/roles";

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export async function login(prevState, formData) {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Email/No. HP atau kata sandi tidak valid." };
  }

  await connectDB();
  const identifier = parsed.data.identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: identifier }, { telepon: parsed.data.identifier.trim() }],
  }).select("+passwordHash");
  if (!user || !user.isActive) {
    return { error: "Email/No. HP atau kata sandi salah." };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "Email/No. HP atau kata sandi salah." };
  }

  await createSessionCookie(user);
  redirect(roleHome(user.role));
}

export async function logout() {
  await destroySessionCookie();
  redirect("/login");
}

const registerPendonorSchema = z.object({
  telepon: z.string().min(8, "Nomor HP tidak valid."),
  password: z.string().min(6),
});

export async function registerPendonor(prevState, formData) {
  const parsed = registerPendonorSchema.safeParse({
    telepon: formData.get("telepon"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Data pendaftaran tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const existing = await User.findOne({ telepon: data.telepon });
  if (existing) {
    return { error: "Nomor HP sudah terdaftar." };
  }

  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    role: "pendonor",
    telepon: data.telepon,
    passwordHash,
    pendonor: {},
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
  const existingUser = await User.findOne({
    $or: [{ email: data.email }, { telepon: data.telepon }],
  });
  if (existingUser) {
    return {
      error:
        existingUser.email === data.email
          ? "Email sudah terdaftar."
          : "Nomor HP sudah terdaftar.",
    };
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
