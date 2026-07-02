import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
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
import { togglePetugasActive } from "@/actions/petugas-account.actions";

export default async function AdminPetugasPage() {
  await requireRole("admin");
  await connectDB();
  const petugasList = await User.find({ role: "petugas" })
    .populate("petugas.cabangId", "nama kota")
    .sort({ nama: 1 })
    .lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Petugas PMI</h1>
        <Button render={<Link href="/dashboard/admin/petugas/baru" />}>
          <PlusIcon className="size-4" />
          Tambah Petugas
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cabang</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {petugasList.map((p) => (
            <TableRow key={p._id}>
              <TableCell className="font-medium">{p.nama}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>{p.petugas?.cabangId?.nama || "-"}</TableCell>
              <TableCell className="capitalize">{p.petugas?.jabatan}</TableCell>
              <TableCell>
                <Badge variant={p.isActive ? "default" : "secondary"}>
                  {p.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  render={<Link href={`/dashboard/admin/petugas/${p._id}/edit`} />}
                  variant="ghost"
                  size="sm"
                >
                  Edit
                </Button>
                <form action={togglePetugasActive.bind(null, p._id.toString())}>
                  <Button variant="ghost" size="sm" type="submit">
                    {p.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {petugasList.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada akun petugas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
