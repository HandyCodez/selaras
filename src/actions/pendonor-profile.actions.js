"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { requireRole } from "@/lib/auth";

const completeProfileSchema = z.object({
  nama: z.string().min(1),
  nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka."),
  email: z.string().email().optional().or(z.literal("")),
  tanggalLahir: z.string().min(1),
  jenisKelamin: z.enum(["L", "P"]),
  alamat: z.string().min(1),
});

export async function completeProfile(prevState, formData) {
  const session = await requireRole("pendonor");
  const parsed = completeProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Data tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();

  const nikConflict = await User.findOne({
    "pendonor.nik": data.nik,
    _id: { $ne: session.userId },
  });
  if (nikConflict) {
    return { error: "NIK sudah terdaftar di akun lain." };
  }

  if (data.email) {
    const existing = await User.findOne({
      email: data.email.toLowerCase(),
      _id: { $ne: session.userId },
    });
    if (existing) {
      return { error: "Email sudah dipakai akun lain." };
    }
  }

  await User.updateOne(
    { _id: session.userId },
    {
      $set: {
        nama: data.nama,
        "pendonor.nik": data.nik,
        ...(data.email ? { email: data.email.toLowerCase() } : {}),
        "pendonor.tanggalLahir": data.tanggalLahir,
        "pendonor.jenisKelamin": data.jenisKelamin,
        "pendonor.alamat": data.alamat,
      },
    },
  );

  revalidatePath("/dashboard/pendonor");
  redirect("/dashboard/pendonor/akun");
}
