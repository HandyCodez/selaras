"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export function DashboardShell({ role, jabatan, nama, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopbar
        nama={nama}
        role={role}
        onMenuClick={() => setSidebarOpen((v) => !v)}
      />
      <div className="relative flex flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <DashboardSidebar
          role={role}
          jabatan={jabatan}
          open={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
