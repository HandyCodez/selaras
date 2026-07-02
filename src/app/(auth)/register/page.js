import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeartPulseIcon, Building2Icon } from "lucide-react";

export default function RegisterChoicePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-xl font-semibold">Daftar Sebagai</h1>
      <Link href="/register/pendonor">
        <Card className="transition-colors hover:border-primary">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <HeartPulseIcon className="size-8 text-primary" />
            <div>
              <CardTitle>Pendonor</CardTitle>
              <CardDescription>Daftar untuk mendonorkan darah</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </Link>
      <Link href="/register/rumah-sakit">
        <Card className="transition-colors hover:border-primary">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <Building2Icon className="size-8 text-primary" />
            <div>
              <CardTitle>Rumah Sakit</CardTitle>
              <CardDescription>Daftar untuk mengajukan permintaan darah</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </Link>
      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
