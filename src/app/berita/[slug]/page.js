import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Berita } from "@/lib/models";

export default async function BeritaDetailPage({ params }) {
  const { slug } = await params;
  await connectDB();
  const berita = await Berita.findOne({ slug, status: "published" }).lean();
  if (!berita) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <Link href="/berita" className="text-sm underline text-muted-foreground">
        Kembali ke Berita
      </Link>
      {berita.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={berita.coverImage}
          alt={berita.judul}
          className="w-full rounded-xl object-cover"
        />
      )}
      <h1 className="text-3xl font-bold">{berita.judul}</h1>
      <p className="text-sm text-muted-foreground">
        {new Date(berita.publishedAt).toLocaleDateString("id-ID")}
      </p>
      <div className="whitespace-pre-wrap text-base leading-relaxed">
        {berita.konten}
      </div>
    </div>
  );
}
