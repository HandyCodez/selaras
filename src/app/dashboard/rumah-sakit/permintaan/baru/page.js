import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermintaanForm } from "@/components/forms/permintaan-form";
import { ClipboardListIcon } from "lucide-react";

export default async function PermintaanBaruPage() {
  const user = await requireCurrentUser();
  await connectDB();
  const cabangList = JSON.parse(
    JSON.stringify(await PmiCabang.find({ isActive: true }).sort({ nama: 1 })),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardListIcon className="size-5 text-rose-600" />
          Ajukan Permintaan Darah
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PermintaanForm
          cabangList={cabangList}
          defaultCabangId={user.rumahSakit?.defaultCabangId?.toString()}
        />
      </CardContent>
    </Card>
  );
}
