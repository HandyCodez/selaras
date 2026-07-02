import { requireRole } from "@/lib/auth";

export default async function RumahSakitLayout({ children }) {
  await requireRole("rumah_sakit");
  return children;
}
