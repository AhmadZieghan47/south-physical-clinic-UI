import { z } from "zod";

// Base appointment schema matching backend InsertAppointment
export const appointmentSchema = z.object({
  planId: z.string().min(1, "Please select a treatment plan"),
  therapistId: z.string().min(1, "Please select a therapist"),
  startsAt: z.string().min(1, "Please select appointment start time"),
  endsAt: z.string().min(1, "Please select appointment end time"),
  sessionType: z.enum([
    "REGULAR",
    "SHOCK_WAVE",
    "INDIBA",
    "HOME",
    "HOJAMA",
    "ELDER",
    "HOSPITAL",
  ]),
  location: z.enum(["CLINIC", "HOME", "HOSPITAL"]),
  status: z
    .enum(["BOOKED", "CHECKED_IN", "COMPLETED", "CANCELLED", "RESCHEDULED"])
    .optional()
    .default("BOOKED"),
  noteEn: z.string().optional(),
  noteAr: z.string().optional(),
});

// Extended schema for the form with additional fields
export const appointmentFormSchema = z
  .object({
    // Patient selection
    patientId: z.string().min(1, "Please select a patient"),
    patientName: z.string().optional(), // For display purposes

    // Treatment plan selection
    planId: z.string().min(1, "Please select a treatment plan"),
    planName: z.string().optional(), // For display purposes

    // Therapist selection
    therapistId: z.string().min(1, "Please select a therapist"),
    therapistName: z.string().optional(), // For display purposes

    // Appointment details
    appointmentDate: z.string().min(1, "Please select appointment date"),
    startTime: z.string().min(1, "Please select start time"),
    endTime: z.string().optional(), // Auto-calculated as startTime + 1 hour

    // Convert to ISO strings for API
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),

    sessionType: z.enum([
      "REGULAR",
      "SHOCK_WAVE",
      "INDIBA",
      "HOME",
      "HOJAMA",
      "ELDER",
      "HOSPITAL",
    ]),
    location: z.enum(["CLINIC", "HOME", "HOSPITAL"]),

    // Optional fields
    noteEn: z.string().optional(),
    noteAr: z.string().optional(),
    status: z
      .enum(["BOOKED", "CHECKED_IN", "COMPLETED", "CANCELLED", "RESCHEDULED"])
      .optional()
      .default("BOOKED"),
  })
  .refine(
    (data) => {
      // Auto-calculate end time if not provided
      if (data.startTime && !data.endTime) {
        const start = new Date(`2000-01-01T${data.startTime}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
        data.endTime = end.toTimeString().slice(0, 5); // Format as HH:mm
      }
      return true;
    },
    {
      message: "End time will be automatically calculated",
      path: ["endTime"],
    }
  );

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
export type AppointmentData = z.infer<typeof appointmentSchema>;
