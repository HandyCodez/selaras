import { requireAuth, getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default async function DashboardLayout({ children }) {
  const session = await requireAuth();
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopbar nama={user?.nama} role={session.role} />
      <div className="flex flex-1">
        <DashboardSidebar role={session.role} jabatan={session.jabatan} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
