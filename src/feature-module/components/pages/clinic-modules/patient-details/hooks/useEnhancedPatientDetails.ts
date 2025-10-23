// Enhanced Patient Details Hook with Integrated Error Handling
// This hook demonstrates how to use the new error handling system for patient details

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { getPatientById } from "@/api/enhancedPatients";
import { useErrorHandling, useErrorToast } from "@/hooks/useErrorHandling";
import type {
  Patient,
  TreatmentPlan,
  Appointment,
  Payment,
  FileBlob,
} from "@/types/typedefs";
import type { AppointmentRow, PaymentRow, FileRow } from "../tables";
import {
  getSessionTypeLabel,
  getLocationLabel,
  getStatusLabel,
  generatePaymentDescription,
  getPaymentMethodLabel,
  getFileTypeLabel,
  formatFileSize,
} from "../utils";

function getPaymentStatusLabel(paidAt: string): string {
  return paidAt ? "Completed" : "Pending";
}

export interface UseEnhancedPatientDetailsOptions {
  autoRetry?: boolean;
  maxRetries?: number;
  showErrorToasts?: boolean;
}

export function useEnhancedPatientDetails(
  id: string | undefined,
  options: UseEnhancedPatientDetailsOptions = {}
) {
  const { autoRetry = true, maxRetries = 3, showErrorToasts = true } = options;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  // Error handling - stabilize context to prevent infinite loops
  const errorContext = useMemo(() => ({
    component: "PatientDetails",
    action: "fetch_patient",
    additionalData: { patientId: id },
  }), [id]);

  const {
    error,
    isLoading,
    executeWithErrorHandling,
    clearError,
    retry,
    retryCount,
  } = useErrorHandling({
    autoRetry,
    maxRetries,
    context: errorContext,
  });

  // Error toast notifications
  const { showError } = useErrorToast({
    autoHide: true,
    duration: 5000,
    maxToasts: 3,
  });

  // Store executeWithErrorHandling in ref to avoid dependency issues
  const executeRef = useRef(executeWithErrorHandling);
  executeRef.current = executeWithErrorHandling;

  const fetchPatient = useCallback(async () => {
    if (!id) {
      return;
    }

    const result = await executeRef.current(async () => {
      const data = await getPatientById(id);
      setPatient(data);
      return data;
    });

    return result;
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id, fetchPatient]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error && showErrorToasts) {
      showError(error);
    }
  }, [error, showErrorToasts, showError]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const allAppointments: AppointmentRow[] = useMemo(() => {
    if (!patient?.plans) return [];
    const rows: AppointmentRow[] = [];
    (patient.plans as TreatmentPlan[]).forEach((plan) => {
      (plan.appointments as Appointment[] | undefined)?.forEach(
        (appointment) => {
          rows.push({
            ...appointment,
            therapist: {
              name: `Therapist ${appointment.therapistId}`,
              specialty: "Physical Therapist",
              avatarSrc: "assets/img/doctors/doctor-01.jpg",
            },
            sessionTypeLabel: getSessionTypeLabel(appointment.sessionType),
            locationLabel: getLocationLabel(appointment.location),
            statusLabel: getStatusLabel(appointment.status),
          } as AppointmentRow);
        }
      );
    });
    return rows.sort(
      (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
    );
  }, [patient]);

  const allPayments: PaymentRow[] = useMemo(() => {
    if (!patient?.payments) return [];
    const rows: PaymentRow[] = (patient.payments as Payment[]).map(
      (payment) =>
        ({
          ...payment,
          description: generatePaymentDescription(payment),
          methodLabel: getPaymentMethodLabel(payment.method),
          statusLabel: getPaymentStatusLabel(payment.paidAt),
        } as PaymentRow)
    );
    return rows.sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );
  }, [patient]);

  const allFiles: FileRow[] = useMemo(() => {
    if (!patient?.files) return [];
    const rows: FileRow[] = (patient.files as FileBlob[]).map(
      (file) =>
        ({
          ...file,
          fileTypeLabel: getFileTypeLabel(file.mimeType),
          sizeLabel: formatFileSize(file.sizeBytes),
          downloadUrl: `/api/files/download/${file.id}`,
        } as FileRow)
    );
    return rows.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [patient]);

  const filteredAppointments = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return allAppointments;
    return allAppointments.filter(
      (appointment) =>
        appointment.therapist.name.toLowerCase().includes(q) ||
        appointment.therapist.specialty?.toLowerCase().includes(q) ||
        appointment.sessionTypeLabel?.toLowerCase().includes(q) ||
        appointment.locationLabel?.toLowerCase().includes(q) ||
        appointment.statusLabel?.toLowerCase().includes(q) ||
        appointment.noteEn?.toLowerCase().includes(q)
    );
  }, [allAppointments, searchText]);

  const filteredPayments = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return allPayments;
    return allPayments.filter(
      (payment) =>
        payment.id.toLowerCase().includes(q) ||
        payment.description?.toLowerCase().includes(q) ||
        (payment as any).methodLabel?.toLowerCase().includes(q) ||
        (payment as any).statusLabel?.toLowerCase().includes(q) ||
        String(payment.amountJd).toLowerCase().includes(q)
    );
  }, [allPayments, searchText]);

  const filteredFiles = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return allFiles;
    return allFiles.filter(
      (file) =>
        file.id.toLowerCase().includes(q) ||
        (file as any).labelEn?.toLowerCase().includes(q) ||
        (file as any).labelAr?.toLowerCase().includes(q) ||
        (file as any).fileTypeLabel?.toLowerCase().includes(q) ||
        file.mimeType.toLowerCase().includes(q)
    );
  }, [allFiles, searchText]);

  const handleRetry = useCallback(() => {
    retry();
    fetchPatient();
  }, [retry, fetchPatient]);

  return {
    // State
    patient,
    loading: isLoading,
    error,
    searchText,
    retryCount,

    // Handlers
    handleSearch,
    refresh: fetchPatient,
    handleRetry,
    clearError,

    // Data
    filteredAppointments,
    filteredPayments,
    filteredFiles,
  } as const;
}
