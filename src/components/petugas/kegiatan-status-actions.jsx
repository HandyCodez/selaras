import { setKegiatanStatus } from "@/actions/kegiatan.actions";
import { Button } from "@/components/ui/button";

export function KegiatanStatusActions({ kegiatanId, status }) {
  if (status !== "aktif") return null;

  return (
    <>
      <form action={setKegiatanStatus.bind(null, kegiatanId, "selesai")}>
        <Button variant="ghost" size="sm" type="submit">
          Selesaikan
        </Button>
      </form>
      <form action={setKegiatanStatus.bind(null, kegiatanId, "dibatalkan")}>
        <Button variant="ghost" size="sm" type="submit">
          Batalkan
        </Button>
      </form>
    </>
  );
}
