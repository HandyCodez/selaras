import { requireAuth, requireCurrentUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({ children }) {
  const session = await requireAuth();
  const user = await requireCurrentUser();

  return (
    <DashboardShell role={session.role} nama={user.nama || user.telepon}>
      {children}
    </DashboardShell>
  );
}
