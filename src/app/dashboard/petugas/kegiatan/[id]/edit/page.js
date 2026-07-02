import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KegiatanForm } from "@/components/forms/kegiatan-form";
import { updateKegiatan } from "@/actions/kegiatan.actions";

export default async function KegiatanEditPage({ params }) {
  const { id } = await params;
  const session = await requireRole("petugas");
  await connectDB();

  const kegiatan = await Kegiatan.findOne({
    _id: id,
    cabangId: session.cabangId,
  }).lean();
  if (!kegiatan) notFound();

  const action = updateKegiatan.bind(null, id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Kegiatan</CardTitle>
      </CardHeader>
      <CardContent>
        <KegiatanForm action={action} kegiatan={JSON.parse(JSON.stringify(kegiatan))} />
      </CardContent>
    </Card>
  );
}
