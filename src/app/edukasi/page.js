import Link from "next/link";
import { getSession } from "@/lib/auth";
import { roleHome } from "@/lib/roles";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeftIcon,
  GraduationCapIcon,
  HeartHandshakeIcon,
  ActivityIcon,
  StethoscopeIcon,
  FlameIcon,
  SearchCheckIcon,
  SmileIcon,
  ShieldCheckIcon,
  ClipboardListIcon,
  DropletIcon,
  BedIcon,
  SoupIcon,
  CircleCheckIcon,
  CircleXIcon,
  CupSodaIcon,
  UtensilsIcon,
  MoonIcon,
  BanIcon,
  TimerIcon,
  BandageIcon,
} from "lucide-react";

const MANFAAT = [
  {
    icon: HeartHandshakeIcon,
    title: "Menyelamatkan hingga 3 nyawa",
    desc: "Satu kantong darah bisa dipisah menjadi beberapa komponen untuk membantu lebih dari satu pasien.",
  },
  {
    icon: ActivityIcon,
    title: "Memicu regenerasi sel darah",
    desc: "Tubuh akan memproduksi sel darah merah baru untuk menggantikan yang didonorkan.",
  },
  {
    icon: SearchCheckIcon,
    title: "Skrining kesehatan gratis",
    desc: "Tensi, berat badan, hemoglobin, dan golongan darah dicek setiap kali donor.",
  },
  {
    icon: FlameIcon,
    title: "Membakar kalori",
    desc: "Satu sesi donor darah dapat membakar sekitar 650 kalori.",
  },
  {
    icon: StethoscopeIcon,
    title: "Menjaga kadar zat besi",
    desc: "Donor rutin membantu mengurangi risiko kelebihan zat besi dalam darah.",
  },
  {
    icon: SmileIcon,
    title: "Kepuasan batin",
    desc: "Rasa senang karena telah membantu menyelamatkan hidup orang lain.",
  },
];

const PROSES = [
  {
    icon: ClipboardListIcon,
    title: "Pendaftaran & Kuesioner",
    desc: "Isi data diri dan kuesioner riwayat kesehatan dengan jujur.",
  },
  {
    icon: StethoscopeIcon,
    title: "Pemeriksaan Awal",
    desc: "Petugas PMI memeriksa tensi, berat badan, dan kadar hemoglobin.",
  },
  {
    icon: DropletIcon,
    title: "Proses Donor",
    desc: "Pengambilan darah berlangsung sekitar 10-15 menit, sekitar 350-450 ml.",
  },
  {
    icon: SoupIcon,
    title: "Istirahat & Konsumsi",
    desc: "Beristirahat sejenak dan menikmati makanan/minuman ringan yang disediakan.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Darah Diproses PMI",
    desc: "Kantong darah diperiksa, diproses, dan disimpan sesuai standar PMI.",
  },
];

const MITOS_FAKTA = [
  {
    mitos: "Donor darah membuat badan gemuk.",
    fakta: "Justru sebaliknya, satu sesi donor darah membakar sekitar 650 kalori.",
  },
  {
    mitos: "Donor darah itu menyakitkan.",
    fakta: "Hanya sedikit nyeri singkat saat jarum ditusukkan, prosesnya sendiri tidak sakit.",
  },
  {
    mitos: "Tubuh akan lemas berkepanjangan setelah donor.",
    fakta: "Tubuh umumnya pulih penuh dalam 24-48 jam dengan istirahat dan asupan cukup.",
  },
  {
    mitos: "Orang yang punya tato tidak boleh donor selamanya.",
    fakta: "Hanya perlu menunggu masa tunggu tertentu setelah tato, bukan larangan permanen.",
  },
  {
    mitos: "Donor darah bisa menularkan penyakit.",
    fakta: "Semua alat yang digunakan steril dan sekali pakai, jadi aman bagi pendonor.",
  },
  {
    mitos: "Wanita yang sedang haid boleh donor kapan saja.",
    fakta: "Sebaiknya ditunda dulu sampai selesai haid untuk menghindari anemia sementara.",
  },
];

const TIPS_SEBELUM = [
  { icon: MoonIcon, text: "Tidur cukup, minimal 6 jam pada malam sebelumnya." },
  { icon: UtensilsIcon, text: "Makan terlebih dahulu, jangan dalam kondisi perut kosong." },
  { icon: CupSodaIcon, text: "Perbanyak minum air putih sebelum donor." },
  { icon: BanIcon, text: "Hindari makanan berlemak tinggi sebelum donor." },
];

const TIPS_SESUDAH = [
  { icon: TimerIcon, text: "Istirahat beberapa menit di lokasi donor sebelum beraktivitas." },
  { icon: SoupIcon, text: "Habiskan makanan dan minuman yang disediakan panitia." },
  { icon: BandageIcon, text: "Jaga plester bekas donor tetap kering selama beberapa jam." },
  { icon: BanIcon, text: "Hindari aktivitas fisik berat selama kurang lebih 24 jam." },
];

export default async function EdukasiPage() {
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
              <GraduationCapIcon className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edukasi Donor Darah</h1>
              <p className="text-rose-100">
                Kenali manfaat, proses, dan fakta seputar donor darah.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <Tabs defaultValue="manfaat">
          <TabsList className="w-full flex-wrap sm:w-fit">
            <TabsTrigger value="manfaat">Manfaat</TabsTrigger>
            <TabsTrigger value="proses">Proses Donor</TabsTrigger>
            <TabsTrigger value="mitos">Mitos &amp; Fakta</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="manfaat" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {MANFAAT.map((m) => (
                <Card key={m.title}>
                  <CardContent className="flex items-start gap-3 pt-6">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
                      <m.icon className="size-4.5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proses" className="mt-4">
            <div className="space-y-3">
              {PROSES.map((p, i) => (
                <Card key={p.title}>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white">
                      {i + 1}
                    </div>
                    <div className="flex flex-1 items-center gap-3">
                      <p.icon className="size-4 shrink-0 text-rose-600" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mitos" className="mt-4">
            <div className="space-y-3">
              {MITOS_FAKTA.map((m) => (
                <Card key={m.mitos}>
                  <CardContent className="space-y-2 pt-6">
                    <div className="flex items-start gap-2">
                      <CircleXIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                      <p className="text-sm">
                        <span className="font-medium">Mitos: </span>
                        {m.mitos}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Fakta: </span>
                        {m.fakta}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="mt-4 space-y-6">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-rose-600">Sebelum Donor</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {TIPS_SEBELUM.map((t) => (
                  <Card key={t.text}>
                    <CardContent className="flex items-center gap-3 pt-6">
                      <t.icon className="size-4 shrink-0 text-rose-600" />
                      <p className="text-sm text-muted-foreground">{t.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-rose-600">Sesudah Donor</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {TIPS_SESUDAH.map((t) => (
                  <Card key={t.text}>
                    <CardContent className="flex items-center gap-3 pt-6">
                      <t.icon className="size-4 shrink-0 text-rose-600" />
                      <p className="text-sm text-muted-foreground">{t.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
