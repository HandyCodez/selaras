"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

const createSchema = z.object({
  nama: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  telepon: z.string().optional(),
  cabangId: z.string().min(1),
  jabatan: z.enum(["staff", "dokter"]),
});

export async function createPetugasAccount(prevState, formData) {
  await requireRole("admin");
  const parsed = createSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data petugas tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    return { error: "Email sudah terdaftar." };
  }

  const passwordHash = await hashPassword(data.password);
  await User.create({
    role: "petugas",
    nama: data.nama,
    email: data.email,
    passwordHash,
    telepon: data.telepon || "",
    petugas: { cabangId: data.cabangId, jabatan: data.jabatan },
  });

  revalidatePath("/dashboard/admin/petugas");
  redirect("/dashboard/admin/petugas");
}

const updateSchema = z.object({
  nama: z.string().min(1),
  telepon: z.string().optional(),
  cabangId: z.string().min(1),
  jabatan: z.enum(["staff", "dokter"]),
  password: z.string().optional(),
});

export async function updatePetugasAccount(userId, prevState, formData) {
  await requireRole("admin");
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Data petugas tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const petugas = await User.findOne({ _id: userId, role: "petugas" });
  if (!petugas) {
    return { error: "Akun petugas tidak ditemukan." };
  }

  petugas.nama = data.nama;
  petugas.telepon = data.telepon || "";
  petugas.petugas = { cabangId: data.cabangId, jabatan: data.jabatan };
  if (data.password) {
    if (data.password.length < 6) {
      return { error: "Kata sandi baru minimal 6 karakter." };
    }
    petugas.passwordHash = await hashPassword(data.password);
  }
  await petugas.save();

  revalidatePath("/dashboard/admin/petugas");
  redirect("/dashboard/admin/petugas");
}

export async function togglePetugasActive(userId) {
  await requireRole("admin");
  await connectDB();
  const petugas = await User.findOne({ _id: userId, role: "petugas" });
  if (!petugas) return;
  petugas.isActive = !petugas.isActive;
  await petugas.save();
  revalidatePath("/dashboard/admin/petugas");
}
