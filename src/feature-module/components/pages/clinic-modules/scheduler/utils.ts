// Scheduler Utilities

export const HOUR_START = 9;
export const HOUR_END = 17;

export function hourLabel(h: number): string {
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:00 ${ampm}`;
}

export function hourRange(): number[] {
  return Array.from({ length: HOUR_END - HOUR_START }, (_, k) => HOUR_START + k);
}

export function getCellCapacity(appointments: any[]): number {
  // Base capacity = 2. If any is extra-care, capacity becomes 1
  if (!appointments || appointments.length === 0) return 2;
  const anyExtra = appointments.some((a) => a.kind === "EXTRA_CARE");
  return anyExtra ? 1 : 2;
}

export function getCellState(appointments: any[]): "available" | "partial" | "full" | "extracare" {
  const cap = getCellCapacity(appointments);
  const count = appointments ? appointments.length : 0;
  if (count === 0) return "available";
  if (count < cap) return "partial";
  if (appointments.some((a) => a.kind === "EXTRA_CARE")) return "extracare";
  return "full";
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getTodayDate(): string {
  return formatDate(new Date());
}



