import Link from "next/link";
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
        <Link href="/" className="block text-center text-xl font-bold tracking-tight">
          Selaras
        </Link>
        {children}
      </div>
    </div>
  );
}
