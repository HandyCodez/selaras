import Link from "next/link";
import { getSession } from "@/lib/auth";
import { roleHome } from "@/lib/roles";
import { connectDB } from "@/lib/db";
import { PmiCabang } from "@/lib/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftIcon,
  HeartHandshakeIcon,
  MessageCircleIcon,
  CameraIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

// Placeholder — ganti dengan tautan/kontak komunitas donor darah yang asli.
const KANAL_KOMUNITAS = [
  {
    icon: MessageCircleIcon,
    label: "Grup WhatsApp Komunitas Pendonor",
    value: "+62 812-3456-7890",
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    icon: CameraIcon,
    label: "Instagram",
    value: "@selaras.donordarah",
    color: "text-rose-600 bg-rose-100 dark:bg-rose-950 dark:text-rose-400",
  },
  {
    icon: MailIcon,
    label: "Email",
    value: "komunitas@selaras.id",
    color: "text-sky-600 bg-sky-100 dark:bg-sky-950 dark:text-sky-400",
  },
];

export default async function KomunitasPage() {
  const session = await getSession();
  await connectDB();
  const cabangList = await PmiCabang.find({ isActive: true }).sort({ nama: 1 }).lean();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-linear-to-br from-rose-600 to-rose-500 px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl space-y-4">
          <Link
            href={session ? roleHome(session.role) : "/"}
            className="inline-flex items-center gap-1 text-sm text-rose-100 hover:text-white"
          >
            <ArrowLeftIcon className="size-3.5" />
            {session ? "Kembali ke Dashboard" : "Kembali ke Beranda"}
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <HeartHandshakeIcon className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Komunitas Donor Darah
              </h1>
              <p className="text-rose-100">
                Terhubung dengan sesama pendonor dan dapatkan info terbaru.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Gabung Komunitas Kami</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {KANAL_KOMUNITAS.map((k) => (
              <Card key={k.label}>
                <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full ${k.color}`}
                  >
                    <k.icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{k.label}</p>
                    <p className="text-xs text-muted-foreground">{k.value}</p>
                  </div>
                  <Badge variant="secondary">Segera hadir</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Kontak di atas masih berupa contoh dan akan diperbarui dengan
            tautan resmi komunitas Selaras+.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Hubungi Cabang PMI Terdekat</h2>
          {cabangList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data cabang PMI.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {cabangList.map((c) => (
                <Card key={c._id}>
                  <CardContent className="space-y-2 pt-6">
                    <p className="font-medium">{c.nama}</p>
                    {c.alamat && (
                      <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <MapPinIcon className="mt-0.5 size-3.5 shrink-0" />
                        {c.alamat}, {c.kota}
                      </p>
                    )}
                    {c.telepon && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <PhoneIcon className="size-3.5 shrink-0" />
                        {c.telepon}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
