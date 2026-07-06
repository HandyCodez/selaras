import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-zinc-950">
      <Image
        src="/logo.jpeg"
        alt="Selaras"
        width={374}
        height={331}
        priority
        className="h-20 w-auto rounded-xl object-contain"
      />
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
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
        <Link href="/syarat-donor" className="underline text-muted-foreground">
          Syarat umum donor darah
        </Link>
        <Link href="/berita" className="underline text-muted-foreground">
          Lihat berita seputar donor darah
        </Link>
        <Link href="/komunitas" className="underline text-muted-foreground">
          Komunitas donor darah
        </Link>
        <Link href="/edukasi" className="underline text-muted-foreground">
          Edukasi donor darah
        </Link>
      </div>
    </div>
  );
}
