import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Berita } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BeritaForm } from "@/components/forms/berita-form";
import { updateBerita } from "@/actions/berita.actions";

export default async function BeritaEditPage({ params }) {
  const { id } = await params;
  await requireRole("petugas");
  await connectDB();
  const berita = await Berita.findById(id).lean();
  if (!berita) notFound();

  const action = updateBerita.bind(null, id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Berita</CardTitle>
      </CardHeader>
      <CardContent>
        <BeritaForm action={action} berita={JSON.parse(JSON.stringify(berita))} />
      </CardContent>
    </Card>
  );
}
