import { useEffect, useState } from "react";
import type { AppointmentWithRelations } from "@/api/enhancedAppointments";
import type { AppointmentRow } from "@/feature-module/components/pages/clinic-modules/patient-details/tables/AppointmentsTable";
import type { SessionTypeT } from "@/types/typedefs";
import { updateAppointment } from "@/api/enhancedAppointments";
import { useErrorHandling } from "@/hooks/useErrorHandling";
import { SmartError } from "@/components/ErrorDisplay";

// Union type for appointment data from different sources
type AppointmentData = AppointmentWithRelations | AppointmentRow | any;

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentData | null;
  onSaved?: () => void;
}

export default function EditAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSaved,
}: EditAppointmentModalProps) {
  const [therapistId, setTherapistId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<SessionTypeT>("REGULAR");
  const [noteEn, setNoteEn] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const { error, executeWithErrorHandling, clearError } = useErrorHandling({
    context: {
      component: "EditAppointmentModal",
      action: "update_appointment",
    },
  });

  useEffect(() => {
    if (!appointment) return;

    // Handle different appointment data structures
    const therapistIdValue =
      appointment.therapistId || appointment.therapist?.id || "";
    setTherapistId(String(therapistIdValue));

    const start = new Date(appointment.startsAt);
    const end = new Date(appointment.endsAt);
    setDate(start.toISOString().slice(0, 10));
    setStartTime(start.toTimeString().slice(0, 5));
    setEndTime(end.toTimeString().slice(0, 5));
    setSessionType(appointment.sessionType);
    setNoteEn(appointment.noteEn || "");
  }, [appointment]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !saving) {
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
  }, [isOpen, saving]);

  const handleClose = () => {
    if (saving) return;
    clearError();
    onClose();
  };

  const handleSave = async () => {
    if (!appointment) return;

    setSaving(true);
    clearError();

    try {
      // Combine date + times to ISO strings
      const startsAt = new Date(`${date}T${startTime}:00`).toISOString();
      const endsAt = new Date(`${date}T${endTime}:00`).toISOString();

      await executeWithErrorHandling(async () => {
        await updateAppointment({
          id: appointment.id,
          therapistId: therapistId,
          startsAt,
          endsAt,
          sessionType,
          noteEn: noteEn || null,
        });
      });

      onSaved?.();
      handleClose();
    } catch (error) {
      console.error("Failed to update appointment:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Appointment</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={saving}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Error Display */}
            {error && (
              <div className="mb-3">
                <SmartError
                  error={error}
                  onDismiss={clearError}
                  showSuggestions={true}
                  showRetryButton={false}
                />
              </div>
            )}

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Therapist ID</label>
                <input
                  className="form-control"
                  value={therapistId}
                  onChange={(e) => setTherapistId(e.target.value)}
                  disabled={saving}
                  placeholder="Enter therapist ID"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Session Type</label>
                <select
                  className="form-select"
                  value={sessionType}
                  onChange={(e) =>
                    setSessionType(e.target.value as SessionTypeT)
                  }
                  disabled={saving}
                >
                  <option value="REGULAR">Regular</option>
                  <option value="SHOCK_WAVE">Shock Wave</option>
                  <option value="INDIBA">INDIBA</option>
                  <option value="HOME">Home</option>
                  <option value="HOJAMA">Hojama</option>
                  <option value="ELDER">Elder</option>
                  <option value="HOSPITAL">Hospital</option>
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label">Notes (English)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={noteEn}
                  onChange={(e) => setNoteEn(e.target.value)}
                  disabled={saving}
                  placeholder="Enter appointment notes in English..."
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ti ti-device-floppy me-2"></i>
                  Save Changes
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
