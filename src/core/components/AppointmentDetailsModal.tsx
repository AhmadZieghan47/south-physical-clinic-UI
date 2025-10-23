import { useState, useEffect } from "react";
import ImageWithBasePath from "@/core/imageWithBasePath";
import {
  completeAppointment,
  getAppointmentDetails,
  type CompleteAppointmentRequest,
  type AppointmentDetails,
} from "@/api/enhancedAppointments";
import { useErrorHandling } from "@/hooks/useErrorHandling";
import { SmartError } from "@/components/ErrorDisplay";
import type {
  PreferredNextT,
  Patient,
  TreatmentPlan,
  SessionNote,
} from "@/types/typedefs";
import type { AppointmentWithRelations } from "@/api/enhancedAppointments";
import type { AppointmentRow } from "@/feature-module/components/pages/clinic-modules/patient-details/tables/AppointmentsTable";

// Union type for appointment data from different sources
type AppointmentData =
  | AppointmentWithRelations
  | AppointmentDetails["appointment"]
  | AppointmentRow
  | any;

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string | null;
  appointment?: AppointmentData | null;
  patient?: Patient | null;
  treatmentPlan?: TreatmentPlan | null;
  lastSessionNote?: SessionNote | null;
  onSessionCompleted?: () => void;
  onAppointmentUpdated?: () => void;
}

interface SessionNoteForm {
  summaryTextEn: string;
  summaryTextAr: string;
  preferredNext: PreferredNextT | null;
  recommendationsEn: string;
  recommendationsAr: string;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  appointment,
  patient,
  treatmentPlan,
  lastSessionNote,
  onSessionCompleted,
  onAppointmentUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "notes">("details");
  const [sessionNote, setSessionNote] = useState<SessionNoteForm>({
    summaryTextEn: "",
    summaryTextAr: "",
    preferredNext: null,
    recommendationsEn: "",
    recommendationsAr: "",
  });
  const [isCompleting, setIsCompleting] = useState(false);
  const [appointmentDetails, setAppointmentDetails] =
    useState<AppointmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { error, executeWithErrorHandling, clearError } = useErrorHandling({
    context: {
      component: "AppointmentDetailsModal",
      action: "load_appointment_details",
    },
  });

  // Load appointment details when modal opens with appointmentId
  useEffect(() => {
    if (isOpen && appointmentId && !appointment) {
      loadAppointmentDetails();
    }
  }, [isOpen, appointmentId, appointment]);

  const loadAppointmentDetails = async () => {
    if (!appointmentId) return;

    setIsLoading(true);
    clearError();

    try {
      const details = await executeWithErrorHandling(async () => {
        return await getAppointmentDetails(appointmentId);
      });

      if (details) {
        setAppointmentDetails(details);
      }
    } catch (error) {
      console.error("Failed to load appointment details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isCompleting) {
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
  }, [isOpen, isCompleting]);

  const handleClose = () => {
    setActiveTab("details");
    setSessionNote({
      summaryTextEn: "",
      summaryTextAr: "",
      preferredNext: null,
      recommendationsEn: "",
      recommendationsAr: "",
    });
    setAppointmentDetails(null);
    clearError();
    onClose();
  };

  const handleSessionNoteChange = (
    field: keyof SessionNoteForm,
    value: string | PreferredNextT | null
  ) => {
    setSessionNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompleteSession = async () => {
    const currentAppointment = appointment || appointmentDetails?.appointment;
    if (!currentAppointment) return;

    setIsCompleting(true);
    try {
      const completeData: CompleteAppointmentRequest = {
        sessionNote: {
          summaryTextEn: sessionNote.summaryTextEn || null,
          summaryTextAr: sessionNote.summaryTextAr || null,
          preferredNext: sessionNote.preferredNext,
          recommendationsEn: sessionNote.recommendationsEn || null,
          recommendationsAr: sessionNote.recommendationsAr || null,
        },
      };

      await executeWithErrorHandling(async () => {
        await completeAppointment(currentAppointment.id, completeData);
      });

      // Call the callback to refresh data
      onSessionCompleted?.();
      onAppointmentUpdated?.();

      // Close modal
      handleClose();

      // Show success message (you might want to use a toast here)
      console.log("Session completed successfully!");
    } catch (error) {
      console.error("Failed to complete session:", error);
      // Handle error (you might want to show an error toast here)
    } finally {
      setIsCompleting(false);
    }
  };

  const formatDateTime = (startsAt: string, endsAt: string): string => {
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const startFormatted = formatDate(startDate);
    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);

    return `${startFormatted} - ${startTime} to ${endTime}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "badge-soft-success text-success";
      case "CHECKED_IN":
        return "badge-soft-warning text-warning";
      case "CANCELLED":
        return "badge-soft-danger text-danger";
      case "BOOKED":
        return "badge-soft-primary text-primary";
      case "RESCHEDULED":
        return "badge-soft-secondary text-secondary";
      default:
        return "badge-soft-secondary text-secondary";
    }
  };

  // Get the current appointment data
  const currentAppointment = appointment || appointmentDetails?.appointment;
  const currentPatient = patient || appointmentDetails?.patient;
  const currentTreatmentPlan = treatmentPlan || appointmentDetails?.plan;
  // @TODO: Remove this after testing
  console.log("currentTreatmentPlan", currentTreatmentPlan);

  const currentTherapist =
    appointmentDetails?.therapist ||
    (appointment as AppointmentWithRelations)?.therapist ||
    (appointment as any)?.therapist;

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center">
              Appointment Details
              {currentAppointment && (
                <span
                  className={`badge ${getStatusBadgeClass(
                    currentAppointment.status
                  )} ms-2`}
                >
                  {currentAppointment.status}
                </span>
              )}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={isCompleting}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="py-4">
                <SmartError
                  error={error}
                  onRetry={loadAppointmentDetails}
                  onDismiss={clearError}
                  showSuggestions={true}
                  showRetryButton={true}
                />
              </div>
            ) : currentAppointment ? (
              <>
                {/* Tab Navigation */}
                <ul className="nav nav-tabs nav-bordered mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "details" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("details")}
                    >
                      <i className="ti ti-info-circle me-1"></i>
                      Details
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "notes" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("notes")}
                    >
                      <i className="ti ti-notes me-1"></i>
                      Session Notes
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                {activeTab === "details" && (
                  <div className="row">
                    {/* Left Column - Basic Info */}
                    <div className="col-md-6">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title fw-bold mb-3">
                            <i className="ti ti-calendar me-2"></i>
                            Appointment Information
                          </h6>

                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              Date & Time
                            </label>
                            <p className="mb-0">
                              {formatDateTime(
                                currentAppointment.startsAt,
                                currentAppointment.endsAt
                              )}
                            </p>
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              Session Type
                            </label>
                            <p className="mb-0">
                              {currentAppointment.sessionType.replace("_", " ")}
                            </p>
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              Status
                            </label>
                            <p className="mb-0">
                              <span
                                className={`badge ${getStatusBadgeClass(
                                  currentAppointment.status
                                )}`}
                              >
                                {currentAppointment.status}
                              </span>
                            </p>
                          </div>

                          {currentAppointment.noteEn && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Notes
                              </label>
                              <p className="mb-0">
                                {currentAppointment.noteEn}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - People Info */}
                    <div className="col-md-6">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title fw-bold mb-3">
                            <i className="ti ti-users me-2"></i>
                            People Involved
                          </h6>

                          {/* Patient Info */}
                          {currentPatient && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Patient
                              </label>
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm me-2">
                                  <ImageWithBasePath
                                    src="assets/img/icons/medIcon.svg"
                                    alt="Patient"
                                    className="rounded-circle"
                                  />
                                </div>
                                <div>
                                  <p className="mb-0 fw-semibold">
                                    {currentPatient.fullName ||
                                      "Unknown Patient"}
                                  </p>
                                  <small className="text-muted">
                                    {currentPatient.phone || ""}
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Therapist Info */}
                          {currentTherapist && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Therapist
                              </label>
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm me-2">
                                  <ImageWithBasePath
                                    src="assets/img/doctors/doctor-01.jpg"
                                    alt="Therapist"
                                    className="rounded-circle"
                                  />
                                </div>
                                <div>
                                  <p className="mb-0 fw-semibold">
                                    {(currentTherapist as any)?.username ||
                                      (currentTherapist as any)?.name}
                                  </p>
                                  <small className="text-muted">
                                    {(currentTherapist as any)?.specialty ||
                                      "Physical Therapist"}
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Referrer Doctor Info */}
                          {/* {currentTreatmentPlan?.referringDoctorId && ( */}
                          {true && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Referrer Doctor
                              </label>
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm me-2">
                                  <ImageWithBasePath
                                    src="assets/img/doctors/doctor-02.jpg"
                                    alt="Referrer Doctor"
                                    className="rounded-circle"
                                  />
                                </div>
                                <div>
                                  <p className="mb-0 fw-semibold">
                                    Dr. Referrer
                                  </p>
                                  <small className="text-muted">
                                    Referring Physician
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medical Information Row */}
                    <div className="col-12 mt-3">
                      <div className="row">
                        {/* Diagnosis */}
                        <div className="col-md-6">
                          <div className="card border-0 bg-light">
                            <div className="card-body">
                              <h6 className="card-title fw-bold mb-3">
                                <i className="ti ti-stethoscope me-2"></i>
                                Diagnosis
                              </h6>
                              <div className="mb-3">
                                <label className="form-label fw-semibold">
                                  Initial Diagnosis (EN)
                                </label>
                                <p className="mb-0">
                                  {/* {currentTreatmentPlan?.initialDxTextEn || "No diagnosis recorded"} */}
                                  No diagnosis recorded
                                </p>
                              </div>
                              {/* {currentTreatmentPlan?.initialDxTextAr && (
                                <div className="mb-3">
                                  <label className="form-label fw-semibold">
                                    Initial Diagnosis (AR)
                                  </label>
                                  <p className="mb-0">
                                    {currentTreatmentPlan.initialDxTextAr}
                                  </p>
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>

                        {/* Main Complaint */}
                        <div className="col-md-6">
                          <div className="card border-0 bg-light">
                            <div className="card-body">
                              <h6 className="card-title fw-bold mb-3">
                                <i className="ti ti-alert-circle me-2"></i>
                                Main Complaint
                              </h6>
                              <p className="mb-0">
                                {/* {currentPatient?.notes || "No main complaint recorded"} */}
                                No main complaint recorded
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Last Session Notes */}
                    {lastSessionNote && (
                      <div className="col-12 mt-3">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <h6 className="card-title fw-bold mb-3">
                              <i className="ti ti-file-text me-2"></i>
                              Last Session Notes
                            </h6>
                            <div className="row">
                              {lastSessionNote.summaryTextEn && (
                                <div className="col-md-6">
                                  <label className="form-label fw-semibold">
                                    Summary (EN)
                                  </label>
                                  <p className="mb-0">
                                    {lastSessionNote.summaryTextEn}
                                  </p>
                                </div>
                              )}
                              {lastSessionNote.summaryTextAr && (
                                <div className="col-md-6">
                                  <label className="form-label fw-semibold">
                                    Summary (AR)
                                  </label>
                                  <p className="mb-0">
                                    {lastSessionNote.summaryTextAr}
                                  </p>
                                </div>
                              )}
                              {lastSessionNote.recommendationsEn && (
                                <div className="col-md-6">
                                  <label className="form-label fw-semibold">
                                    Recommendations (EN)
                                  </label>
                                  <p className="mb-0">
                                    {lastSessionNote.recommendationsEn}
                                  </p>
                                </div>
                              )}
                              {lastSessionNote.recommendationsAr && (
                                <div className="col-md-6">
                                  <label className="form-label fw-semibold">
                                    Recommendations (AR)
                                  </label>
                                  <p className="mb-0">
                                    {lastSessionNote.recommendationsAr}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="row">
                    <div className="col-12">
                      <div className="card border-0">
                        <div className="card-body">
                          <h6 className="card-title fw-bold mb-3">
                            <i className="ti ti-edit me-2"></i>
                            Session Notes
                          </h6>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="summaryEn"
                                  className="form-label fw-semibold"
                                >
                                  Summary (English)
                                </label>
                                <textarea
                                  id="summaryEn"
                                  className="form-control"
                                  rows={4}
                                  value={sessionNote.summaryTextEn}
                                  onChange={(e) =>
                                    handleSessionNoteChange(
                                      "summaryTextEn",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter session summary in English..."
                                  disabled={isCompleting}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="summaryAr"
                                  className="form-label fw-semibold"
                                >
                                  Summary (Arabic)
                                </label>
                                <textarea
                                  id="summaryAr"
                                  className="form-control"
                                  rows={4}
                                  value={sessionNote.summaryTextAr}
                                  onChange={(e) =>
                                    handleSessionNoteChange(
                                      "summaryTextAr",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter session summary in Arabic..."
                                  disabled={isCompleting}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="recommendationsEn"
                                  className="form-label fw-semibold"
                                >
                                  Recommendations (English)
                                </label>
                                <textarea
                                  id="recommendationsEn"
                                  className="form-control"
                                  rows={3}
                                  value={sessionNote.recommendationsEn}
                                  onChange={(e) =>
                                    handleSessionNoteChange(
                                      "recommendationsEn",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter recommendations in English..."
                                  disabled={isCompleting}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="recommendationsAr"
                                  className="form-label fw-semibold"
                                >
                                  Recommendations (Arabic)
                                </label>
                                <textarea
                                  id="recommendationsAr"
                                  className="form-control"
                                  rows={3}
                                  value={sessionNote.recommendationsAr}
                                  onChange={(e) =>
                                    handleSessionNoteChange(
                                      "recommendationsAr",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter recommendations in Arabic..."
                                  disabled={isCompleting}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="preferredNext"
                              className="form-label fw-semibold"
                            >
                              Preferred Next Session
                            </label>
                            <select
                              id="preferredNext"
                              className="form-select"
                              value={sessionNote.preferredNext || ""}
                              onChange={(e) =>
                                handleSessionNoteChange(
                                  "preferredNext",
                                  e.target.value || null
                                )
                              }
                              disabled={isCompleting}
                            >
                              <option value="">Select preferred timing</option>
                              <option value="2D">2 Days</option>
                              <option value="3D">3 Days</option>
                              <option value="4D">4 Days</option>
                              <option value="5D">5 Days</option>
                              <option value="1W">1 Week</option>
                              <option value="2W">2 Weeks</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isCompleting}
            >
              Close
            </button>
            {activeTab === "notes" &&
              currentAppointment &&
              currentAppointment.status !== "COMPLETED" && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleCompleteSession}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Completing...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-check me-2"></i>
                      Complete Session
                    </>
                  )}
                </button>
              )}
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
};

export default AppointmentDetailsModal;
