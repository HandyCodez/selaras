"use client";

import { useEffect } from "react";
import { logout } from "@/actions/auth.actions";

// Generic safety net for the dashboard section: if a page crashes because
// data tied to the session (user, or a linked rumah sakit/cabang record) is
// missing, log the user out and send them back to login rather than showing
// a broken page. Most known cases already redirect proactively (see
// requireCurrentUser in lib/auth.js) — this catches whatever that misses.
export default function DashboardError() {
  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="text-lg font-medium">Sesi Anda bermasalah</p>
      <p className="text-sm text-muted-foreground">
        Mengalihkan ke halaman login...
      </p>
    </div>
  );
}
