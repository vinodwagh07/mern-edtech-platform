export function convertSecondsToDuration(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "0s";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}hr`);
  if (minutes > 0) parts.push(`${minutes}mins`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}sec`);

  return parts.join(" ");
}
