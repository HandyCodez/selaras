import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Berita } from "@/lib/models";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon, CalendarDaysIcon, ClockIcon } from "lucide-react";

function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BeritaDetailPage({ params }) {
  const { slug } = await params;
  await connectDB();
  const berita = await Berita.findOne({ slug, status: "published" }).lean();
  if (!berita) notFound();

  const related = await Berita.find({
    status: "published",
    _id: { $ne: berita._id },
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <Link
          href="/berita"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Kembali ke Berita
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={berita.coverImage || "/placeholder-berita.svg"}
          alt={berita.judul}
          className="h-64 w-full rounded-xl object-cover sm:h-80"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{berita.judul}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDaysIcon className="size-3.5" />
              {new Date(berita.publishedAt).toLocaleDateString("id-ID", {
                dateStyle: "long",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="size-3.5" />
              {estimateReadTime(berita.konten)} menit membaca
            </span>
          </div>
        </div>
        <div className="whitespace-pre-wrap text-base leading-relaxed">
          {berita.konten}
        </div>

        {related.length > 0 && (
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-lg font-semibold">Berita Lainnya</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((b) => (
                <Link key={b._id} href={`/berita/${b.slug}`} className="group">
                  <Card className="h-full overflow-hidden py-0 pb-3 transition-shadow hover:shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.coverImage || "/placeholder-berita.svg"}
                      alt={b.judul}
                      className="h-28 w-full object-cover"
                    />
                    <CardContent className="px-3 pt-3">
                      <p className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-rose-600">
                        {b.judul}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
