export type PaymentMethod = "CASH" | "CARD" | "INSURANCE" | string;

export function generatePaymentDescription(payment: {
  planId?: string | null;
  appointmentId?: string | null;
}): string {
  if (payment.planId) return "Treatment Plan Payment";
  if (payment.appointmentId) return "Appointment Payment";
  return "General Payment";
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case "CASH":
      return "Cash";
    case "CARD":
      return "Card";
    case "INSURANCE":
      return "Insurance";
    default:
      return String(method);
  }
}

export function getFileTypeLabel(mimeType: string): string {
  const mt = mimeType.toLowerCase();
  if (mt.includes("pdf")) return "PDF Document";
  if (mt.includes("image/jpeg") || mt.includes("image/jpg"))
    return "JPEG Image";
  if (mt.includes("image/png")) return "PNG Image";
  if (mt.includes("image/gif")) return "GIF Image";
  if (mt.includes("image/svg")) return "SVG Image";
  if (mt.includes("word")) return "Word Document";
  if (mt.includes("excel")) return "Excel Spreadsheet";
  if (mt.includes("powerpoint")) return "PowerPoint Presentation";
  if (mt.includes("text")) return "Text Document";
  if (mt.includes("zip")) return "ZIP Archive";
  if (mt.includes("rar")) return "RAR Archive";
  return mimeType;
}

export function formatFileSize(sizeBytes: number): string {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"] as const;
  const i = Math.min(
    Math.floor(Math.log(sizeBytes) / Math.log(k)),
    sizes.length - 1
  );
  return `${parseFloat((sizeBytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getSessionTypeLabel(sessionType: string): string {
  switch (sessionType) {
    case "REGULAR":
      return "Regular Session";
    case "SHOCK_WAVE":
      return "Shock Wave Therapy";
    case "INDIBA":
      return "INDIBA Therapy";
    case "HOME":
      return "Home Session";
    case "HOJAMA":
      return "Hijama Therapy";
    case "ELDER":
      return "Elder Care";
    case "HOSPITAL":
      return "Hospital Session";
    default:
      return sessionType;
  }
}

export function getLocationLabel(location: string): string {
  switch (location) {
    case "CLINIC":
      return "In-person";
    case "HOME":
      return "Home Visit";
    case "HOSPITAL":
      return "Hospital";
    default:
      return location;
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "BOOKED":
      return "Scheduled";
    case "CHECKED_IN":
      return "Checked In";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}
