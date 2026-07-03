import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { getStokByCabang } from "@/actions/stok.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default async function PendonorStokPage({ searchParams }) {
  const { cabangId } = await searchParams;
  await requireRole("pendonor");
  await connectDB();

  const cabangList = await PmiCabang.find({ isActive: true }).sort({ nama: 1 }).lean();
  const activeCabangId = cabangId || cabangList[0]?._id.toString();

  const stok = activeCabangId ? await getStokByCabang(activeCabangId) : [];

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Stok Darah</h1>
      <div className="flex flex-wrap gap-2">
        {cabangList.map((c) => (
          <Link
            key={c._id}
            href={`/dashboard/pendonor/stok?cabangId=${c._id}`}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              activeCabangId === c._id.toString()
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {c.nama}
          </Link>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Golongan Darah</TableHead>
            <TableHead>Jumlah Kantong</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stok.map((s) => (
            <TableRow key={s.golonganDarah}>
              <TableCell className="font-medium">{s.golonganDarah}</TableCell>
              <TableCell>{s.jumlahKantong}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
