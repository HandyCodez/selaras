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
  redirect(ROLE_HOME[session?.role] || "/login");
}
