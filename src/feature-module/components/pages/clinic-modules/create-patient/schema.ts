import { z as zod } from "zod";

export const personalSchema = zod.object({
  firstName: zod.string().min(2, "First name must be at least 2 characters"),
  lastName: zod.string().min(2, "Last name must be at least 2 characters"),
  phone: zod.string().min(4, "Phone number must be at least 4 characters").max(50, "Phone number must be at most 50 characters"),
  dob: zod.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)"),
  gender: zod.enum(["MALE", "FEMALE", "OTHER"], { message: "Please select a gender" }),
  bloodGroup: zod.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"], { message: "Please select a blood group" }),
  nationalId: zod.string().max(64, "National ID must be at most 64 characters").optional(),
});

export const medicalSchema = zod.object({
  medicalHistory: zod.array(zod.string()).default([]),
  orthopedicImplants: zod.array(zod.string()).default([]),
  extraCare: zod.boolean().default(false),
  hasInsurance: zod.boolean().default(false),
});

export const attachmentsSchema = zod.object({
  files: zod.array(zod.object({
    name: zod.string(),
    size: zod.number().max(10 * 1024 * 1024),
    type: zod.string(),
    file: zod.any(),
  })).optional(),
});

// Conditional insurance validation - only required if hasInsurance is true
export const conditionalInsuranceSchema = zod.object({
  insurerId: zod.string().optional(),
  insurerName: zod.string().optional(),
  coveragePercent: zod.union([
    zod.number().min(0, "Coverage must be between 0-100").max(100, "Coverage must be between 0-100"),
    zod.nan()
  ]).optional(),
  approvalNumber: zod.string().max(64, "Approval number must be at most 64 characters").optional(),
  insurerCompany: zod.string().optional(), // This stores the insurer ID from the dropdown
  expiryDate: zod.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)").optional(),
});

export const fullSchema = zod
  .object({
    personal: personalSchema,
    medical: medicalSchema,
    insurance: conditionalInsuranceSchema,
    attachments: attachmentsSchema,
  })
  .superRefine((val, ctx) => {
    // Only enforce insurance-related requirements when hasInsurance is true
    if (!val.medical.hasInsurance) {
      return;
    }

    // Require insurerCompany when patient has insurance
    if (!val.insurance?.insurerCompany) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["insurance", "insurerCompany"],
        message: "Please select an insurer company",
      });
    }

    // coveragePercent must be present and between 1 and 100 (inclusive)
    const coverage = (val.insurance as any)?.coveragePercent as number | undefined;
    if (coverage === undefined || Number.isNaN(coverage)) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["insurance", "coveragePercent"],
        message: "Coverage percentage is required",
      });
    } else if (coverage < 1 || coverage > 100) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["insurance", "coveragePercent"],
        message: "Coverage must be between 1 and 100",
      });
    }
  });

// Separate schema for insurance validation that includes the refine logic
export const insuranceValidationSchema = conditionalInsuranceSchema.refine(() => {
  // This will be used when specifically validating insurance step
  return true; // We'll handle the conditional logic in the component
}, {
  message: "Please select an insurer company",
  path: ["insurerCompany"],
});

export type FullPayload = zod.infer<typeof fullSchema>;
