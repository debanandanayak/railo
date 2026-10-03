export function minutesToTime(minutes: string) {
  const hours = Math.floor(Number(minutes) / 60);
  const mins = Number(minutes) % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function toSentenseCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
