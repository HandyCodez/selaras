import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Berita } from "@/lib/models";
import { getSession } from "@/lib/auth";
import { roleHome } from "@/lib/roles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { NewspaperIcon, CalendarDaysIcon, ArrowLeftIcon } from "lucide-react";

export default async function BeritaListPage() {
  await connectDB();
  const beritaList = await Berita.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .lean();
  const session = await getSession();
  const [featured, ...rest] = beritaList;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-linear-to-br from-rose-600 to-rose-500 px-4 py-12 text-white">
        <div className="mx-auto max-w-5xl space-y-4">
          <Link
            href={session ? roleHome(session.role) : "/"}
            className="inline-flex items-center gap-1 text-sm text-rose-100 hover:text-white"
          >
            <ArrowLeftIcon className="size-3.5" />
            {session ? "Kembali ke Dashboard" : "Kembali ke Beranda"}
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <NewspaperIcon className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Berita Donor Darah</h1>
              <p className="text-rose-100">
                Kabar terbaru seputar kegiatan dan informasi donor darah PMI.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        {beritaList.length === 0 ? (
          <EmptyState
            icon={NewspaperIcon}
            title="Belum ada berita"
            description="Berita seputar donor darah akan tampil di sini. Cek lagi nanti ya."
          />
        ) : (
          <>
            {featured && (
              <Link href={`/berita/${featured.slug}`} className="group block">
                <Card className="overflow-hidden py-0 transition-shadow hover:shadow-lg">
                  <div className="grid sm:grid-cols-2">
                    <div className="overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featured.coverImage || "/placeholder-berita.svg"}
                        alt={featured.judul}
                        className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-full"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-3 p-6">
                      <span className="w-fit rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                        Terbaru
                      </span>
                      <h2 className="text-xl font-semibold transition-colors group-hover:text-rose-600">
                        {featured.judul}
                      </h2>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {featured.konten}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDaysIcon className="size-3.5" />
                        {new Date(featured.publishedAt).toLocaleDateString("id-ID", {
                          dateStyle: "long",
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((b) => (
                  <Link key={b._id} href={`/berita/${b.slug}`} className="group">
                    <Card className="h-full overflow-hidden py-0 pb-6 transition-shadow hover:shadow-lg">
                      <div className="overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.coverImage || "/placeholder-berita.svg"}
                          alt={b.judul}
                          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 transition-colors group-hover:text-rose-600">
                          {b.judul}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5">
                          <CalendarDaysIcon className="size-3.5" />
                          {new Date(b.publishedAt).toLocaleDateString("id-ID")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="line-clamp-3 text-sm text-muted-foreground">
                        {b.konten}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
