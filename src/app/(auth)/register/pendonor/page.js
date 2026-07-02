import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterPendonorForm } from "@/components/forms/register-pendonor-form";

export default function RegisterPendonorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pendonor</CardTitle>
        <CardDescription>Buat akun untuk mulai mendonorkan darah.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterPendonorForm />
      </CardContent>
    </Card>
  );
}
