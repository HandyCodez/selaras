export function roleHome(role) {
  if (role === "petugas") return "/dashboard/petugas";
  if (role === "rumah_sakit") return "/dashboard/rumah-sakit";
  if (role === "admin") return "/dashboard/admin";
  if (role === "pendonor") return "/dashboard/pendonor";
  return "/";
}
