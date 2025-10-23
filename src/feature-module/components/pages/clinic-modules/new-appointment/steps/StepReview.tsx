import { useFormContext } from "react-hook-form";
import { format } from "date-fns";

import type { AppointmentFormData } from "../schema";

export default function StepReview() {
  const { watch } = useFormContext<AppointmentFormData>();
  const formData = watch();

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return format(new Date(date), "EEEE, MMMM do, yyyy");
  };

  const getSessionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      REGULAR: "Regular Session",
      SHOCK_WAVE: "Shock Wave Therapy",
      INDIBA: "Indiba Therapy",
      HOME: "Home Visit",
      HOJAMA: "Hojama Therapy",
      ELDER: "Elder Care",
      HOSPITAL: "Hospital Visit",
    };
    return labels[type] || type;
  };

  const getLocationLabel = (location: string) => {
    const labels: Record<string, string> = {
      CLINIC: "Clinic",
      HOME: "Home",
      HOSPITAL: "Hospital",
    };
    return labels[location] || location;
  };

  return (
    <div className="step-content">
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-2">Review Appointment</h5>
        <p className="text-muted mb-0">
          Please review the appointment details before creating it.
        </p>
      </div>

      <div className="card">
        <div className="card-header bg-light">
          <h6 className="fw-bold mb-0">Appointment Summary</h6>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Patient Information */}
            <div className="col-lg-6">
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="ti ti-user me-2" />
                  Patient Information
                </h6>
                <div className="ps-3">
                  <p className="mb-1">
                    <strong>Name:</strong>{" "}
                    {formData.patientName || "Not selected"}
                  </p>
                  <p className="mb-0">
                    <strong>Patient ID:</strong>{" "}
                    {formData.patientId || "Not selected"}
                  </p>
                </div>
              </div>
            </div>

            {/* Treatment Plan */}
            <div className="col-lg-6">
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="ti ti-clipboard-list me-2" />
                  Treatment Plan
                </h6>
                <div className="ps-3">
                  <p className="mb-1">
                    <strong>Plan:</strong> {formData.planName || "Not selected"}
                  </p>
                  <p className="mb-0">
                    <strong>Plan ID:</strong>{" "}
                    {formData.planId || "Not selected"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Therapist Information */}
            <div className="col-lg-6">
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="ti ti-user-check me-2" />
                  Therapist
                </h6>
                <div className="ps-3">
                  <p className="mb-1">
                    <strong>Name:</strong>{" "}
                    {formData.therapistName || "Not selected"}
                  </p>
                  <p className="mb-0">
                    <strong>Therapist ID:</strong>{" "}
                    {formData.therapistId || "Not selected"}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="col-lg-6">
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="ti ti-calendar me-2" />
                  Appointment Details
                </h6>
                <div className="ps-3">
                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {formData.appointmentDate
                      ? formatDate(formData.appointmentDate)
                      : "Not selected"}
                  </p>
                  <p className="mb-1">
                    <strong>Time:</strong>{" "}
                    {formData.startTime
                      ? `${formatTime(formData.startTime)} - ${formatTime(
                          formData.endTime || (() => {
                            const start = new Date(`2000-01-01T${formData.startTime}`);
                            const end = new Date(start.getTime() + 60 * 60 * 1000);
                            return end.toTimeString().slice(0, 5);
                          })()
                        )}`
                      : "Not selected"}
                  </p>
                  <p className="mb-0">
                    <strong>Duration:</strong>{" "}
                    {formData.startTime
                      ? (() => {
                          const start = new Date(
                            `2000-01-01T${formData.startTime}`
                          );
                          const endTime = formData.endTime || (() => {
                            const end = new Date(start.getTime() + 60 * 60 * 1000);
                            return end.toTimeString().slice(0, 5);
                          })();
                          const end = new Date(
                            `2000-01-01T${endTime}`
                          );
                          const diffMs = end.getTime() - start.getTime();
                          const diffHours = diffMs / (1000 * 60 * 60);
                          return `${diffHours} hour${
                            diffHours !== 1 ? "s" : ""
                          }`;
                        })()
                      : "Not calculated"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Session Information */}
            <div className="col-lg-6">
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="ti ti-stethoscope me-2" />
                  Session Information
                </h6>
                <div className="ps-3">
                  <p className="mb-1">
                    <strong>Type:</strong>{" "}
                    {formData.sessionType
                      ? getSessionTypeLabel(formData.sessionType)
                      : "Not selected"}
                  </p>
                  <p className="mb-0">
                    <strong>Location:</strong>{" "}
                    {formData.location
                      ? getLocationLabel(formData.location)
                      : "Not selected"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="col-lg-6">
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="ti ti-info-circle me-2" />
                  Status
                </h6>
                <div className="ps-3">
                  <p className="mb-0">
                    <span
                      className={`badge badge-soft-primary fs-13 fw-medium`}
                    >
                      {formData.status || "BOOKED"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(formData.noteEn || formData.noteAr) && (
            <div className="row">
              <div className="col-12">
                <div className="mb-0">
                  <h6 className="fw-bold text-primary mb-2">
                    <i className="ti ti-notes me-2" />
                    Notes
                  </h6>
                  <div className="ps-3">
                    {formData.noteEn && (
                      <div className="mb-2">
                        <strong>English:</strong>
                        <p className="mb-0 text-muted">{formData.noteEn}</p>
                      </div>
                    )}
                    {formData.noteAr && (
                      <div className="mb-0">
                        <strong>Arabic:</strong>
                        <p className="mb-0 text-muted">{formData.noteAr}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Summary */}
      <div className="mt-4">
        <h6 className="fw-bold text-dark mb-2">Validation Check</h6>
        <div className="row">
          <div className="col-lg-6">
            <ul className="list-unstyled mb-0">
              <li
                className={`mb-1 ${
                  formData.patientId ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${formData.patientId ? "check" : "x"} me-2`}
                />
                Patient selected
              </li>
              <li
                className={`mb-1 ${
                  formData.planId ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${formData.planId ? "check" : "x"} me-2`}
                />
                Treatment plan selected
              </li>
              <li
                className={`mb-1 ${
                  formData.therapistId ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${
                    formData.therapistId ? "check" : "x"
                  } me-2`}
                />
                Therapist selected
              </li>
            </ul>
          </div>
          <div className="col-lg-6">
            <ul className="list-unstyled mb-0">
              <li
                className={`mb-1 ${
                  formData.appointmentDate ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${
                    formData.appointmentDate ? "check" : "x"
                  } me-2`}
                />
                Date selected
              </li>
              <li
                className={`mb-1 ${
                  formData.startTime ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${
                    formData.startTime ? "check" : "x"
                  } me-2`}
                />
                Time selected (1 hour duration)
              </li>
              <li
                className={`mb-1 ${
                  formData.sessionType && formData.location
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${
                    formData.sessionType && formData.location ? "check" : "x"
                  } me-2`}
                />
                Session details complete
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
