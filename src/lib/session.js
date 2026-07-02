import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SESSION_COOKIE = "selaras_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set in the environment");
  }
  return secret;
}

export function signSession(payload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

export function verifySessionToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

export async function createSessionCookie(user) {
  const token = signSession({
    sub: user._id.toString(),
    role: user.role,
    jabatan: user.petugas?.jabatan,
    cabangId:
      user.petugas?.cabangId?.toString() ||
      user.rumahSakit?.defaultCabangId?.toString(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readSessionCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { SESSION_COOKIE };
