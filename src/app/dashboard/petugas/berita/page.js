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
import { PlusIcon, Trash2Icon } from "lucide-react";
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {beritaList.map((b) => (
            <TableRow key={b._id}>
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
          {beritaList.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                Belum ada berita.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
