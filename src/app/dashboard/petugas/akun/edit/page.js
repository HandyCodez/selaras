import { requireCurrentUser } from "@/lib/auth";
import { EditPetugasProfileForm } from "@/components/forms/edit-petugas-profile-form";

export default async function EditPetugasAkunPage() {
  const user = await requireCurrentUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Akun</h1>
      <EditPetugasProfileForm user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
