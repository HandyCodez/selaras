import { requireRole } from "@/lib/auth";

export default async function PetugasLayout({ children }) {
  await requireRole("petugas");
  return children;
}
