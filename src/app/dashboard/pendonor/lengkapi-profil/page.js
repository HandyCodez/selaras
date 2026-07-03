import { requireCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LengkapiProfilForm } from "@/components/forms/lengkapi-profil-form";

export default async function LengkapiProfilPage() {
  const user = await requireCurrentUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lengkapi Data Diri</CardTitle>
        <CardDescription>
          Data ini diperlukan sebelum Anda bisa mendonorkan darah.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LengkapiProfilForm user={JSON.parse(JSON.stringify(user))} />
      </CardContent>
    </Card>
  );
}
