import { z } from "zod";

// Base schemas
const bigIntStrSchema = z.string().regex(/^\d+$/, "Must be a valid ID");
const moneySchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid money amount (e.g., 10 or 10.50)");
const planTypeSchema = z.enum(["PAY_PER_VISIT", "PACKAGE"]);
const discountTypeSchema = z.enum(["PERCENT", "FLAT"]);

// Diagnosis selection schema
const diagnosisSelectionSchema = z.object({
  diagnosisId: bigIntStrSchema,
  isPrimary: z.boolean(),
  notesEn: z.string().optional().nullable(),
  notesAr: z.string().optional().nullable(),
});

// Simple complaint schema - just an array of strings
const complaintSchema = z.string().min(1, "Complaint cannot be empty");

// Number of sessions schema
const numberOfSessionsSchema = z.number().int().min(1, "Number of sessions must be at least 1");

// Discount request schema
const discountRequestSchema = z.object({
  type: discountTypeSchema,
  value: moneySchema,
  reasonEn: z.string().min(1, "Reason is required"),
  reasonAr: z.string().optional().nullable(),
});

// Main Begin Treatment form schema
export const beginTreatmentSchema = z.object({
  patientId: bigIntStrSchema,
  diagnoses: z
    .array(diagnosisSelectionSchema)
    .min(1, "At least one diagnosis must be selected")
    .refine(
      (diagnoses) => diagnoses.filter((d) => d.isPrimary).length === 1,
      "Exactly one diagnosis must be marked as primary"
    ),
  complaints: z
    .array(complaintSchema)
    .min(1, "At least one complaint must be entered"),
  planType: planTypeSchema,
  packageCode: z.string().optional().nullable(),
  numberOfSessions: numberOfSessionsSchema,
  primaryTherapistId: bigIntStrSchema,
  referringDoctorId: bigIntStrSchema,
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (YYYY-MM-DD)"),
  targetFreqPerWeek: z.number().int().min(1).max(5).optional(),
  discountRequest: discountRequestSchema.optional(),
});

// TypeScript types
export type BeginTreatmentFormData = z.infer<typeof beginTreatmentSchema>;
export type DiagnosisSelection = z.infer<typeof diagnosisSelectionSchema>;
export type ComplaintText = z.infer<typeof complaintSchema>;
export type NumberOfSessions = z.infer<typeof numberOfSessionsSchema>;
export type DiscountRequest = z.infer<typeof discountRequestSchema>;

// API response types
export interface Diagnosis {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionType {
  id: string;
  code: string;
  labelEn: string;
  labelAr: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  whatsappNumber?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferringDoctor {
  id: string;
  nameEn: string;
  nameAr: string;
  specialtyEn?: string;
  specialtyAr?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackageOption {
  code: string;
  nameEn: string;
  nameAr: string;
  totalPrice: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface BeginTreatmentData {
  diagnoses: Diagnosis[];
  packages: PackageOption[];
  therapists: AppUser[];
  referringDoctors: ReferringDoctor[];
}

export interface BeginTreatmentResult {
  treatmentPlan: {
    id: string;
    patientId: string;
    planType: string;
    status: string;
    startDate: string;
    endDate?: string;
    totalSessions: number;
    remainingSessions: number;
    targetFreqPerWeek: number;
    primaryTherapistId: string;
    referringDoctorId: string;
    createdAt: string;
    updatedAt: string;
  };
  discountRequest?: {
    id: string;
    planId: string;
    type: string;
    value: string;
    reasonEn: string;
    reasonAr?: string;
    status: string;
    requestedBy: string;
    requestedAt: string;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
}
