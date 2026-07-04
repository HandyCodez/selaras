import { requireCurrentUser } from "@/lib/auth";
import { EditPetugasProfileForm } from "@/components/forms/edit-petugas-profile-form";
import { ChangePasswordForm } from "@/components/forms/change-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRoundIcon, UserRoundIcon } from "lucide-react";

export default async function EditPetugasAkunPage() {
  const user = await requireCurrentUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Akun</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRoundIcon className="size-5 text-rose-600" />
            Data Diri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditPetugasProfileForm user={JSON.parse(JSON.stringify(user))} />
        </CardContent>
      </Card>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRoundIcon className="size-5 text-rose-600" />
            Ubah Kata Sandi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
