import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PermintaanDarah } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Building2Icon,
  ClipboardListIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  PlusIcon,
  MapPinIcon,
} from "lucide-react";

export default async function RumahSakitHomePage() {
  const user = await requireCurrentUser();
  await connectDB();

  const rumahSakitId = user.rumahSakit?.rumahSakitId;
  const [statsResult] = await PermintaanDarah.aggregate([
    { $match: { rumahSakitId } },
    {
      $facet: {
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        terbaru: [
          { $sort: { createdAt: -1 } },
          { $limit: 3 },
          {
            $lookup: {
              from: "pmicabangs",
              localField: "cabangId",
              foreignField: "_id",
              as: "cabangId",
            },
          },
          { $unwind: { path: "$cabangId", preserveNullAndEmptyArrays: true } },
        ],
      },
    },
  ]);
  const countByStatus = Object.fromEntries(
    statsResult.byStatus.map((s) => [s._id, s.count]),
  );
  const permintaanTerbaru = statsResult.terbaru;
  const totalPermintaan = statsResult.byStatus.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      <PageHeaderIcon
        icon={Building2Icon}
        title={`Halo, ${user.nama}`}
        description="Dashboard Rumah Sakit"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardListIcon}
          color={(countByStatus.menunggu || 0) > 0 ? "amber" : "emerald"}
          label="Permintaan Menunggu"
          value={countByStatus.menunggu || 0}
        />
        <StatCard
          icon={CheckCircle2Icon}
          color="emerald"
          label="Permintaan Selesai"
          value={countByStatus.selesai || 0}
        />
        <StatCard
          icon={Building2Icon}
          color="sky"
          label="Total Permintaan"
          value={totalPermintaan}
        />
      </div>

      <Card className="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40">
        <CardHeader>
          <CardTitle>Butuh Darah?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-md text-sm text-muted-foreground">
            Ajukan permintaan darah ke cabang PMI terdekat, kapan saja
            dibutuhkan.
          </p>
          <Button render={<Link href="/dashboard/rumah-sakit/permintaan/baru" />}>
            <PlusIcon className="size-4" />
            Ajukan Permintaan Darah
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardListIcon className="size-4 text-rose-600" />
            Permintaan Terbaru
          </CardTitle>
          <Link
            href="/dashboard/rumah-sakit/permintaan"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Lihat semua
            <ArrowRightIcon className="size-3" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {permintaanTerbaru.length === 0 ? (
            <EmptyState
              icon={ClipboardListIcon}
              title="Belum ada permintaan darah"
              description="Permintaan yang kamu ajukan akan muncul di sini."
              className="border-none py-4"
            />
          ) : (
            permintaanTerbaru.map((p) => (
              <Link
                key={p._id}
                href={`/dashboard/rumah-sakit/permintaan/${p._id}`}
                className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:border-primary"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="flex items-center gap-1.5 truncate font-medium">
                    <MapPinIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    {p.cabangId?.nama}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.items.length} item
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {p.urgensi === "mendesak" && (
                    <Badge variant="destructive">Mendesak</Badge>
                  )}
                  <StatusBadge status={p.status} />
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
