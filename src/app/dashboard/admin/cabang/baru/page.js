import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CabangForm } from "@/components/forms/cabang-form";
import { createCabang } from "@/actions/cabang.actions";

export default function CabangBaruPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Cabang PMI</CardTitle>
      </CardHeader>
      <CardContent>
        <CabangForm action={createCabang} />
      </CardContent>
    </Card>
  );
}
