import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import {
  HeartPulse,
  Users,
  Hospital,
  ShieldCheck,
  ArrowRight,
  Droplets,
  Clock,
  MapPin,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "10.000+", label: "Pendonor Aktif", icon: Users },
  { value: "50+", label: "Rumah Sakit Mitra", icon: Hospital },
  { value: "24/7", label: "Layanan Darurat", icon: Clock },
  { value: "100+", label: "Kota di Indonesia", icon: MapPin },
];

const features = [
  {
    icon: Droplets,
    title: "Temukan Pendonor",
    description:
      "Cari pendonor darah dengan golongan darah yang sesuai di sekitar Anda secara cepat dan mudah.",
  },
  {
    icon: Hospital,
    title: "Jaringan Rumah Sakit",
    description:
      "Terhubung langsung dengan PMI dan jaringan rumah sakit mitra kami di seluruh Indonesia.",
  },
  {
    icon: ShieldCheck,
    title: "Terverifikasi & Aman",
    description:
      "Setiap pendonor telah melewati proses verifikasi untuk memastikan keamanan dan kenyamanan semua pihak.",
  },
  {
    icon: HeartPulse,
    title: "Pantau Kesehatan Anda",
    description:
      "Catat riwayat donor, pantau jadwal berikutnya, dan jaga kesehatan Anda melalui dashboard pribadi.",
  },
];

const steps = [
  {
    number: "01",
    title: "Daftar Akun",
    description:
      "Buat akun gratis sebagai pendonor, petugas PMI, atau rumah sakit.",
  },
  {
    number: "02",
    title: "Lengkapi Profil",
    description:
      "Isi data golongan darah, lokasi, dan riwayat kesehatan Anda.",
  },
  {
    number: "03",
    title: "Mulai Berdonor",
    description:
      "Terima permintaan donor, pantau kebutuhan darah, dan selamatkan nyawa.",
  },
];

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="SELARAS+"
            width={32}
            height={32}
            className="size-8 rounded-lg object-contain"
          />
          <span className="font-bold text-lg tracking-tight">SELARAS+</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/syarat-donor" className="transition-colors hover:text-foreground">
            Syarat Donor
          </Link>
          <Link href="/berita" className="transition-colors hover:text-foreground">
            Berita
          </Link>
          <Link href="/komunitas" className="transition-colors hover:text-foreground">
            Komunitas
          </Link>
          <Link href="/edukasi" className="transition-colors hover:text-foreground">
            Edukasi
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button render={<Link href="/login" />} variant="ghost" size="sm">
            Masuk
          </Button>
          <Button render={<Link href="/register" />} size="sm">
            Daftar
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-red-100/40 blur-3xl dark:bg-red-950/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 size-96 rounded-full bg-rose-100/30 blur-3xl dark:bg-rose-950/10"
      />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
          <Droplets className="size-3" />
          Platform Donor Darah Indonesia
        </span>

        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Selamatkan Nyawa dengan{" "}
          <span className="text-red-600 dark:text-red-400">Satu Tetes Darah</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          SELARAS+ menghubungkan pendonor, PMI, dan rumah sakit untuk
          mempermudah proses donor darah di seluruh Indonesia — kapan saja, di
          mana saja.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            render={<Link href="/register" />}
            size="lg"
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 px-6"
          >
            Mulai Berdonor
            <ArrowRight className="ml-1 size-4" />
          </Button>
          <Button
            render={<Link href="/login" />}
            variant="outline"
            size="lg"
            className="px-6"
          >
            Sudah punya akun? Masuk
          </Button>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="relative flex items-center justify-center size-40 rounded-3xl border border-red-100 bg-red-50/60 shadow-xl dark:border-red-900/50 dark:bg-red-950/20">
            <Image
              src="/logo.jpeg"
              alt="SELARAS+"
              width={120}
              height={120}
              priority
              className="size-24 rounded-2xl object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {stats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-8 text-center"
          >
            <Icon className="size-6 text-red-500" />
            <p className="text-3xl font-extrabold tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Semua yang Anda Butuhkan
          </h2>
          <p className="mt-4 text-muted-foreground">
            Platform lengkap untuk ekosistem donor darah yang lebih baik.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <Icon className="size-5" />
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Cara Kerja
          </h2>
          <p className="mt-4 text-muted-foreground">
            Mulai berdonor hanya dalam tiga langkah mudah.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(({ number, title, description }) => (
            <div
              key={number}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex size-16 items-center justify-center rounded-full border-2 border-red-200 bg-background text-red-600 font-extrabold text-lg dark:border-red-800 dark:text-red-400">
                {number}
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBannerSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-red-600 px-8 py-16 text-center dark:bg-red-700">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 size-96 rounded-full bg-white/10 blur-3xl"
          />
          <HeartPulse className="mx-auto mb-4 size-10 text-red-200" />
          <h2 className="mx-auto max-w-xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Bergabunglah dan Jadi Pahlawan Nyata
          </h2>
          <p className="mx-auto mt-4 max-w-md text-red-100">
            Ribuan orang membutuhkan darah setiap hari. Darah Anda bisa
            menyelamatkan hingga 3 nyawa. Daftar sekarang dan jadilah bagian
            dari komunitas SELARAS+.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              render={<Link href="/register" />}
              size="lg"
              className="bg-white text-red-600 hover:bg-red-50 px-6"
            >
              Daftar Gratis Sekarang
              <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button
              render={<Link href="/komunitas" />}
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 px-6"
            >
              Lihat Komunitas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="SELARAS+"
              width={28}
              height={28}
              className="size-7 rounded-lg object-contain"
            />
            <span className="font-bold">SELARAS+</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link
              href="/syarat-donor"
              className="hover:text-foreground transition-colors"
            >
              Syarat Donor
            </Link>
            <Link
              href="/berita"
              className="hover:text-foreground transition-colors"
            >
              Berita
            </Link>
            <Link
              href="/komunitas"
              className="hover:text-foreground transition-colors"
            >
              Komunitas
            </Link>
            <Link
              href="/edukasi"
              className="hover:text-foreground transition-colors"
            >
              Edukasi
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SELARAS+. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaBannerSection />
      </main>
      <Footer />
    </div>
  );
}
