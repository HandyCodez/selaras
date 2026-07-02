import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetugasAccountForm } from "@/components/forms/petugas-account-form";
import { createPetugasAccount } from "@/actions/petugas-account.actions";

export default async function PetugasBaruPage() {
  await requireRole("admin");
  await connectDB();
  const cabangList = JSON.parse(
    JSON.stringify(await PmiCabang.find({ isActive: true }).sort({ nama: 1 })),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Akun Petugas</CardTitle>
      </CardHeader>
      <CardContent>
        <PetugasAccountForm action={createPetugasAccount} cabangList={cabangList} />
      </CardContent>
    </Card>
  );
}
