import Link from "next/link";
import { getSession } from "@/lib/auth";
import { roleHome } from "@/lib/roles";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeftIcon,
  ClipboardCheckIcon,
  CheckCircle2Icon,
  XCircleIcon,
  UserIcon,
  ScaleIcon,
  ActivityIcon,
  DropletIcon,
  ThermometerIcon,
  MoonIcon,
  CalendarClockIcon,
} from "lucide-react";

const SYARAT_UTAMA = [
  {
    icon: UserIcon,
    label: "Usia 17 - 65 tahun",
    detail: "Usia 17-18 tahun memerlukan izin tertulis dari orang tua/wali.",
  },
  {
    icon: ScaleIcon,
    label: "Berat badan minimal 45 kg",
  },
  {
    icon: ActivityIcon,
    label: "Tekanan darah normal",
    detail: "Sistolik 100-170 mmHg dan diastolik 70-100 mmHg.",
  },
  {
    icon: DropletIcon,
    label: "Kadar hemoglobin cukup",
    detail: "12,5 - 17,0 g/dL, diperiksa oleh petugas PMI saat wawancara medis.",
  },
  {
    icon: ThermometerIcon,
    label: "Suhu tubuh normal",
    detail: "Sekitar 36,6 - 37,5°C.",
  },
  {
    icon: MoonIcon,
    label: "Tidur cukup",
    detail: "Minimal 6 jam pada malam sebelum donor.",
  },
  {
    icon: CalendarClockIcon,
    label: "Jarak minimal 12 minggu dari donor terakhir",
    detail: "Sekitar 3 bulan sejak donor darah sebelumnya.",
  },
];

const KONDISI_TIDAK_BOLEH = [
  "Sedang hamil, menyusui, atau haid (khusus pendonor wanita)",
  "Sedang sakit, demam, flu, atau baru sembuh dari operasi",
  "Memiliki riwayat penyakit menular seperti HIV/AIDS, Hepatitis B/C, atau Sifilis",
  "Sedang mengonsumsi antibiotik atau obat-obatan tertentu",
  "Dalam kondisi mabuk atau baru mengonsumsi minuman beralkohol",
  "Memiliki tekanan darah tinggi atau rendah yang tidak terkontrol",
];

export default async function SyaratDonorPage() {
  const session = await getSession();

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
              <ClipboardCheckIcon className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Syarat Umum Donor Darah
              </h1>
              <p className="text-rose-100">
                Pastikan Anda memenuhi syarat berikut sebelum mendonorkan darah.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Syarat yang Harus Dipenuhi</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SYARAT_UTAMA.map((s) => (
              <Card key={s.label}>
                <CardContent className="flex items-start gap-3 pt-6">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                    <CheckCircle2Icon className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{s.label}</p>
                    {s.detail && (
                      <p className="text-xs text-muted-foreground">{s.detail}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Kondisi yang Tidak Diperbolehkan</h2>
          <Card className="border-destructive/30">
            <CardContent className="space-y-3 pt-6">
              {KONDISI_TIDAK_BOLEH.map((k) => (
                <div key={k} className="flex items-start gap-3">
                  <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <p className="text-sm text-muted-foreground">{k}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Pemeriksaan kesehatan akhir (tensi, berat badan, hemoglobin) akan
            dilakukan langsung oleh petugas PMI melalui wawancara medis di
            lokasi donor sebelum Anda diperbolehkan mendonorkan darah.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
