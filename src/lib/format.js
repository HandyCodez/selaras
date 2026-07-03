export function formatRentangWaktu(mulai, selesai) {
  const start = new Date(mulai);
  const end = new Date(selesai);
  const sameDay = start.toDateString() === end.toDateString();

  const startDate = start.toLocaleDateString("id-ID", { dateStyle: "medium" });
  const startTime = start.toLocaleTimeString("id-ID", { timeStyle: "short" });
  const endTime = end.toLocaleTimeString("id-ID", { timeStyle: "short" });

  if (sameDay) {
    return `${startDate}, ${startTime} - ${endTime}`;
  }

  const endDate = end.toLocaleDateString("id-ID", { dateStyle: "medium" });
  return `${startDate} ${startTime} - ${endDate} ${endTime}`;
}
