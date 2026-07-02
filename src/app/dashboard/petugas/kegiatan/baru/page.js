import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KegiatanForm } from "@/components/forms/kegiatan-form";
import { createKegiatan } from "@/actions/kegiatan.actions";

export default function KegiatanBaruPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Kegiatan Donor Darah</CardTitle>
      </CardHeader>
      <CardContent>
        <KegiatanForm action={createKegiatan} />
      </CardContent>
    </Card>
  );
}
