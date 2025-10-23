import { createModuleApi } from "../../../../../lib/enhancedApi";
import type {
  CreateAppointmentRequest,
  AppointmentWithRelations,
} from "../../../../../api/enhancedAppointments";
import type { AppointmentFormData } from "./schema";

// Create API client for appointment operations
const appointmentApi = createModuleApi("AppointmentModule", {
  context: { component: "NewAppointmentAPI" },
  retryable: true,
  maxRetries: 2,
});

// Convert form data to API request format
export function convertFormDataToApiRequest(
  formData: AppointmentFormData
): CreateAppointmentRequest {
  // Auto-calculate end time if not provided (start time + 1 hour)
  let endTime = formData.endTime;
  if (!endTime && formData.startTime) {
    const startDate = new Date(`2000-01-01T${formData.startTime}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    endTime = endDate.toTimeString().slice(0, 5); // Format as HH:mm
  }

  // Combine date and time to create ISO datetime strings
  const startsAt = `${formData.appointmentDate}T${formData.startTime}:00.000Z`;
  const endsAt = `${formData.appointmentDate}T${endTime}:00.000Z`;

  return {
    planId: formData.planId,
    therapistId: formData.therapistId,
    startsAt,
    endsAt,
    sessionType: formData.sessionType,
    location: formData.location,
    status: formData.status || "BOOKED",
    noteEn: formData.noteEn || null,
    noteAr: formData.noteAr || null,
  };
}

// Create appointment API call
export async function createAppointment(
  formData: AppointmentFormData
): Promise<AppointmentWithRelations> {
  const appointmentData = convertFormDataToApiRequest(formData);

  const response = await appointmentApi.post<AppointmentWithRelations>(
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

// Get patients for selection (you might want to use the existing patients API)
export async function getPatientsForSelection() {
  const response = await appointmentApi.get("/patients", {
    params: {
      pageSize: 100, // Get more patients for selection
      isActive: true, // Only show active patients for appointment creation
    },
    context: {
      action: "get_patients_for_selection",
    },
  });

  return response.data;
}

// Get treatment plans for a specific patient
export async function getTreatmentPlansForPatient(patientId: string) {
  const response = await appointmentApi.get("/plans", {
    params: {
      patientId,
      pageSize: 100,
      status: "ONGOING", // Only fetch ongoing plans for appointment creation
    },
    context: {
      action: "get_treatment_plans_for_patient",
      additionalData: { patientId },
    },
  });

  return response.data;
}

// Get therapists for selection
export async function getTherapistsForSelection() {
  const response = await appointmentApi.get("/app-users", {
    params: { role: "THERAPIST", pageSize: 100 },
    context: {
      action: "get_therapists_for_selection",
    },
  });

  return response.data;
}
