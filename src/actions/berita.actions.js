"use server";

import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Berita } from "@/lib/models";
import { requireRole } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "berita");

async function saveCoverImage(file) {
  if (!file || typeof file === "string" || file.size === 0) return null;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/berita/${filename}`;
}

function slugify(text) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    crypto.randomBytes(3).toString("hex")
  );
}

const beritaSchema = z.object({
  judul: z.string().min(1),
  konten: z.string().min(1),
  status: z.enum(["draft", "published"]),
});

export async function createBerita(prevState, formData) {
  const session = await requireRole("petugas");
  const parsed = beritaSchema.safeParse({
    judul: formData.get("judul"),
    konten: formData.get("konten"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: "Data berita tidak valid." };
  }

  const coverImage = await saveCoverImage(formData.get("coverImage"));

  await connectDB();
  await Berita.create({
    judul: parsed.data.judul,
    slug: slugify(parsed.data.judul),
    konten: parsed.data.konten,
    coverImage: coverImage || "",
    authorId: session.userId,
    status: parsed.data.status,
    publishedAt: parsed.data.status === "published" ? new Date() : undefined,
  });

  revalidatePath("/dashboard/petugas/berita");
  redirect("/dashboard/petugas/berita");
}

export async function updateBerita(beritaId, prevState, formData) {
  await requireRole("petugas");
  const parsed = beritaSchema.safeParse({
    judul: formData.get("judul"),
    konten: formData.get("konten"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: "Data berita tidak valid." };
  }

  await connectDB();
  const berita = await Berita.findById(beritaId);
  if (!berita) {
    return { error: "Berita tidak ditemukan." };
  }

  const coverImage = await saveCoverImage(formData.get("coverImage"));

  berita.judul = parsed.data.judul;
  berita.konten = parsed.data.konten;
  if (coverImage) berita.coverImage = coverImage;
  if (parsed.data.status === "published" && berita.status !== "published") {
    berita.publishedAt = new Date();
  }
  berita.status = parsed.data.status;
  await berita.save();

  revalidatePath("/dashboard/petugas/berita");
  revalidatePath(`/berita/${berita.slug}`);
  redirect("/dashboard/petugas/berita");
}

export async function deleteBerita(beritaId) {
  await requireRole("petugas");
  await connectDB();
  await Berita.findByIdAndDelete(beritaId);
  revalidatePath("/dashboard/petugas/berita");
}
