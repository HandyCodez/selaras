import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { getStokByCabang } from "@/actions/stok.actions";
import { StatCard } from "@/components/shared/stat-card";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { DropletIcon } from "lucide-react";

export default async function RumahSakitStokPage({ searchParams }) {
  const { cabangId } = await searchParams;
  const user = await requireCurrentUser();
  await connectDB();

  const cabangList = await PmiCabang.find({ isActive: true }).sort({ nama: 1 }).lean();
  const activeCabangId =
    cabangId || user.rumahSakit?.defaultCabangId?.toString() || cabangList[0]?._id.toString();

  const stok = activeCabangId ? await getStokByCabang(activeCabangId) : [];

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Stok Darah</h1>
      <FilterTabs
        options={cabangList.map((c) => ({ value: c._id.toString(), label: c.nama }))}
        activeValue={activeCabangId}
        baseHref="/dashboard/rumah-sakit/stok"
        paramName="cabangId"
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
