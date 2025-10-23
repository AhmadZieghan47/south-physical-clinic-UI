import { useState, useEffect } from "react";
import type { AppointmentWithRelations } from "@/api/enhancedAppointments";
import type { AppointmentRow } from "@/feature-module/components/pages/clinic-modules/patient-details/tables/AppointmentsTable";
import type { CancelReasonT } from "@/types/typedefs";

// Union type for appointment data from different sources
type AppointmentData = AppointmentWithRelations | AppointmentRow | any;

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: CancelReasonT) => void;
  appointment: AppointmentData | null;
  isLoading?: boolean;
}

export default function CancelAppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  isLoading = false,
}: CancelAppointmentModalProps) {
  const [selectedReason, setSelectedReason] =
    useState<CancelReasonT>("PATIENT_REQUEST");

  const cancelReasons: { value: CancelReasonT; label: string }[] = [
    { value: "PATIENT_REQUEST", label: "Patient Request" },
    { value: "THERAPIST_UNAVAILABLE", label: "Therapist Unavailable" },
    { value: "INSURANCE_ISSUE", label: "Insurance Issue" },
    { value: "WEATHER_TRANSPORT", label: "Weather/Transport" },
    { value: "DUPLICATE_BOOKING", label: "Duplicate Booking" },
    { value: "CREATED_IN_ERROR", label: "Created in Error" },
    { value: "DOCTOR_ADVISED_HOLD", label: "Doctor Advised Hold" },
  ];

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(selectedReason);
  };

  // Get patient name from different appointment data structures
  const getPatientName = () => {
    if (!appointment) return "Unknown Patient";

    // Handle AppointmentWithRelations structure
    if (appointment.plan?.patient?.fullName) {
      return appointment.plan.patient.fullName;
    }

    // Handle AppointmentRow structure or other structures
    if (appointment.patient?.fullName) {
      return appointment.patient.fullName;
    }

    // Fallback
    return "Unknown Patient";
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cancel Appointment</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <p>
              Are you sure you want to cancel the appointment for{" "}
              <strong>{getPatientName()}</strong>?
            </p>

            <div className="mb-3">
              <label className="form-label">Cancellation Reason</label>
              <select
                className="form-select"
                value={selectedReason}
                onChange={(e) =>
                  setSelectedReason(e.target.value as CancelReasonT)
                }
                disabled={isLoading}
              >
                {cancelReasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Cancelling...
                </>
              ) : (
                <>
                  <i className="ti ti-x me-2"></i>
                  Cancel Appointment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        onClick={handleClose}
        style={{ cursor: "pointer", zIndex: -1 }}
      ></div>
    </div>
  );
}
