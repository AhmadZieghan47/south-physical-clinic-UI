import api from "@/lib/api";
import type { FullPayload } from "./schema";

export type CreatePatientRes = {
  id: string;
  fullName: string;
  dob: string;
  gender: "M" | "F" | "O";
  phone: string;
  hasInsurance: boolean;
  balance: string;
  extraCare: boolean;
  nationalId: string | null;
  addressJson: Record<string, unknown> | null;
  notes: string | null;
  medicalHistory: string[];
  orthopedicImplants: string[];
  createdAt: string;
  updatedAt: string;
};

export async function createPatient(
  p: FullPayload["personal"],
  m: FullPayload["medical"]
) {
  const body = {
    fullName: `${p.firstName.trim()} ${p.lastName.trim()}`,
    dob: p.dob,
    gender: p.gender === "MALE" ? "M" : p.gender === "FEMALE" ? "F" : "O",
    phone: p.phone,
    hasInsurance: !!m.hasInsurance,
    balance: "0.00",
    extraCare: !!m.extraCare,
    ...(p.nationalId && p.nationalId.trim()
      ? { nationalId: p.nationalId.trim() }
      : {}),
    medicalHistory: m.medicalHistory || [],
    orthopedicImplants: m.orthopedicImplants || [],
  };

  const { data } = await api.post<CreatePatientRes>("/patients", body);
  return data;
}

export async function upsertInsurance(
  patientId: string,
  ins: FullPayload["insurance"]
) {
  if (!ins || !ins.insurerCompany) return;

  const body = {
    patientId,
    insurerId: ins.insurerCompany, // This should be the insurer ID from the dropdown
    coveragePercent: ins.coveragePercent?.toString() ?? "0.00",
    validityDate: ins.expiryDate ?? new Date().toISOString().split("T")[0], // Default to today if no expiry date
    referralAuth: ins.approvalNumber ?? null,
  };
  await api.post("/insurance-profiles", body);
}

export async function uploadAttachments(patientId: string, files: File[]) {
  if (!files?.length) return;

  // Upload files one by one using the backend's file-blobs/upload endpoint
  for (const file of files) {
    const form = new FormData();
    form.append("file", file);
    form.append("ownerPatientId", patientId);
    form.append("labelEn", file.name);

    await api.post("/file-blobs/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}
