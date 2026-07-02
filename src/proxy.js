import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

export const config = {
  matcher: ["/dashboard/:path*"],
};

// Optimistic check only: is there a valid session cookie at all?
// Role-specific authorization happens in each dashboard/(role)/layout.js
// and again inside every Server Action — proxy cannot tell route groups
// apart since they don't appear in the URL.
export async function proxy(request) {
  const token = request.cookies.get("selaras_session")?.value;
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
