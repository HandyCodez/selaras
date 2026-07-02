import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartPulseIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-zinc-950">
      <HeartPulseIcon className="size-16 text-primary" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Selaras</h1>
        <p className="max-w-md text-muted-foreground">
          Aplikasi donor darah yang menghubungkan pendonor, PMI, dan rumah
          sakit untuk mempermudah proses donor darah.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <Button render={<Link href="/register" />} size="lg">
          Daftar Sekarang
        </Button>
        <Button render={<Link href="/login" />} variant="outline" size="lg">
          Masuk
        </Button>
      </div>
      <Link href="/berita" className="text-sm underline text-muted-foreground">
        Lihat berita seputar donor darah
      </Link>
    </div>
  );
}
