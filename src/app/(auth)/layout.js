import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="flex justify-center">
          <Image
            src="/logo.jpeg"
            alt="Selaras+"
            width={374}
            height={331}
            priority
            className="h-12 w-auto rounded-lg object-contain"
          />
        </Link>
        {children}
      </div>
    </div>
  );
}
