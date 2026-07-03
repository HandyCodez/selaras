// A pendonor can register with just telepon + password. Golongan darah is
// deliberately excluded here — only petugas set it, during the medical
// interview — so it's never part of "profile completeness".
export function isPendonorProfileComplete(user) {
  return Boolean(
    user?.nama &&
      user?.pendonor?.nik &&
      user?.pendonor?.tanggalLahir &&
      user?.pendonor?.jenisKelamin &&
      user?.pendonor?.alamat,
  );
}

// PMI requires a minimum gap between whole-blood donations (~12 weeks) for
// donor safety. Only counts against a donation that actually completed
// (status: "selesai") — a rejected interview or a no-show doesn't restart
// the clock.
export const MINIMAL_JARAK_DONOR_HARI = 84;

export function tanggalBolehDonorLagi(selesaiAt) {
  if (!selesaiAt) return null;
  const next = new Date(selesaiAt);
  next.setDate(next.getDate() + MINIMAL_JARAK_DONOR_HARI);
  return next;
}
