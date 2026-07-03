import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonorQrDisplay } from "@/components/qr/donor-qr-display";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailField } from "@/components/shared/detail-field";
import { isPendonorProfileComplete } from "@/lib/pendonor";
import {
  IdCardIcon,
  MailIcon,
  PhoneIcon,
  CakeIcon,
  UsersIcon,
  MapPinIcon,
  DropletIcon,
} from "lucide-react";

function jenisKelaminLabel(jk) {
  if (jk === "L") return "Laki-laki";
  if (jk === "P") return "Perempuan";
  return "-";
}

export default async function PendonorAkunPage() {
  const user = await requireCurrentUser();
  const profileComplete = isPendonorProfileComplete(user);

  return (
    <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader className="bg-rose-600 text-white">
          <CardTitle className="flex items-center gap-2 text-white">
            <IdCardIcon className="size-5" />
            Kartu Donor Digital
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6 text-center">
          <DonorQrDisplay userId={user._id.toString()} />
          <div>
            <p className="font-semibold">{user.nama || user.telepon}</p>
            <Badge variant="secondary" className="mt-1 gap-1">
              <DropletIcon className="size-3" />
              {user.pendonor?.golonganDarah || "Golongan darah belum diketahui"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tunjukkan QR ini saat check-in di lokasi donor darah.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Data Diri</CardTitle>
          <Button
            render={<Link href="/dashboard/pendonor/lengkapi-profil" />}
            variant="outline"
            size="sm"
          >
            {profileComplete ? "Edit" : "Lengkapi"}
          </Button>
        </CardHeader>
        <CardContent>
          <DetailField icon={IdCardIcon} label="Nama" value={user.nama || "-"} />
          <DetailField icon={IdCardIcon} label="NIK" value={user.pendonor?.nik || "-"} />
          <DetailField icon={MailIcon} label="Email" value={user.email || "-"} />
          <DetailField icon={PhoneIcon} label="Telepon" value={user.telepon} />
          <DetailField
            icon={CakeIcon}
            label="Tanggal Lahir"
            value={
              user.pendonor?.tanggalLahir
                ? new Date(user.pendonor.tanggalLahir).toLocaleDateString("id-ID")
                : "-"
            }
          />
          <DetailField
            icon={UsersIcon}
            label="Jenis Kelamin"
            value={jenisKelaminLabel(user.pendonor?.jenisKelamin)}
          />
          <DetailField
            icon={DropletIcon}
            label="Golongan Darah"
            value={user.pendonor?.golonganDarah || "-"}
          />
          <DetailField
            icon={MapPinIcon}
            label="Alamat"
            value={user.pendonor?.alamat || "-"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
