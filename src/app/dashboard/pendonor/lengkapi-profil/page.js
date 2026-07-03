import { requireCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LengkapiProfilForm } from "@/components/forms/lengkapi-profil-form";
import { UserCircleIcon } from "lucide-react";

export default async function LengkapiProfilPage() {
  const user = await requireCurrentUser();

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-100">
            <UserCircleIcon className="size-6 text-rose-600" />
          </div>
          <div>
            <CardTitle>Lengkapi Data Diri</CardTitle>
            <CardDescription>
              Data ini diperlukan sebelum Anda bisa mendonorkan darah.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <LengkapiProfilForm user={JSON.parse(JSON.stringify(user))} />
      </CardContent>
    </Card>
  );
}
