import { requireAuth, getCurrentUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({ children }) {
  const session = await requireAuth();
  const user = await getCurrentUser();

  return (
    <DashboardShell role={session.role} jabatan={session.jabatan} nama={user?.nama}>
      {children}
    </DashboardShell>
  );
}
