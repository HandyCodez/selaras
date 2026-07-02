import { donorQrDataUrl } from "@/lib/qr";

export async function DonorQrDisplay({ userId }) {
  const dataUrl = await donorQrDataUrl(userId);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt="QR Code Pendonor"
      width={240}
      height={240}
      className="mx-auto rounded-lg border p-2"
    />
  );
}
