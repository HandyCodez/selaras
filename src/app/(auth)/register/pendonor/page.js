import Link from "next/link";
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
      <CardContent className="space-y-4">
        <RegisterPendonorForm />
        <p className="text-center text-sm text-muted-foreground">
          Belum tahu syaratnya?{" "}
          <Link href="/syarat-donor" className="font-medium underline">
            Cek syarat umum donor darah
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
