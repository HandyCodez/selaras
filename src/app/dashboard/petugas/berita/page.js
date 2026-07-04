import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Berita } from "@/lib/models";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PlusIcon, Trash2Icon, NewspaperIcon } from "lucide-react";
import { deleteBerita } from "@/actions/berita.actions";

export default async function PetugasBeritaPage() {
  await requireRole("petugas");
  await connectDB();
  const beritaList = await Berita.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kelola Berita</h1>
        <Button render={<Link href="/dashboard/petugas/berita/baru" />}>
          <PlusIcon className="size-4" />
          Buat Berita
        </Button>
      </div>
      {beritaList.length === 0 ? (
        <EmptyState
          icon={NewspaperIcon}
          title="Belum ada berita"
          description="Berita yang kamu buat akan muncul di sini dan tampil di halaman publik."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sampul</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {beritaList.map((b) => (
              <TableRow key={b._id}>
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.coverImage || "/placeholder-berita.svg"}
                    alt={b.judul}
                    className="size-10 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{b.judul}</TableCell>
                <TableCell>
                  <StatusBadge status={b.status} />
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    render={<Link href={`/dashboard/petugas/berita/${b._id}/edit`} />}
                    variant="ghost"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <form action={deleteBerita.bind(null, b._id.toString())}>
                    <Button variant="ghost" size="sm" type="submit">
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
