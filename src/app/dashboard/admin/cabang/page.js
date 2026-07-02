import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "lucide-react";
import { toggleCabangActive } from "@/actions/cabang.actions";
import { DeleteCabangButton } from "@/components/admin/delete-cabang-button";

export default async function AdminCabangPage() {
  await requireRole("admin");
  await connectDB();
  const cabangList = await PmiCabang.find().sort({ nama: 1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cabang PMI</h1>
        <Button render={<Link href="/dashboard/admin/cabang/baru" />}>
          <PlusIcon className="size-4" />
          Tambah Cabang
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kota</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {cabangList.map((c) => (
            <TableRow key={c._id}>
              <TableCell className="font-medium">{c.nama}</TableCell>
              <TableCell>{c.kota}</TableCell>
              <TableCell>
                <Badge variant={c.isActive ? "default" : "secondary"}>
                  {c.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  render={<Link href={`/dashboard/admin/cabang/${c._id}/edit`} />}
                  variant="ghost"
                  size="sm"
                >
                  Edit
                </Button>
                <form action={toggleCabangActive.bind(null, c._id.toString())}>
                  <Button variant="ghost" size="sm" type="submit">
                    {c.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </form>
                <DeleteCabangButton cabangId={c._id.toString()} cabangNama={c.nama} />
              </TableCell>
            </TableRow>
          ))}
          {cabangList.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada cabang PMI.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
