// Prefer whichever kegiatan is currently within its active date window;
// otherwise fall back to the one closest to now. Avoids silently defaulting
// to a stale, long-past "aktif" kegiatan when a cabang has several active
// kegiatan at once (which caused checkin/wawancara scans to fail with
// "belum mendaftar" for donors registered to a different, more recent one).
export function pilihKegiatanDefault(kegiatanList) {
  if (!kegiatanList || kegiatanList.length === 0) return null;
  const now = Date.now();

  const sedangBerlangsung = kegiatanList.find((k) => {
    const mulai = new Date(k.tanggalMulai).getTime();
    const selesai = new Date(k.tanggalSelesai).getTime();
    return mulai <= now && now <= selesai;
  });
  if (sedangBerlangsung) return sedangBerlangsung;

  return kegiatanList.reduce((closest, k) => {
    const diff = Math.abs(new Date(k.tanggalMulai).getTime() - now);
    const closestDiff = Math.abs(new Date(closest.tanggalMulai).getTime() - now);
    return diff < closestDiff ? k : closest;
  }, kegiatanList[0]);
}
