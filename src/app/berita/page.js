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

export default async function BeritaListPage() {
  await connectDB();
  const beritaList = await Berita.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .lean();
  const session = await getSession();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Berita Donor Darah</h1>
        <Link
          href={session ? roleHome(session.role) : "/"}
          className="text-sm underline text-muted-foreground"
        >
          {session ? "Kembali ke Dashboard" : "Kembali"}
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {beritaList.map((b) => (
          <Link key={b._id} href={`/berita/${b.slug}`}>
            <Card className="h-full transition-colors hover:border-primary">
              {b.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.coverImage}
                  alt={b.judul}
                  className="h-40 w-full rounded-t-xl object-cover"
                />
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{b.judul}</CardTitle>
                <CardDescription>
                  {new Date(b.publishedAt).toLocaleDateString("id-ID")}
                </CardDescription>
              </CardHeader>
              <CardContent className="line-clamp-3 text-sm text-muted-foreground">
                {b.konten}
              </CardContent>
            </Card>
          </Link>
        ))}
        {beritaList.length === 0 && (
          <p className="text-muted-foreground">Belum ada berita.</p>
        )}
      </div>
    </div>
  );
}
