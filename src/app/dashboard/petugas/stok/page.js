import { requireRole } from "@/lib/auth";
import { getStokByCabang } from "@/actions/stok.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StokKoreksiForm } from "@/components/petugas/stok-koreksi-form";

export default async function PetugasStokPage() {
  const session = await requireRole("petugas");
  const stok = await getStokByCabang(session.cabangId);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Stok Darah</h1>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Koreksi Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <StokKoreksiForm />
        </CardContent>
      </Card>
    </div>
  );
}
