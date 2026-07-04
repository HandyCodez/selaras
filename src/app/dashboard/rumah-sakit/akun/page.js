import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RumahSakit } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DetailField } from "@/components/shared/detail-field";
import {
  UserRoundIcon,
  MailIcon,
  PhoneIcon,
  Building2Icon,
  MapPinIcon,
} from "lucide-react";

export default async function RumahSakitAkunPage() {
  const user = await requireCurrentUser();
  await connectDB();
  const rumahSakit = await RumahSakit.findById(
    user.rumahSakit?.rumahSakitId,
  ).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Akun Saya</h1>
        <Button render={<Link href="/dashboard/rumah-sakit/akun/edit" />} variant="outline">
          Edit
        </Button>
      </div>
      <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRoundIcon className="size-5 text-rose-600" />
              Data PIC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DetailField icon={UserRoundIcon} label="Nama" value={user.nama} />
            <DetailField icon={MailIcon} label="Email" value={user.email || "-"} />
            <DetailField icon={PhoneIcon} label="Telepon" value={user.telepon} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2Icon className="size-5 text-rose-600" />
              Data Rumah Sakit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DetailField
              icon={Building2Icon}
              label="Nama Rumah Sakit"
              value={rumahSakit?.nama}
            />
            <DetailField icon={MapPinIcon} label="Kota" value={rumahSakit?.kota} />
            <DetailField
              icon={MapPinIcon}
              label="Alamat"
              value={rumahSakit?.alamat || "-"}
            />
            <DetailField
              icon={PhoneIcon}
              label="Telepon RS"
              value={rumahSakit?.telepon || "-"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
