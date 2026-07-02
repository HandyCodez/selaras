import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterRumahSakitForm } from "@/components/forms/register-rumah-sakit-form";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";

export default async function RegisterRumahSakitPage() {
  await connectDB();
  const cabangList = JSON.parse(
    JSON.stringify(await PmiCabang.find({ isActive: true }).sort({ nama: 1 })),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Rumah Sakit</CardTitle>
        <CardDescription>
          Buat akun untuk mengajukan permintaan darah ke PMI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterRumahSakitForm cabangList={cabangList} />
      </CardContent>
    </Card>
  );
}
