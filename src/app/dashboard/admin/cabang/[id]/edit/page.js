import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CabangForm } from "@/components/forms/cabang-form";
import { updateCabang } from "@/actions/cabang.actions";

export default async function CabangEditPage({ params }) {
  const { id } = await params;
  await requireRole("admin");
  await connectDB();
  const cabang = await PmiCabang.findById(id).lean();
  if (!cabang) notFound();

  const action = updateCabang.bind(null, id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Cabang PMI</CardTitle>
      </CardHeader>
      <CardContent>
        <CabangForm action={action} cabang={JSON.parse(JSON.stringify(cabang))} />
      </CardContent>
    </Card>
  );
}
