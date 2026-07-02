import mongoose from "mongoose";
import { hashPassword } from "../src/lib/password.js";
import {
  User,
  PmiCabang,
  Kegiatan,
  Berita,
} from "../src/lib/models/index.js";
import { GOLONGAN_DARAH } from "../src/lib/blood-types.js";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed.mjs",
  );
}

const CABANG_DATA = [
  { nama: "PMI Cabang Jakarta Pusat", kota: "Jakarta Pusat" },
  { nama: "PMI Cabang Bandung", kota: "Bandung" },
];

async function upsertPetugas({ nama, email, cabangId, jabatan }) {
  const passwordHash = await hashPassword("password123");
  return User.findOneAndUpdate(
    { email },
    {
      role: "petugas",
      nama,
      email,
      passwordHash,
      telepon: "080000000000",
      petugas: { cabangId, jabatan },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
}

async function upsertAdmin() {
  const passwordHash = await hashPassword("password123");
  return User.findOneAndUpdate(
    { email: "admin@selaras.test" },
    {
      role: "admin",
      nama: "Admin Selaras",
      email: "admin@selaras.test",
      passwordHash,
      telepon: "080000000000",
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
}

async function main() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("Connected to MongoDB");

  const admin = await upsertAdmin();
  console.log(`Admin ready: ${admin.email}`);

  const cabangDocs = [];
  for (const c of CABANG_DATA) {
    const doc = await PmiCabang.findOneAndUpdate(
      { nama: c.nama },
      { $setOnInsert: c },
      { upsert: true, returnDocument: "after" },
    );
    cabangDocs.push(doc);
    console.log(`Cabang ready: ${doc.nama}`);
  }

  for (const cabang of cabangDocs) {
    const slug = cabang.kota.toLowerCase().replace(/\s+/g, "-");
    const staff = await upsertPetugas({
      nama: `Staff PMI ${cabang.kota}`,
      email: `staff.${slug}@pmi.test`,
      cabangId: cabang._id,
      jabatan: "staff",
    });
    const dokter = await upsertPetugas({
      nama: `Dokter PMI ${cabang.kota}`,
      email: `dokter.${slug}@pmi.test`,
      cabangId: cabang._id,
      jabatan: "dokter",
    });
    console.log(`Petugas ready for ${cabang.kota}: ${staff.email}, ${dokter.email}`);

    await Kegiatan.findOneAndUpdate(
      { cabangId: cabang._id, judul: `Donor Darah Rutin ${cabang.kota}` },
      {
        $setOnInsert: {
          cabangId: cabang._id,
          judul: `Donor Darah Rutin ${cabang.kota}`,
          deskripsi: "Kegiatan donor darah rutin bulanan.",
          lokasi: `Kantor PMI ${cabang.kota}`,
          tanggalMulai: new Date(),
          tanggalSelesai: new Date(Date.now() + 8 * 60 * 60 * 1000),
          status: "aktif",
          createdBy: staff._id,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
  }

  const beritaCount = await Berita.countDocuments();
  if (beritaCount === 0) {
    await Berita.create({
      judul: "Ayo Donor Darah, Selamatkan Nyawa",
      slug: "ayo-donor-darah-selamatkan-nyawa",
      konten:
        "Setiap tetes darah yang Anda donorkan dapat menyelamatkan hingga tiga nyawa. Yuk, jadwalkan donor darah Anda di kegiatan PMI terdekat.",
      status: "published",
      publishedAt: new Date(),
    });
    console.log("Sample berita created");
  }

  console.log("\nSeed complete. Test accounts (password: password123):");
  console.log(`  ${admin.email} (admin)`);
  for (const cabang of cabangDocs) {
    const slug = cabang.kota.toLowerCase().replace(/\s+/g, "-");
    console.log(`  staff.${slug}@pmi.test / dokter.${slug}@pmi.test`);
  }
  console.log(`\nBlood types available: ${GOLONGAN_DARAH.join(", ")}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
