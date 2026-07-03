import Link from "next/link";
import { requireCurrentUser, getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

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
          <CardTitle>Data Diri</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Nama" value={user.nama} />
          <Field label="Email" value={user.email || "-"} />
          <Field label="Telepon" value={user.telepon} />
          <Field label="Cabang PMI" value={cabang ? `${cabang.nama} - ${cabang.kota}` : "-"} />
          <Field
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
