import crypto from "crypto";
import QRCode from "qrcode";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set in the environment");
  }
  return secret;
}

function sign(userId) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(userId)
    .digest("hex");
}

export function buildDonorQrPayload(userId) {
  return JSON.stringify({ uid: userId, sig: sign(userId) });
}

export function verifyDonorQrPayload(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const { uid, sig } = parsed || {};
  if (!uid || !sig) return null;

  const expected = sign(uid);
  const expectedBuf = Buffer.from(expected, "hex");
  const sigBuf = Buffer.from(sig, "hex");
  if (expectedBuf.length !== sigBuf.length) return null;
  if (!crypto.timingSafeEqual(expectedBuf, sigBuf)) return null;

  return uid;
}

export async function donorQrDataUrl(userId) {
  const payload = buildDonorQrPayload(userId);
  return QRCode.toDataURL(payload, { margin: 1, width: 240 });
}
