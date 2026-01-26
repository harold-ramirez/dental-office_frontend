export function FormatDuration(minutesDuration: number): string {
  const totalMinutes = minutesDuration;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours} ${hours === 1 ? "hora" : "horas"} ${minutes} min`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  } else {
    return `${minutes} min`;
  }
}
