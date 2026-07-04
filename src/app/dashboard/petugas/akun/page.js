import Link from "next/link";
import { requireCurrentUser, getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DetailField } from "@/components/shared/detail-field";
import {
  UserRoundIcon,
  MailIcon,
  PhoneIcon,
  Building2Icon,
  BriefcaseIcon,
} from "lucide-react";

export default async function PetugasAkunPage() {
  const user = await requireCurrentUser();
  const session = await getSession();
  await connectDB();
  const cabang = await PmiCabang.findById(user.petugas?.cabangId).lean();

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Akun Saya</h1>
        <Button render={<Link href="/dashboard/petugas/akun/edit" />} variant="outline">
          Edit
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRoundIcon className="size-5 text-rose-600" />
            Data Diri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DetailField icon={UserRoundIcon} label="Nama" value={user.nama} />
          <DetailField icon={MailIcon} label="Email" value={user.email || "-"} />
          <DetailField icon={PhoneIcon} label="Telepon" value={user.telepon} />
          <DetailField
            icon={Building2Icon}
            label="Cabang PMI"
            value={cabang ? `${cabang.nama} - ${cabang.kota}` : "-"}
          />
          <DetailField
            icon={BriefcaseIcon}
            label="Jabatan"
            value={session.jabatan === "dokter" ? "Dokter" : "Staff"}
          />
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Cabang dan jabatan hanya bisa diubah oleh admin.
      </p>
    </div>
  );
}
