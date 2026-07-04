import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KegiatanForm } from "@/components/forms/kegiatan-form";
import { createKegiatan } from "@/actions/kegiatan.actions";
import { CalendarHeartIcon } from "lucide-react";

export default function KegiatanBaruPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarHeartIcon className="size-5 text-rose-600" />
          Buat Kegiatan Donor Darah
        </CardTitle>
      </CardHeader>
      <CardContent>
        <KegiatanForm action={createKegiatan} />
      </CardContent>
    </Card>
  );
}
