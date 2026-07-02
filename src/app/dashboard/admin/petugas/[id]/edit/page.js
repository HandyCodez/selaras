import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User, PmiCabang } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetugasAccountForm } from "@/components/forms/petugas-account-form";
import { updatePetugasAccount } from "@/actions/petugas-account.actions";

export default async function PetugasEditPage({ params }) {
  const { id } = await params;
  await requireRole("admin");
  await connectDB();

  const [petugas, cabangList] = await Promise.all([
    User.findOne({ _id: id, role: "petugas" }).lean(),
    PmiCabang.find({ isActive: true }).sort({ nama: 1 }).lean(),
  ]);
  if (!petugas) notFound();

  const action = updatePetugasAccount.bind(null, id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Akun Petugas</CardTitle>
      </CardHeader>
      <CardContent>
        <PetugasAccountForm
          action={action}
          cabangList={JSON.parse(JSON.stringify(cabangList))}
          petugas={JSON.parse(JSON.stringify(petugas))}
        />
      </CardContent>
    </Card>
  );
}
