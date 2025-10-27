// Scheduler Types - aligned with backend contracts
import type { BigIntStr } from "@/types/typedefs";

export type AppointmentKind = "STANDARD" | "EXTRA_CARE";

export interface Therapist {
  id: BigIntStr;
  name: string;
  specialization?: string;
}

export interface Patient {
  id: BigIntStr;
  name: string;
  flags?: {
    extraCare?: boolean;
  };
}

export interface Appointment {
  id: BigIntStr;
  date: string; // ISO date (yyyy-mm-dd)
  hour: number; // 9..17
  therapistId: BigIntStr;
  patientId: BigIntStr;
  kind: AppointmentKind;
  preferredTherapistId?: BigIntStr | null;
  status: "BOOKED" | "CANCELLED" | "NO_SHOW" | "COMPLETED";
  note?: string;
}

export interface OverbookItem {
  id: BigIntStr;
  patientId: BigIntStr;
  reason?: string;
  extraCare: boolean;
  preferredTherapistId?: BigIntStr | null;
  createdAt: string;
}

export interface CellState {
  state: "available" | "partial" | "full" | "extracare";
  appointments: Appointment[];
  capacity: number;
}

export interface CreateAppointmentPayload {
  date: string;
  hour: number;
  therapistId: BigIntStr;
  patientId: BigIntStr;
  kind: AppointmentKind;
  preferredTherapistId?: BigIntStr | null;
  note?: string;
}

export interface CreateOverbookPayload {
  patientId: BigIntStr;
  reason?: string;
  extraCare: boolean;
  preferredTherapistId?: BigIntStr | null;
}

export interface AutoAssignResponse {
  placed: Appointment[];
  unplaced: OverbookItem[];
}



