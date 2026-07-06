import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { getStokByCabang } from "@/actions/stok.actions";
import { StatCard } from "@/components/shared/stat-card";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { DropletIcon } from "lucide-react";
import { KOMPONEN_DARAH, KOMPONEN_DARAH_SHORT_LABELS } from "@/lib/blood-components";

export default async function RumahSakitStokPage({ searchParams }) {
  const { cabangId, komponen } = await searchParams;
  const user = await requireCurrentUser();
  await connectDB();

  const cabangList = await PmiCabang.find({ isActive: true }).sort({ nama: 1 }).lean();
  const activeCabangId =
    cabangId || user.rumahSakit?.defaultCabangId?.toString() || cabangList[0]?._id.toString();
  const activeKomponen = KOMPONEN_DARAH.includes(komponen) ? komponen : KOMPONEN_DARAH[0];

  const stok = activeCabangId ? await getStokByCabang(activeCabangId, activeKomponen) : [];

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Stok Darah</h1>
      <FilterTabs
        options={cabangList.map((c) => ({ value: c._id.toString(), label: c.nama }))}
        activeValue={activeCabangId}
        baseHref="/dashboard/rumah-sakit/stok"
        paramName="cabangId"
        extraParams={{ komponen: activeKomponen }}
      />
      <FilterTabs
        options={KOMPONEN_DARAH.map((k) => ({ value: k, label: KOMPONEN_DARAH_SHORT_LABELS[k] }))}
        activeValue={activeKomponen}
        baseHref="/dashboard/rumah-sakit/stok"
        paramName="komponen"
        extraParams={{ cabangId: activeCabangId }}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stok.map((s) => (
          <StatCard
            key={s.golonganDarah}
            icon={DropletIcon}
            color="rose"
            label={s.golonganDarah}
            value={s.jumlahKantong}
          />
        ))}
      </div>
    </div>
  );
}
