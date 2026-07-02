import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RumahSakit } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default async function RumahSakitAkunPage() {
  const user = await requireCurrentUser();
  await connectDB();
  const rumahSakit = await RumahSakit.findById(
    user.rumahSakit?.rumahSakitId,
  ).lean();

  return (
    <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Data PIC</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Nama" value={user.nama} />
          <Field label="Email" value={user.email} />
          <Field label="Telepon" value={user.telepon} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data Rumah Sakit</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Nama Rumah Sakit" value={rumahSakit?.nama} />
          <Field label="Kota" value={rumahSakit?.kota} />
          <Field label="Alamat" value={rumahSakit?.alamat || "-"} />
        </CardContent>
      </Card>
    </div>
  );
}
