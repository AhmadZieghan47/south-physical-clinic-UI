// Enhanced Appointments API with Integrated Error Handling
// This file provides enhanced API functions for appointment operations with proper error handling

import { createModuleApi } from "../lib/enhancedApi";
import type {
  Appointment,
  InsertAppointment,
  UpdateAppointment,
  SessionTypeT,
  LocationT,
  ApptStatusT,
  CancelReasonT,
  BigIntStr,
} from "../types/typedefs";

// Create a specialized API client for appointments module
const appointmentsApi = createModuleApi("AppointmentsModule", {
  context: { component: "AppointmentsAPI" },
  retryable: true,
  maxRetries: 2,
});

// ============================================================================
// APPOINTMENT TYPES (matching backend)
// ============================================================================

export interface AppointmentWithRelations extends Appointment {
  plan?: {
    id: BigIntStr;
    patientId: BigIntStr;
    patient?: {
      id: BigIntStr;
      fullName: string;
      phone: string;
    };
  };
  therapist?: {
    id: BigIntStr;
    username: string;
    email: string;
  };
}

export interface CreateAppointmentRequest extends InsertAppointment {}

export interface UpdateAppointmentRequest extends UpdateAppointment {
  id: BigIntStr;
}

export interface GetAppointmentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  planId?: BigIntStr;
  therapistId?: BigIntStr;
  status?: ApptStatusT;
  sessionType?: SessionTypeT;
  location?: LocationT;
  from?: string; // ISO date string
  to?: string; // ISO date string
  sortBy?: "createdAt" | "startsAt";
  sortOrder?: "ASC" | "DESC";
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

export interface GetAppointmentsResponse {
  data: AppointmentWithRelations[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAppointments(
  params: GetAppointmentsParams = {}
): Promise<GetAppointmentsResponse> {
  const query: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query[key] = value;
    }
  });

  const response = await appointmentsApi.get<{
    data: AppointmentWithRelations[];
    total: number;
    page: number;
    pageSize: number;
  }>("/appointments", {
    params: query,
    context: { action: "get_appointments", additionalData: { params } },
  });

  return {
    data: response.data.data,
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.pageSize,
  };
}

export async function getAppointmentById(
  id: BigIntStr
): Promise<AppointmentWithRelations> {
  const response = await appointmentsApi.get<AppointmentWithRelations>(
    `/appointments/${id}`,
    {
      context: {
        action: "get_appointment_by_id",
        additionalData: { appointmentId: id },
      },
    }
  );
  return response.data;
}

export interface AppointmentDetails {
  appointment: AppointmentWithRelations;
  patient: {
    id: BigIntStr;
    fullName: string;
    phone: string;
    balance: string;
  };
  therapist: {
    id: BigIntStr;
    username: string;
    email: string;
  };
  plan: {
    id: BigIntStr;
    patientId: BigIntStr;
    remainingSessions: number;
    totalSessions: number | null;
    planType: string;
  };
  sessionNote?: {
    appointmentId: BigIntStr;
    summaryTextEn: string | null;
    summaryTextAr: string | null;
    preferredNext: string | null;
    recommendationsEn: string | null;
    recommendationsAr: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export async function getAppointmentDetails(
  id: BigIntStr
): Promise<AppointmentDetails> {
  const response = await appointmentsApi.get<AppointmentDetails>(
    `/appointments/${id}/details`,
    {
      context: {
        action: "get_appointment_details",
        additionalData: { appointmentId: id },
      },
    }
  );
  return response.data;
}

export async function createAppointment(
  appointmentData: CreateAppointmentRequest
): Promise<AppointmentWithRelations> {
  const response = await appointmentsApi.post<AppointmentWithRelations>(
    "/appointments",
    appointmentData,
    {
      context: {
        action: "create_appointment",
        additionalData: { appointmentData },
      },
    }
  );
  return response.data;
}

export async function updateAppointment(
  appointmentData: UpdateAppointmentRequest
): Promise<AppointmentWithRelations> {
  const { id, ...data } = appointmentData;
  const response = await appointmentsApi.patch<AppointmentWithRelations>(
    `/appointments/${id}`,
    data,
    {
      context: {
        action: "update_appointment",
        additionalData: { appointmentId: id, appointmentData: data },
      },
    }
  );
  return response.data;
}

export async function cancelAppointment(
  id: BigIntStr,
  cancelReason: CancelReasonT
): Promise<AppointmentWithRelations> {
  const response = await appointmentsApi.patch<AppointmentWithRelations>(
    `/appointments/${id}/cancel`,
    { cancelReason },
    {
      context: {
        action: "cancel_appointment",
        additionalData: { appointmentId: id, cancelReason },
      },
    }
  );
  return response.data;
}

export interface CompleteAppointmentRequest {
  sessionNote?: {
    summaryTextEn?: string | null;
    summaryTextAr?: string | null;
    preferredNext?: "2D" | "3D" | "4D" | "5D" | "1W" | "2W" | null;
    recommendationsEn?: string | null;
    recommendationsAr?: string | null;
  };
}

export async function completeAppointment(
  id: BigIntStr,
  data: CompleteAppointmentRequest
): Promise<AppointmentWithRelations> {
  const response = await appointmentsApi.patch<AppointmentWithRelations>(
    `/appointments/${id}/complete`,
    data,
    {
      context: {
        action: "complete_appointment",
        additionalData: {
          appointmentId: id,
          hasSessionNote: !!data.sessionNote,
        },
      },
    }
  );
  return response.data;
}

// ============================================================================
// SPECIALIZED OPERATIONS
// ============================================================================

export async function getAppointmentsByDate(
  date: string
): Promise<AppointmentWithRelations[]> {
  const response = await appointmentsApi.get<AppointmentWithRelations[]>(
    "/appointments/by-date",
    {
      params: { date },
      context: { action: "get_appointments_by_date", additionalData: { date } },
    }
  );
  return response.data;
}

export async function getAppointmentsByTherapist(
  therapistId: BigIntStr,
  date?: string
): Promise<AppointmentWithRelations[]> {
  const params: Record<string, any> = { therapistId };
  if (date) params.date = date;

  const response = await appointmentsApi.get<AppointmentWithRelations[]>(
    "/appointments/by-therapist",
    {
      params,
      context: {
        action: "get_appointments_by_therapist",
        additionalData: { therapistId, date },
      },
    }
  );
  return response.data;
}

export async function getAppointmentsByPlan(
  planId: BigIntStr
): Promise<AppointmentWithRelations[]> {
  const response = await appointmentsApi.get<AppointmentWithRelations[]>(
    `/plans/${planId}/appointments`,
    {
      context: {
        action: "get_appointments_by_plan",
        additionalData: { planId },
      },
    }
  );
  return response.data;
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export function isAppointmentNotFoundError(error: any): boolean {
  return (
    error?.error?.code === "NOT_FOUND_ERROR" &&
    error?.error?.message?.includes("appointment")
  );
}

export function isAppointmentConflictError(error: any): boolean {
  return (
    error?.error?.code === "CONFLICT_ERROR" &&
    error?.error?.message?.includes("appointment")
  );
}

export function isAppointmentValidationError(error: any): boolean {
  return (
    error?.error?.code === "ZOD_VALIDATION_ERROR" &&
    error?.error?.details?.validationErrors?.some(
      (err: any) =>
        err.field?.includes("startsAt") ||
        err.field?.includes("endsAt") ||
        err.field?.includes("sessionType") ||
        err.field?.includes("location")
    )
  );
}

export function isAppointmentBusinessLogicError(error: any): boolean {
  return (
    error?.error?.code === "BUSINESS_LOGIC_ERROR" &&
    error?.error?.message?.includes("appointment")
  );
}
