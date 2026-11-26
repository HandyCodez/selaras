import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getStokByCabang } from "@/actions/stok.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { StokKoreksiForm } from "@/components/petugas/stok-koreksi-form";
import { Button } from "@/components/ui/button";
import { HistoryIcon, DropletIcon, PencilLineIcon, PackageIcon } from "lucide-react";
import { KOMPONEN_DARAH, KOMPONEN_DARAH_SHORT_LABELS } from "@/lib/blood-components";

const STOK_MENIPIS_AMBANG = 10;

export default async function PetugasStokPage({ searchParams }) {
  const { komponen } = await searchParams;
  const session = await requireRole("petugas");
  const activeKomponen = KOMPONEN_DARAH.includes(komponen) ? komponen : KOMPONEN_DARAH[0];
  const stok = await getStokByCabang(session.cabangId, activeKomponen);

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stok Darah</h1>
        <div className="flex items-center gap-2">
          <Button render={<Link href="/dashboard/petugas/stok/kantong" />} variant="outline">
            <PackageIcon className="size-4" />
            Kantong
          </Button>
          <Button render={<Link href="/dashboard/petugas/stok/riwayat" />} variant="outline">
            <HistoryIcon className="size-4" />
            Riwayat
          </Button>
        </div>
      </div>

      <FilterTabs
        options={KOMPONEN_DARAH.map((k) => ({ value: k, label: KOMPONEN_DARAH_SHORT_LABELS[k] }))}
        activeValue={activeKomponen}
        baseHref="/dashboard/petugas/stok"
        paramName="komponen"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stok.map((s) => (
          <Link
            key={s.golonganDarah}
            href={`/dashboard/petugas/stok/kantong?golongan=${s.golonganDarah}&komponen=${activeKomponen}`}
            className="group block rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/40">
              <DropletIcon
                className={`size-4 ${s.jumlahKantong < STOK_MENIPIS_AMBANG ? "text-amber-500" : "text-rose-500"}`}
              />
            </div>
            <p className="text-2xl font-bold">{s.jumlahKantong}</p>
            <p className="text-sm font-semibold text-muted-foreground">{s.golonganDarah}</p>
            <p className="mt-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              Lihat kantong →
            </p>
          </Link>
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
