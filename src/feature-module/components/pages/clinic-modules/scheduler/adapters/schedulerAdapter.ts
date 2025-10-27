/**
 * Scheduler Adapter Layer
 * 
 * Bridges the gap between the scheduler's simplified data model
 * and the backend's comprehensive appointment schema.
 * 
 * Key Mappings:
 * - date + hour ↔ startsAt/endsAt (ISODateTime)
 * - patientId ↔ planId (requires lookup)
 * - kind (STANDARD/EXTRA_CARE) ↔ sessionType (REGULAR/ELDER/etc)
 * - extraCare ↔ priority (HIGH/MEDIUM/LOW)
 */

import type {
  Appointment as BackendAppointment,
  InsertAppointment,
  SessionTypeT,
  LocationT,
  ApptStatusT,
  PriorityT,
} from "@/types/typedefs";
import type {
  Appointment,
  AppointmentKind,
  CreateAppointmentPayload,
  OverbookItem,
  Therapist,
} from "../types";

// ============================================================================
// DATE/TIME CONVERSIONS
// ============================================================================

/**
 * Convert date (YYYY-MM-DD) + hour (9-17) to ISO DateTime
 * @param date ISO date string (YYYY-MM-DD)
 * @param hour Hour of day (9-17)
 * @returns ISO DateTime string for start and end times
 */
export function dateHourToDateTime(
  date: string,
  hour: number
): { startsAt: string; endsAt: string } {
  // Create datetime in local timezone, then convert to ISO
  const startDate = new Date(`${date}T${hour.toString().padStart(2, "0")}:00:00`);
  const endDate = new Date(`${date}T${(hour + 1).toString().padStart(2, "0")}:00:00`);

  return {
    startsAt: startDate.toISOString(),
    endsAt: endDate.toISOString(),
  };
}

/**
 * Extract date and hour from ISO DateTime
 * @param datetime ISO DateTime string
 * @returns Object with date (YYYY-MM-DD) and hour (9-17)
 */
export function dateTimeToDateHour(datetime: string): {
  date: string;
  hour: number;
} {
  const dt = new Date(datetime);
  return {
    date: dt.toISOString().slice(0, 10),
    hour: dt.getHours(),
  };
}

// ============================================================================
// APPOINTMENT KIND ↔ SESSION TYPE MAPPINGS
// ============================================================================

/**
 * Map scheduler's simplified "kind" to backend's detailed sessionType
 * 
 * Logic:
 * - EXTRA_CARE → ELDER (requires extra time/attention)
 * - STANDARD → REGULAR (default type)
 */
export function kindToSessionType(kind: AppointmentKind): SessionTypeT {
  switch (kind) {
    case "EXTRA_CARE":
      return "ELDER";
    case "STANDARD":
    default:
      return "REGULAR";
  }
}

/**
 * Map backend's sessionType to scheduler's simplified kind
 * 
 * Logic:
 * - ELDER → EXTRA_CARE
 * - All others → STANDARD
 */
export function sessionTypeToKind(sessionType: SessionTypeT): AppointmentKind {
  return sessionType === "ELDER" ? "EXTRA_CARE" : "STANDARD";
}

// ============================================================================
// EXTRA CARE ↔ PRIORITY MAPPINGS (for overbooking queue)
// ============================================================================

/**
 * Map scheduler's extraCare flag to backend's priority enum
 * 
 * Logic:
 * - extraCare=true → HIGH priority
 * - extraCare=false → MEDIUM priority
 */
export function extraCareToPriority(extraCare: boolean): PriorityT {
  return extraCare ? "HIGH" : "MEDIUM";
}

/**
 * Map backend's priority to scheduler's extraCare flag
 * 
 * Logic:
 * - HIGH priority → extraCare=true
 * - MEDIUM/LOW priority → extraCare=false
 */
export function priorityToExtraCare(priority: PriorityT): boolean {
  return priority === "HIGH";
}

// ============================================================================
// APPOINTMENT CONVERSIONS
// ============================================================================

/**
 * Convert backend Appointment to scheduler Appointment
 */
export function toSchedulerAppointment(
  backendAppt: BackendAppointment & {
    plan?: { patientId: string; patient?: { id: string } };
  }
): Appointment {
  const { date, hour } = dateTimeToDateHour(backendAppt.startsAt);

  // Extract patientId from plan relation
  const patientId = backendAppt.plan?.patientId || backendAppt.plan?.patient?.id || "";

  return {
    id: backendAppt.id,
    date,
    hour,
    therapistId: backendAppt.therapistId,
    patientId,
    kind: sessionTypeToKind(backendAppt.sessionType),
    preferredTherapistId: null, // TODO: Extract from metadata when implemented
    status: backendAppt.status as Appointment["status"],
    note: backendAppt.noteEn || undefined,
  };
}

/**
 * Convert scheduler CreateAppointmentPayload to backend InsertAppointment
 * Requires planId lookup externally (see getActivePlanForPatient)
 */
export function toBackendAppointment(
  payload: CreateAppointmentPayload,
  planId: string
): InsertAppointment {
  const { startsAt, endsAt } = dateHourToDateTime(payload.date, payload.hour);

  return {
    planId,
    therapistId: payload.therapistId,
    startsAt,
    endsAt,
    sessionType: kindToSessionType(payload.kind),
    location: "CLINIC" as LocationT,
    status: "BOOKED" as ApptStatusT,
    noteEn: payload.note || null,
    noteAr: null,
    cancelReason: null,
  };
}

// ============================================================================
// OVERBOOKING QUEUE CONVERSIONS
// ============================================================================

/**
 * Convert backend OverbookingQueue item to scheduler OverbookItem
 */
export function toSchedulerOverbookItem(backendItem: {
  id: string;
  patientId: string;
  priority: PriorityT;
  addedAt: string;
  patient?: {
    id: string;
    fullName: string;
    phone: string;
    extraCare: boolean;
  };
}): OverbookItem {
  return {
    id: backendItem.id,
    patientId: backendItem.patientId,
    reason: undefined, // Backend doesn't store reason yet
    extraCare: priorityToExtraCare(backendItem.priority),
    preferredTherapistId: null, // Backend doesn't store this yet
    createdAt: backendItem.addedAt,
  };
}

/**
 * Convert scheduler OverbookItem creation payload to backend format
 */
export function toBackendOverbookItem(
  payload: {
    patientId: string;
    reason?: string;
    extraCare: boolean;
    preferredTherapistId?: string | null;
  },
  addedBy: string
): {
  patientId: string;
  priority: PriorityT;
  isActive: boolean;
  addedBy: string;
} {
  return {
    patientId: payload.patientId,
    priority: extraCareToPriority(payload.extraCare),
    isActive: true,
    addedBy,
  };
}

/**
 * Convert priority-based overbook payload to backend format
 * Used when priority is directly specified (not derived from extraCare)
 */
export function toBackendOverbookItemWithPriority(
  payload: {
    patientId: string;
    priority: PriorityT;
    reason?: string;
  },
  addedBy: string
): {
  patientId: string;
  priority: PriorityT;
  isActive: boolean;
  addedBy: string;
} {
  return {
    patientId: payload.patientId,
    priority: payload.priority,
    isActive: true,
    addedBy,
  };
}

// ============================================================================
// THERAPIST CONVERSIONS
// ============================================================================

/**
 * Convert backend AppUser (therapist) to scheduler Therapist
 */
export function toSchedulerTherapist(backendUser: {
  id: string;
  username: string;
  email: string;
  role: string;
}): Therapist {
  return {
    id: backendUser.id,
    name: backendUser.username,
    specialization: undefined, // Backend doesn't store specialization in app_user
  };
}

// ============================================================================
// QUERY PARAMETER CONVERSIONS
// ============================================================================

/**
 * Convert scheduler date filter to backend datetime range
 */
export function dateToDateTimeRange(date: string): {
  from: string;
  to: string;
} {
  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59`);

  return {
    from: startOfDay.toISOString(),
    to: endOfDay.toISOString(),
  };
}

