import api from "../../../core/net/api";
import type { FullPayload } from "./schema";

export type CreatePatientRes = { id: string };

export async function createPatient(
  p: FullPayload["personal"],
  m: FullPayload["medical"]
) {
  const body = {
    firstName: p.firstName.trim(),
    lastName: p.lastName.trim(),
    phone: p.phone,
    dob: p.dob,
    gender: p.gender,
    bloodGroup: p.bloodGroup,
    nationalId: p.nationalId ?? null,
    extraCare: !!m.extraCare,
    medical: {
      diagnoses: m.diagnoses,
      allergies: m.allergies,
      medicalHistory: m.medicalHistory ?? null,
      currentMedications: m.currentMedications ?? null,
      orthopedicImplants: m.orthopedicImplants ?? null,
    },
  };
  const { data } = await api.post<CreatePatientRes>("/patients", body);
  return data;
}

export async function upsertInsurance(
  patientId: string,
  ins: FullPayload["insurance"]
) {
  if (!ins || (!ins.insurerId && !ins.insurerName)) return;
  const body = {
    patientId,
    insurerId: ins.insurerId ?? null,
    insurerName: ins.insurerName ?? null,
    policyNumber: ins.policyNumber ?? null,
    approvalNumber: ins.approvalNumber ?? null,
    coveragePercent: ins.coveragePercent ?? null,
    copayPercent: ins.copayPercent ?? null,
    paymentMethod: ins.paymentMethod ?? null,
    insurerCompany: ins.insurerCompany ?? null,
    visitDate: ins.visitDate ?? null,
    expiryDate: ins.expiryDate ?? null,
    sessionType: ins.sessionType ?? null,
    visitConfirmed: !!ins.visitConfirmed,
  };
  await api.post(`/patients/${patientId}/insurance`, body);
}

export async function createTreatmentPlan(
  patientId: string,
  plan: FullPayload["plan"]
) {
  const body = {
    patientId,
    planType: plan.planType,
    sessionType: plan.sessionType,
    sessionsTotal: plan.sessionsCount,
    sessionsRemaining: plan.sessionsCount,
    startDate: plan.startDate ?? new Date().toISOString().slice(0, 10),
    status: "ACTIVE",
  };
  const { data } = await api.post(
    `/patients/${patientId}/treatment-plans`,
    body
  );
  return data as { id: string };
}

export async function uploadAttachments(patientId: string, files: File[]) {
  if (!files?.length) return;
  const form = new FormData();
  for (const f of files) form.append("files", f, f.name);
  await api.post(`/patients/${patientId}/attachments`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
