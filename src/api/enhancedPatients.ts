// Enhanced Patients API with Integrated Error Handling
// This file provides enhanced API functions for patient operations with proper error handling

import { createModuleApi } from "../lib/enhancedApi";
import type { Patient } from "../types/typedefs";
import type { GetPatientsParams } from "../types/patient";

// Create a specialized API client for patients module
const patientsApi = createModuleApi("PatientsModule", {
  context: { component: "PatientsAPI" },
  retryable: true,
  maxRetries: 2,
});

// ============================================================================
// PATIENT API FUNCTIONS
// ============================================================================

export interface GetPatientsResponse {
  data: Patient[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreatePatientRequest {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: string;
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

export async function getPatients(
  params: GetPatientsParams = {}
): Promise<GetPatientsResponse> {
  const { page, pageSize, search } = params;
  const query: Record<string, any> = {};

  if (page !== undefined) query.page = page;
  if (pageSize !== undefined) query.pageSize = pageSize;
  if (search && search.trim().length > 0) query.search = search.trim();

  const response = await patientsApi.get<{
    data: Patient[];
    total: number;
    page: number;
    pageSize: number;
  }>("/patients", {
    params: query,
    context: { action: "get_patients", additionalData: { params } },
  });

  return {
    data: response.data.data,
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.pageSize,
  };
}

export async function getPatientById(id: string): Promise<Patient> {
  const response = await patientsApi.get<Patient>(`/patients/${id}`, {
    context: { action: "get_patient_by_id", additionalData: { patientId: id } },
  });
  return response.data;
}

export async function createPatient(
  patientData: CreatePatientRequest
): Promise<Patient> {
  const response = await patientsApi.post<Patient>("/patients", patientData, {
    context: { action: "create_patient", additionalData: { patientData } },
  });
  return response.data;
}

export async function updatePatient(
  patientData: UpdatePatientRequest
): Promise<Patient> {
  const { id, ...data } = patientData;
  const response = await patientsApi.patch<Patient>(`/patients/${id}`, data, {
    context: {
      action: "update_patient",
      additionalData: { patientId: id, patientData: data },
    },
  });
  return response.data;
}

export async function deletePatient(id: string): Promise<void> {
  await patientsApi.delete(`/patients/${id}`, {
    context: { action: "delete_patient", additionalData: { patientId: id } },
  });
}

// ============================================================================
// SPECIALIZED OPERATIONS
// ============================================================================

export async function searchPatients(query: string): Promise<Patient[]> {
  const response = await patientsApi.get<Patient[]>("/patients/search", {
    params: { q: query },
    context: { action: "search_patients", additionalData: { query } },
  });
  return response.data;
}

export async function getPatientAppointments(
  patientId: string
): Promise<any[]> {
  const response = await patientsApi.get<any[]>(
    `/patients/${patientId}/appointments`,
    {
      context: {
        action: "get_patient_appointments",
        additionalData: { patientId },
      },
    }
  );
  return response.data;
}

export async function getPatientMedicalHistory(
  patientId: string
): Promise<any[]> {
  const response = await patientsApi.get<any[]>(
    `/patients/${patientId}/medical-history`,
    {
      context: {
        action: "get_patient_medical_history",
        additionalData: { patientId },
      },
    }
  );
  return response.data;
}

export async function uploadPatientDocument(
  patientId: string,
  file: File,
  documentType: string
): Promise<any> {
  const response = await patientsApi.uploadFile(
    `/patients/${patientId}/documents`,
    file,
    {
      fieldName: "document",
      context: {
        action: "upload_patient_document",
        additionalData: { patientId, documentType, fileName: file.name },
      },
    }
  );
  return response.data;
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

export async function bulkCreatePatients(
  patients: CreatePatientRequest[]
): Promise<Patient[]> {
  const response = await patientsApi.post<Patient[]>(
    "/patients/bulk",
    { patients },
    {
      context: {
        action: "bulk_create_patients",
        additionalData: { count: patients.length },
      },
    }
  );
  return response.data;
}

export async function bulkUpdatePatients(
  patients: UpdatePatientRequest[]
): Promise<Patient[]> {
  const response = await patientsApi.patch<Patient[]>(
    "/patients/bulk",
    { patients },
    {
      context: {
        action: "bulk_update_patients",
        additionalData: { count: patients.length },
      },
    }
  );
  return response.data;
}

export async function bulkDeletePatients(patientIds: string[]): Promise<void> {
  await patientsApi.delete("/patients/bulk", {
    data: { patientIds },
    context: {
      action: "bulk_delete_patients",
      additionalData: { count: patientIds.length },
    },
  });
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export async function exportPatients(
  format: "csv" | "excel" | "pdf" = "csv"
): Promise<Blob> {
  return await patientsApi.downloadFile("/patients/export", {
    params: { format },
    context: { action: "export_patients", additionalData: { format } },
  });
}

// ============================================================================
// STATISTICS AND ANALYTICS
// ============================================================================

export interface PatientStats {
  total: number;
  newThisMonth: number;
  active: number;
  inactive: number;
  averageAge: number;
  genderDistribution: Record<string, number>;
}

export async function getPatientStats(): Promise<PatientStats> {
  const response = await patientsApi.get<PatientStats>("/patients/stats", {
    context: { action: "get_patient_stats" },
  });
  return response.data;
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export function isPatientNotFoundError(error: any): boolean {
  return (
    error?.error?.code === "NOT_FOUND_ERROR" &&
    error?.error?.message?.includes("patient")
  );
}

export function isPatientValidationError(error: any): boolean {
  return (
    error?.error?.code === "ZOD_VALIDATION_ERROR" &&
    error?.error?.details?.validationErrors?.some(
      (err: any) =>
        err.field?.startsWith("personal.") || err.field?.startsWith("address.")
    )
  );
}

export function isPatientConflictError(error: any): boolean {
  return (
    error?.error?.code === "CONFLICT_ERROR" &&
    error?.error?.message?.includes("patient")
  );
}
