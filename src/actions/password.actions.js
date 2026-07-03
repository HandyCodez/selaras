"use server";

import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { requireAuth } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi."),
    newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter."),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi baru tidak cocok.",
    path: ["confirmPassword"],
  });

export async function changePassword(prevState, formData) {
  const session = await requireAuth();
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Data tidak valid." };
  }
  const { currentPassword, newPassword } = parsed.data;

  await connectDB();
  const user = await User.findById(session.userId).select("+passwordHash");
  if (!user) {
    return { error: "Akun tidak ditemukan." };
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "Kata sandi saat ini salah." };
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  return { success: "Kata sandi berhasil diubah." };
}
