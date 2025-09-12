import { z as zod } from "zod";

export const personalSchema = zod.object({
  firstName: zod.string().min(2, "First name is required"),
  lastName: zod.string().min(2, "Last name is required"),
  phone: zod.string().min(8, "Phone is required"),
  dob: zod.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  gender: zod.enum(["MALE", "FEMALE", "OTHER"], { message: "Gender is required" }),
  bloodGroup: zod.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"]),
  nationalId: zod.string().optional(),
});

export const medicalSchema = zod.object({
  diagnoses: zod.array(zod.string()).default([]),
  allergies: zod.array(zod.string()).default([]),
  medicalHistory: zod.array(zod.string()).default([]),
  currentMedications: zod.string().optional(),
  orthopedicImplants: zod.string().optional(),
  extraCare: zod.boolean().default(false),
  hasInsurance: zod.boolean().default(false),
});

export const insuranceSchema = zod.object({
  insurerId: zod.string().optional(),
  insurerName: zod.string().optional(),
  coveragePercent: zod.number().min(0).max(100).optional(),
  policyNumber: zod.string().optional(),
  approvalNumber: zod.string().optional(),
  copayPercent: zod.number().min(0).max(100).optional(),
  paymentMethod: zod.enum(["CASH","CARD","CHEQUE","PAYPAL"]).optional(),
  insurerCompany: zod.string().optional(),
  visitDate: zod.string().optional(),
  expiryDate: zod.string().optional(),
  sessionType: zod.string().optional(),
  visitConfirmed: zod.boolean().optional(),
});

export const attachmentsSchema = zod.object({
  files: zod.array(zod.object({
    name: zod.string(),
    size: zod.number().max(10 * 1024 * 1024),
    type: zod.string(),
    file: zod.any(),
  })).optional(),
});

export const treatmentPlanSchema = zod.object({
  planType: zod.enum(["PHYSIO_STANDARD","PHYSIO_POSTOP","ORTHO","NEURO","OTHER"]).default("PHYSIO_STANDARD"),
  sessionType: zod.string().min(1, "Session type is required"),
  sessionsCount: zod.number().int().min(1).max(60),
  startDate: zod.string().optional(),
});

export const fullSchema = zod.object({
  personal: personalSchema,
  medical: medicalSchema,
  insurance: insuranceSchema,
  attachments: attachmentsSchema,
  plan: treatmentPlanSchema,
});

export type FullPayload = zod.infer<typeof fullSchema>;
