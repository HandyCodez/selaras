import Link from "next/link";
import mongoose from "mongoose";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { UserRoundSearchIcon, SearchIcon, DropletIcon } from "lucide-react";

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function PetugasPendonorPage({ searchParams }) {
  const { q } = await searchParams;
  const session = await requireRole("petugas");
  await connectDB();

  const cabangObjectId = new mongoose.Types.ObjectId(session.cabangId);

  const pipeline = [
    {
      $lookup: {
        from: "kegiatans",
        localField: "kegiatanId",
        foreignField: "_id",
        as: "kegiatan",
      },
    },
    { $unwind: "$kegiatan" },
    { $match: { "kegiatan.cabangId": cabangObjectId } },
    {
      $group: {
        _id: "$donorId",
        totalDonor: {
          $sum: { $cond: [{ $eq: ["$status", "selesai"] }, 1, 0] },
        },
        donorTerakhir: { $max: "$selesaiAt" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "donor",
      },
    },
    { $unwind: "$donor" },
  ];

  if (q) {
    const safe = escapeRegex(q);
    pipeline.push({
      $match: {
        $or: [
          { "donor.nama": { $regex: safe, $options: "i" } },
          { "donor.telepon": { $regex: safe, $options: "i" } },
          { "donor.pendonor.nik": { $regex: safe, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push({ $sort: { "donor.nama": 1 } });

  const pendonorList = await Partisipasi.aggregate(pipeline);

  return (
    <div className="space-y-6">
      <PageHeaderIcon
        icon={UserRoundSearchIcon}
        title="Data Pendonor"
        description="Cari dan lihat informasi pendonor yang pernah ikut kegiatan di cabang Anda."
      />

      <form className="flex max-w-md gap-2">
        <Input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Cari nama, telepon, atau NIK..."
        />
        <Button type="submit" variant="outline">
          <SearchIcon className="size-4" />
          Cari
        </Button>
      </form>

      {pendonorList.length === 0 ? (
        <EmptyState
          icon={UserRoundSearchIcon}
          title={q ? "Pendonor tidak ditemukan" : "Belum ada pendonor"}
          description={
            q
              ? "Coba kata kunci lain seperti nama, telepon, atau NIK."
              : "Pendonor yang mendaftar kegiatan di cabang Anda akan muncul di sini."
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Golongan Darah</TableHead>
              <TableHead>Total Donor</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendonorList.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="font-medium">{p.donor.nama || "-"}</TableCell>
                <TableCell>{p.donor.telepon}</TableCell>
                <TableCell>
                  {p.donor.pendonor?.golonganDarah ? (
                    <Badge variant="outline" className="gap-1">
                      <DropletIcon className="size-3 text-rose-600" />
                      {p.donor.pendonor.golonganDarah}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{p.totalDonor}</TableCell>
                <TableCell className="text-right">
                  <Button
                    render={<Link href={`/dashboard/petugas/pendonor/${p._id}`} />}
                    variant="ghost"
                    size="sm"
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
