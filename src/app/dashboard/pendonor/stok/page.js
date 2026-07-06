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
import { Badge } from "@/components/ui/badge";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { DropletIcon } from "lucide-react";
import { KOMPONEN_DARAH, KOMPONEN_DARAH_SHORT_LABELS } from "@/lib/blood-components";

export default async function PendonorStokPage({ searchParams }) {
  const { cabangId, komponen } = await searchParams;
  await requireRole("pendonor");
  await connectDB();

  const cabangList = await PmiCabang.find({ isActive: true }).sort({ nama: 1 }).lean();
  const activeCabangId = cabangId || cabangList[0]?._id.toString();
  const activeKomponen = KOMPONEN_DARAH.includes(komponen) ? komponen : KOMPONEN_DARAH[0];

  const stok = activeCabangId ? await getStokByCabang(activeCabangId, activeKomponen) : [];

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stok Darah</h1>
        <p className="text-muted-foreground">
          Cek ketersediaan stok darah di cabang PMI terdekat.
        </p>
      </div>
      <FilterTabs
        options={cabangList.map((c) => ({ value: c._id.toString(), label: c.nama }))}
        activeValue={activeCabangId}
        baseHref="/dashboard/pendonor/stok"
        paramName="cabangId"
        extraParams={{ komponen: activeKomponen }}
      />
      <FilterTabs
        options={KOMPONEN_DARAH.map((k) => ({ value: k, label: KOMPONEN_DARAH_SHORT_LABELS[k] }))}
        activeValue={activeKomponen}
        baseHref="/dashboard/pendonor/stok"
        paramName="komponen"
        extraParams={{ cabangId: activeCabangId }}
      />
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
              <TableCell className="font-medium">
                <Badge variant="outline" className="gap-1">
                  <DropletIcon className="size-3 text-rose-600" />
                  {s.golonganDarah}
                </Badge>
              </TableCell>
              <TableCell>{s.jumlahKantong}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
