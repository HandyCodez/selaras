"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

const updateProfileSchema = z.object({
  nama: z.string().min(1),
  telepon: z.string().min(8, "Nomor HP tidak valid."),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
});

// Self-service profile edit for petugas — deliberately does not touch
// cabangId/jabatan, since those are organizational assignments only admin
// controls (see petugas-account.actions.js).
export async function updatePetugasProfile(prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = updateProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const user = await User.findById(session.userId);
  if (!user) {
    return { error: "Akun tidak ditemukan." };
  }

  const conflict = await User.findOne({
    _id: { $ne: session.userId },
    $or: [
      { telepon: data.telepon },
      ...(data.email ? [{ email: data.email.toLowerCase() }] : []),
    ],
  });
  if (conflict) {
    return {
      error:
        conflict.telepon === data.telepon
          ? "Nomor HP sudah dipakai akun lain."
          : "Email sudah dipakai akun lain.",
    };
  }

  if (data.password) {
    if (data.password.length < 6) {
      return { error: "Kata sandi baru minimal 6 karakter." };
    }
    user.passwordHash = await hashPassword(data.password);
  }
  user.nama = data.nama;
  user.telepon = data.telepon;
  if (data.email) user.email = data.email.toLowerCase();
  await user.save();

  revalidatePath("/dashboard/petugas/akun");
  redirect("/dashboard/petugas/akun");
}
