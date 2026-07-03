import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const ROLE_HOME = {
  pendonor: "/dashboard/pendonor",
  petugas: "/dashboard/petugas",
  rumah_sakit: "/dashboard/rumah-sakit",
  admin: "/dashboard/admin",
};

export default async function DashboardIndexPage() {
  const session = await getSession();
  const home = ROLE_HOME[session?.role];

  if (home) {
    redirect(home);
  }

  if (!session) {
    redirect("/login");
  }

  // Session cookie is valid but its role doesn't match a known dashboard —
  // redirecting to /login here would bounce right back to /dashboard (the
  // (auth) layout redirects any truthy session away from /login), causing
  // an infinite loop. Throw instead so dashboard/error.js can clear the
  // cookie properly (Server Components can't mutate cookies mid-redirect).
  throw new Error("Sesi tidak valid.");
}
