import { api } from "../../../../../lib/api";
import type {
  BeginTreatmentData,
  BeginTreatmentResult,
  BeginTreatmentFormData,
} from "./schema";

/**
 * Get all data needed for Begin Treatment workflow
 */
export async function getBeginTreatmentData(
  patientId: string
): Promise<BeginTreatmentData> {
  console.log("🔍 Fetching begin treatment data for patient:", patientId);
  console.log("🔍 API base URL:", api.defaults.baseURL);
  console.log(
    "🔍 Full URL:",
    `${api.defaults.baseURL}/begin-treatment/patients/${patientId}/begin-treatment-data`
  );

  try {
    const response = await api.get(
      `/begin-treatment/patients/${patientId}/begin-treatment-data`
    );
    console.log("✅ Begin treatment data received:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching begin treatment data:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    throw error;
  }
}

/**
 * Create a new treatment plan with full Begin Treatment workflow
 */
export async function beginTreatment(
  data: BeginTreatmentFormData
): Promise<BeginTreatmentResult> {
  const response = await api.post(
    "/begin-treatment/treatment-plans/begin-treatment",
    data
  );
  return response.data;
}

/**
 * List diagnoses with optional filtering
 */
export async function listDiagnoses(params?: {
  category?: string;
  search?: string;
}) {
  const response = await api.get("/begin-treatment/diagnoses", { params });
  return response.data;
}

/**
 * Get all available treatment packages
 */
export async function listPackages() {
  const response = await api.get("/begin-treatment/packages");
  return response.data;
}

/**
 * Request a discount for a treatment plan
 */
export async function requestTreatmentPlanDiscount(data: {
  planId: string;
  type: "PERCENT" | "FLAT";
  value: string;
  reasonEn: string;
  reasonAr?: string;
}) {
  const response = await api.post(
    "/begin-treatment/discounts/request-treatment-plan",
    data
  );
  return response.data;
}
