import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getStokByCabang } from "@/actions/stok.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { StokKoreksiForm } from "@/components/petugas/stok-koreksi-form";
import { Button } from "@/components/ui/button";
import { HistoryIcon, DropletIcon, PencilLineIcon } from "lucide-react";

const STOK_MENIPIS_AMBANG = 10;

export default async function PetugasStokPage() {
  const session = await requireRole("petugas");
  const stok = await getStokByCabang(session.cabangId);

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stok Darah</h1>
        <Button render={<Link href="/dashboard/petugas/stok/riwayat" />} variant="outline">
          <HistoryIcon className="size-4" />
          Riwayat
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stok.map((s) => (
          <StatCard
            key={s.golonganDarah}
            icon={DropletIcon}
            color={s.jumlahKantong < STOK_MENIPIS_AMBANG ? "amber" : "rose"}
            label={s.golonganDarah}
            value={s.jumlahKantong}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PencilLineIcon className="size-4 text-rose-600" />
            Koreksi Manual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StokKoreksiForm />
        </CardContent>
      </Card>
    </div>
  );
}
