import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Masuk</CardTitle>
        <CardDescription>
          Masuk ke akun pendonor, petugas PMI, atau rumah sakit Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium underline">
            Daftar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
