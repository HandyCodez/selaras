// Simplification for MVP: all PMI cabang are treated as WIB (UTC+7).
// Indonesia has 3 timezones (WIB/WITA/WIT); revisit if cabang outside WIB are onboarded.
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

// Returns the [start, end) UTC instants covering "today" in WIB.
export function todayRangeWIB(now = new Date()) {
  const wibNow = new Date(now.getTime() + WIB_OFFSET_MS);
  const startWIB = Date.UTC(
    wibNow.getUTCFullYear(),
    wibNow.getUTCMonth(),
    wibNow.getUTCDate(),
  );
  const start = new Date(startWIB - WIB_OFFSET_MS);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}
