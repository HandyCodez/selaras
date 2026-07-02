import { requireRole } from "@/lib/auth";

export default async function PendonorLayout({ children }) {
  await requireRole("pendonor");
  return children;
}
