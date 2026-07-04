import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BeritaForm } from "@/components/forms/berita-form";
import { createBerita } from "@/actions/berita.actions";
import { NewspaperIcon } from "lucide-react";

export default function BeritaBaruPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <NewspaperIcon className="size-5 text-rose-600" />
          Buat Berita
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BeritaForm action={createBerita} />
      </CardContent>
    </Card>
  );
}
