import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RumahSakit } from "@/lib/models";
import { EditRumahSakitForm } from "@/components/forms/edit-rumah-sakit-form";

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
    </div>
  );
}
