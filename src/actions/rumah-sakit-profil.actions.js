"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { User, RumahSakit } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { logout } from "@/actions/auth.actions";

const updateProfileSchema = z.object({
  nama: z.string().min(1),
  telepon: z.string().min(8, "Nomor HP tidak valid."),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  kotaRumahSakit: z.string().min(1),
  alamatRumahSakit: z.string().optional(),
  teleponRumahSakit: z.string().optional(),
});

// The RumahSakit record can be shared by multiple staff/PIC accounts from
// the same hospital (see registerRumahSakit) — editing its contact info
// here intentionally updates it for everyone at that hospital, but "nama"
// stays fixed since new registrations dedupe against it by exact name.
export async function updateRumahSakitProfile(prevState, formData) {
  const session = await requireRole("rumah_sakit");
  const parsed = updateProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Data tidak lengkap atau tidak valid." };
  }
  const data = parsed.data;

  await connectDB();
  const user = await User.findById(session.userId);
  if (!user?.rumahSakit?.rumahSakitId) {
    await logout();
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

  await RumahSakit.updateOne(
    { _id: user.rumahSakit.rumahSakitId },
    {
      $set: {
        kota: data.kotaRumahSakit,
        alamat: data.alamatRumahSakit || "",
        telepon: data.teleponRumahSakit || "",
      },
    },
  );

  revalidatePath("/dashboard/rumah-sakit/akun");
  redirect("/dashboard/rumah-sakit/akun");
}
