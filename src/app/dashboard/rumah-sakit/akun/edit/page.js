import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RumahSakit } from "@/lib/models";
import { EditRumahSakitForm } from "@/components/forms/edit-rumah-sakit-form";
import { ChangePasswordForm } from "@/components/forms/change-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRoundIcon } from "lucide-react";

export default async function EditRumahSakitAkunPage() {
  const user = await requireCurrentUser();
  await connectDB();
  const rumahSakit = await RumahSakit.findById(user.rumahSakit?.rumahSakitId).lean();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Akun</h1>
      <EditRumahSakitForm
        user={JSON.parse(JSON.stringify(user))}
        rumahSakit={JSON.parse(JSON.stringify(rumahSakit))}
      />
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
