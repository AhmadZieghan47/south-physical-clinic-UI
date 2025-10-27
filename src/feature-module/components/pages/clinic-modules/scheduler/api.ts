// Scheduler API Client - Integrated with Backend APIs
import { createModuleApi } from "@/lib/enhancedApi";
import type {
  Appointment,
  Therapist,
  OverbookItem,
  CreateAppointmentPayload,
  CreateOverbookPayload,
  AutoAssignResponse,
} from "./types";
import type { BigIntStr } from "@/types/typedefs";
import {
  toSchedulerAppointment,
  toBackendAppointment,
  toSchedulerTherapist,
  toSchedulerOverbookItem,
  toBackendOverbookItem,
  dateToDateTimeRange,
} from "./adapters/schedulerAdapter";
import { getCachedActivePlanForPatient } from "./adapters/patientPlanHelper";

const schedulerApi = createModuleApi("SchedulerModule", {
  context: { component: "SchedulerAPI" },
  retryable: true,
  maxRetries: 2,
});

export const SchedulerAPI = {
  // Therapists
  listTherapists: async (): Promise<Therapist[]> => {
    const response = await schedulerApi.get<{
      data: Array<{
        id: BigIntStr;
        username: string;
        email: string;
        role: string;
      }>;
      total: number;
      page: number;
      pageSize: number;
    }>("/app-users", {
      params: { role: "THERAPIST", pageSize: 100 },
      context: { action: "list_therapists" },
    });

    // Backend returns paginated response with data property
    const users = response.data.data || [];
    return users.map(toSchedulerTherapist);
  },

  // Appointments
  listAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    const { from, to } = dateToDateTimeRange(date);

    const response = await schedulerApi.get<{
      data: Array<any>;
      total: number;
      page: number;
      pageSize: number;
    }>("/appointments", {
      params: { from, to, pageSize: 100 },
      context: { action: "list_appointments_by_date", additionalData: { date } },
    });

    // Backend returns paginated response with data property
    const appointments = response.data.data || [];
    return appointments.map(toSchedulerAppointment);
  },

  createAppointment: async (
    payload: CreateAppointmentPayload
  ): Promise<Appointment> => {
    // Step 1: Lookup active plan for patient
    const planId = await getCachedActivePlanForPatient(payload.patientId);

    // Step 2: Convert to backend format
    const backendPayload = toBackendAppointment(payload, planId);

    // Step 3: Create appointment
    const response = await schedulerApi.post<any>("/appointments", backendPayload, {
      context: {
        action: "create_appointment",
        additionalData: { payload },
      },
    });

    return toSchedulerAppointment(response.data);
  },

  updateAppointment: async (
    id: string,
    patch: Partial<Appointment>
  ): Promise<Appointment> => {
    // TODO: Implement update with adapter
    const response = await schedulerApi.patch<any>(
      `/appointments/${id}`,
      patch,
      {
        context: {
          action: "update_appointment",
          additionalData: { appointmentId: id, patch },
        },
      }
    );
    return toSchedulerAppointment(response.data);
  },

  deleteAppointment: async (id: string): Promise<void> => {
    // Use cancel endpoint instead of delete
    await schedulerApi.patch(
      `/appointments/${id}/cancel`,
      { cancelReason: "CREATED_IN_ERROR" },
      {
        context: {
          action: "cancel_appointment",
          additionalData: { appointmentId: id },
        },
      }
    );
  },

  // Overbooking Queue
  listOverbook: async (): Promise<OverbookItem[]> => {
    const response = await schedulerApi.get<
      Array<{
        id: BigIntStr;
        patientId: BigIntStr;
        priority: "HIGH" | "MEDIUM" | "LOW";
        addedAt: string;
      }>
    >("/overbooking-queue", {
      params: { isActive: true, pageSize: 50 },
      context: { action: "list_overbook" },
    });

    // Backend returns array directly, not wrapped in data property
    const items = Array.isArray(response.data) ? response.data : [];
    return items.map(toSchedulerOverbookItem);
  },

  addOverbook: async (payload: CreateOverbookPayload): Promise<OverbookItem> => {
    // TODO: Get current user ID from auth context
    const currentUserId = "1"; // Placeholder - should come from auth context

    const backendPayload = toBackendOverbookItem(payload, currentUserId);

    const response = await schedulerApi.post<any>(
      "/overbooking-queue",
      backendPayload,
      {
        context: {
          action: "add_overbook",
          additionalData: { payload },
        },
      }
    );

    return toSchedulerOverbookItem(response.data);
  },

  removeOverbook: async (id: string): Promise<void> => {
    await schedulerApi.delete(`/overbooking-queue/${id}`, {
      context: {
        action: "remove_overbook",
        additionalData: { itemId: id },
      },
    });
  },

  // Auto-assign (NOT YET IMPLEMENTED ON BACKEND)
  autoAssign: async (_date: string): Promise<AutoAssignResponse> => {
    // TODO: This endpoint doesn't exist yet on backend
    // For now, throw a friendly error
    throw new Error(
      "Auto-assign feature is not yet implemented on the backend. Please use manual placement for now."
    );

    // When backend is ready, use this:
    // const response = await schedulerApi.post<AutoAssignResponse>(
    //   "/appointments/auto-assign",
    //   null,
    //   {
    //     params: { date },
    //     context: {
    //       action: "auto_assign",
    //       additionalData: { date },
    //     },
    //   }
    // );
    // return response.data;
  },
};



