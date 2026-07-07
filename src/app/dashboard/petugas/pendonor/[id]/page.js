import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User, Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailField } from "@/components/shared/detail-field";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { tanggalBolehDonorLagi } from "@/lib/pendonor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserRoundIcon,
  IdCardIcon,
  MailIcon,
  PhoneIcon,
  CakeIcon,
  UsersIcon,
  MapPinIcon,
  DropletIcon,
  AwardIcon,
  CalendarClockIcon,
  CalendarCheckIcon,
  HistoryIcon,
} from "lucide-react";

function jenisKelaminLabel(jk) {
  if (jk === "L") return "Laki-laki";
  if (jk === "P") return "Perempuan";
  return "-";
}

export default async function PetugasPendonorDetailPage({ params }) {
  const { id } = await params;
  await requireRole("petugas");
  await connectDB();

  const donor = await User.findOne({ _id: id, role: "pendonor" }).lean();
  if (!donor) notFound();

  const riwayat = await Partisipasi.find({ donorId: id })
    .populate({
      path: "kegiatanId",
      select: "judul cabangId",
      populate: { path: "cabangId", select: "nama" },
    })
    .sort({ createdAt: -1 })
    .lean();

  const totalSelesai = riwayat.filter((r) => r.status === "selesai").length;
  const donasiSelesai = riwayat.filter((r) => r.status === "selesai");
  const lastSelesai = donasiSelesai[0];
  const eligibleDate = tanggalBolehDonorLagi(lastSelesai?.selesaiAt);
  const belumBolehDonor = eligibleDate && new Date() < eligibleDate;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeaderIcon
        icon={UserRoundIcon}
        title={donor.nama || donor.telepon}
        description="Informasi Pendonor"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={DropletIcon}
          color="rose"
          label="Golongan Darah"
          value={donor.pendonor?.golonganDarah || "Belum diketahui"}
        />
        <StatCard
          icon={AwardIcon}
          color="emerald"
          label="Total Donor Selesai"
          value={totalSelesai}
        />
        <StatCard
          icon={belumBolehDonor ? CalendarClockIcon : CalendarCheckIcon}
          color={belumBolehDonor ? "amber" : "emerald"}
          label="Status Donor"
          value={
            belumBolehDonor
              ? `Mulai ${eligibleDate.toLocaleDateString("id-ID")}`
              : "Sudah boleh donor"
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCardIcon className="size-4 text-rose-600" />
            Data Diri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DetailField icon={IdCardIcon} label="Nama" value={donor.nama || "-"} />
          <DetailField icon={IdCardIcon} label="NIK" value={donor.pendonor?.nik || "-"} />
          <DetailField icon={MailIcon} label="Email" value={donor.email || "-"} />
          <DetailField icon={PhoneIcon} label="Telepon" value={donor.telepon} />
          <DetailField
            icon={CakeIcon}
            label="Tanggal Lahir"
            value={
              donor.pendonor?.tanggalLahir
                ? new Date(donor.pendonor.tanggalLahir).toLocaleDateString("id-ID")
                : "-"
            }
          />
          <DetailField
            icon={UsersIcon}
            label="Jenis Kelamin"
            value={jenisKelaminLabel(donor.pendonor?.jenisKelamin)}
          />
          <DetailField
            icon={MapPinIcon}
            label="Alamat"
            value={donor.pendonor?.alamat || "-"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="size-4 text-rose-600" />
            Riwayat Donor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {riwayat.length === 0 ? (
            <EmptyState
              icon={HistoryIcon}
              title="Belum ada riwayat donor"
              description="Riwayat partisipasi kegiatan donor darah akan muncul di sini."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riwayat.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.kegiatanId?.judul || "-"}</TableCell>
                    <TableCell>{r.kegiatanId?.cabangId?.nama || "-"}</TableCell>
                    <TableCell>
                      {new Date(r.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
