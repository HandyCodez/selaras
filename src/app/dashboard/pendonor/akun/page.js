import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonorQrDisplay } from "@/components/qr/donor-qr-display";

function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default async function PendonorAkunPage() {
  const user = await getCurrentUser();

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
        <CardHeader>
          <CardTitle>Data Diri</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Nama" value={user.nama} />
          <Field label="Email" value={user.email} />
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
            value={user.pendonor?.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
          />
          <Field label="Golongan Darah" value={user.pendonor?.golonganDarah || "-"} />
          <Field label="Alamat" value={user.pendonor?.alamat || "-"} />
        </CardContent>
      </Card>
    </div>
  );
}
