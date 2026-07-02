import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BeritaForm } from "@/components/forms/berita-form";
import { createBerita } from "@/actions/berita.actions";

export default function BeritaBaruPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Berita</CardTitle>
      </CardHeader>
      <CardContent>
        <BeritaForm action={createBerita} />
      </CardContent>
    </Card>
  );
}
