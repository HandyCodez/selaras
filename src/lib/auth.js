import { cache } from "react";
import { redirect } from "next/navigation";
import { readSessionCookie } from "@/lib/session";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

// Server-only data-access layer. Proxy only checks "is logged in" — this is
// where real role authorization happens, in every page and action.
export const getSession = cache(async function getSession() {
  const payload = await readSessionCookie();
  if (!payload) return null;
  return {
    userId: payload.sub,
    role: payload.role,
    jabatan: payload.jabatan,
    cabangId: payload.cabangId,
  };
});

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  await connectDB();
  return User.findById(session.userId).lean();
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(...roles) {
  const session = await requireAuth();
  if (!roles.includes(session.role)) {
    redirect("/dashboard");
  }
  return session;
}
