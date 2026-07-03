import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonorQrDisplay } from "@/components/qr/donor-qr-display";
import { Button } from "@/components/ui/button";
import { isPendonorProfileComplete } from "@/lib/pendonor";

function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

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
      <Card>
        <CardHeader>
          <CardTitle>QR Code Pendonor</CardTitle>
        </CardHeader>
        <CardContent>
          <DonorQrDisplay userId={user._id.toString()} />
          <p className="mt-3 text-center text-sm text-muted-foreground">
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
          <Field label="Nama" value={user.nama || "-"} />
          <Field label="NIK" value={user.pendonor?.nik || "-"} />
          <Field label="Email" value={user.email || "-"} />
          <Field label="Telepon" value={user.telepon} />
          <Field
            label="Tanggal Lahir"
            value={
              user.pendonor?.tanggalLahir
                ? new Date(user.pendonor.tanggalLahir).toLocaleDateString("id-ID")
                : "-"
            }
          />
          <Field
            label="Jenis Kelamin"
            value={jenisKelaminLabel(user.pendonor?.jenisKelamin)}
          />
          <Field label="Golongan Darah" value={user.pendonor?.golonganDarah || "-"} />
          <Field label="Alamat" value={user.pendonor?.alamat || "-"} />
        </CardContent>
      </Card>
    </div>
  );
}
