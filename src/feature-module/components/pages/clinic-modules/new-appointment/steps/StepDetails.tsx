import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";

import type { AppointmentFormData } from "../schema";
import { getTreatmentPlansForPatient, getTherapistsForSelection } from "../api";

interface TreatmentPlan {
  id: string;
  patientId: string;
  planType: string;
  status: string;
  startDate: string;
  totalSessions: number;
  remainingSessions: number;
}

interface Therapist {
  id: string;
  username: string;
  email: string;
}

export default function StepDetails() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AppointmentFormData>();
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingTherapists, setLoadingTherapists] = useState(true);

  const selectedPatientId = watch("patientId");
  const selectedPlanId = watch("planId");
  const selectedTherapistId = watch("therapistId");
  const appointmentDate = watch("appointmentDate");

  // Session type options
  const sessionTypes = [
    { value: "REGULAR", label: "Regular Session" },
    { value: "SHOCK_WAVE", label: "Shock Wave Therapy" },
    { value: "INDIBA", label: "Indiba Therapy" },
    { value: "HOME", label: "Home Visit" },
    { value: "HOJAMA", label: "Hojama Therapy" },
    { value: "ELDER", label: "Elder Care" },
    { value: "HOSPITAL", label: "Hospital Visit" },
  ];

  // Location options
  const locations = [
    { value: "CLINIC", label: "Clinic" },
    { value: "HOME", label: "Home" },
    { value: "HOSPITAL", label: "Hospital" },
  ];

  // Load treatment plans when patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      const fetchPlans = async () => {
        try {
          setLoadingPlans(true);
          const response = await getTreatmentPlansForPatient(selectedPatientId);
          // Treatment plans API returns TreatmentPlan[] directly, not { data: TreatmentPlan[] }
          console.log("Treatment plans response:", response);
          const plans = response || [];
          console.log("Parsed plans:", plans);
          setTreatmentPlans(plans);

          // Auto-select plan if patient has only one ongoing plan
          if (plans.length === 1) {
            const plan = plans[0];
            setValue("planId", plan.id);
            setValue("planName", `${plan.planType} Plan`);
          } else if (plans.length === 0) {
            // Clear selection if no plans found
            setValue("planId", "");
            setValue("planName", "");
          }
        } catch (err) {
          console.error("Error fetching treatment plans:", err);
          setTreatmentPlans([]);
          setValue("planId", "");
          setValue("planName", "");
        } finally {
          setLoadingPlans(false);
        }
      };

      fetchPlans();
    } else {
      setTreatmentPlans([]);
      setValue("planId", "");
      setValue("planName", "");
    }
  }, [selectedPatientId, setValue]);

  // Load therapists on component mount
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoadingTherapists(true);
        const response = await getTherapistsForSelection();
        setTherapists(response.data || []);
      } catch (err) {
        console.error("Error fetching therapists:", err);
        setTherapists([]);
      } finally {
        setLoadingTherapists(false);
      }
    };

    fetchTherapists();
  }, []);

  const handlePlanChange = (planId: string) => {
    const plan = treatmentPlans.find((p) => p.id === planId);
    if (plan) {
      setValue("planId", planId);
      setValue("planName", `${plan.planType} Plan`);
    }
  };

  const handleTherapistChange = (therapistId: string) => {
    const therapist = therapists.find((t) => t.id === therapistId);
    if (therapist) {
      setValue("therapistId", therapistId);
      setValue("therapistName", therapist.username);
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setValue("appointmentDate", date.format("YYYY-MM-DD"));
    }
  };

  const handleTimeChange = (time: dayjs.Dayjs | null) => {
    if (time) {
      setValue("startTime", time.format("HH:mm"));
      // Auto-calculate end time (1 hour later)
      const endTime = time.add(1, "hour");
      setValue("endTime", endTime.format("HH:mm"));
    }
  };

  return (
    <div className="step-content">
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-2">Appointment Details</h5>
        <p className="text-muted mb-0">
          Provide the details for this appointment including date, time, and
          session type.
        </p>
      </div>

      <div className="row">
        {/* Treatment Plan Selection */}
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">
              Treatment Plan <span className="text-danger">*</span>
            </label>
            {loadingPlans ? (
              <div className="form-control d-flex align-items-center justify-content-center py-3">
                <div className="spinner-border spinner-border-sm me-2" />
                Loading plans...
              </div>
            ) : (
              <select
                {...register("planId")}
                className={`form-select ${errors.planId ? "is-invalid" : ""}`}
                onChange={(e) => handlePlanChange(e.target.value)}
                value={selectedPlanId || ""}
                disabled={!selectedPatientId || treatmentPlans.length === 1}
              >
                <option value="">
                  {!selectedPatientId
                    ? "Select a patient first"
                    : treatmentPlans.length === 0
                    ? "No ongoing treatment plans found"
                    : treatmentPlans.length === 1
                    ? "Auto-selected (only one plan available)"
                    : "Select a treatment plan"}
                </option>
                {treatmentPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.planType} - {plan.status} ({plan.remainingSessions}{" "}
                    sessions remaining)
                  </option>
                ))}
              </select>
            )}
            {errors.planId && (
              <div className="invalid-feedback">{errors.planId.message}</div>
            )}
            {treatmentPlans.length === 1 && (
              <div className="form-text text-info">
                <i className="ti ti-info-circle me-1" />
                This patient has only one ongoing treatment plan, so it has been
                automatically selected.
              </div>
            )}
            {treatmentPlans.length === 0 && selectedPatientId && (
              <div className="form-text text-warning">
                <i className="ti ti-alert-triangle me-1" />
                No ongoing treatment plans found for this patient. Please create
                a treatment plan first.
              </div>
            )}
          </div>
        </div>

        {/* Therapist Selection */}
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">
              Therapist <span className="text-danger">*</span>
            </label>
            {loadingTherapists ? (
              <div className="form-control d-flex align-items-center justify-content-center py-3">
                <div className="spinner-border spinner-border-sm me-2" />
                Loading therapists...
              </div>
            ) : (
              <select
                {...register("therapistId")}
                className={`form-select ${
                  errors.therapistId ? "is-invalid" : ""
                }`}
                onChange={(e) => handleTherapistChange(e.target.value)}
                value={selectedTherapistId || ""}
              >
                <option value="">Select a therapist</option>
                {therapists.map((therapist) => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.username} - {therapist.email}
                  </option>
                ))}
              </select>
            )}
            {errors.therapistId && (
              <div className="invalid-feedback">
                {errors.therapistId.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        {/* Appointment Date */}
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">
              Appointment Date <span className="text-danger">*</span>
            </label>
            <DatePicker
              className={`form-control ${
                errors.appointmentDate ? "is-invalid" : ""
              }`}
              placeholder="Select date"
              format="DD-MM-YYYY"
              onChange={handleDateChange}
              value={appointmentDate ? dayjs(appointmentDate) : null}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
            {errors.appointmentDate && (
              <div className="invalid-feedback">
                {errors.appointmentDate.message}
              </div>
            )}
          </div>
        </div>

        {/* Start Time */}
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">
              Start Time <span className="text-danger">*</span>
            </label>
            <TimePicker
              className={`form-control ${errors.startTime ? "is-invalid" : ""}`}
              placeholder="Select start time"
              format="HH:mm"
              onChange={handleTimeChange}
              value={
                watch("startTime") ? dayjs(watch("startTime"), "HH:mm") : null
              }
            />
            {errors.startTime && (
              <div className="invalid-feedback">{errors.startTime.message}</div>
            )}
            <div className="form-text text-info">
              <i className="ti ti-info-circle me-1" />
              Session duration will be automatically set to 1 hour
            </div>
          </div>
        </div>

      </div>

      <div className="row">
        {/* Session Type */}
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">
              Session Type <span className="text-danger">*</span>
            </label>
            <select
              {...register("sessionType")}
              className={`form-select ${
                errors.sessionType ? "is-invalid" : ""
              }`}
            >
              <option value="">Select session type</option>
              {sessionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.sessionType && (
              <div className="invalid-feedback">
                {errors.sessionType.message}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">
              Location <span className="text-danger">*</span>
            </label>
            <select
              {...register("location")}
              className={`form-select ${errors.location ? "is-invalid" : ""}`}
            >
              <option value="">Select location</option>
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
            {errors.location && (
              <div className="invalid-feedback">{errors.location.message}</div>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="row">
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">Notes (English)</label>
            <textarea
              {...register("noteEn")}
              className="form-control"
              rows={3}
              placeholder="Enter appointment notes in English..."
            />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">Notes (Arabic)</label>
            <textarea
              {...register("noteAr")}
              className="form-control"
              rows={3}
              placeholder="أدخل ملاحظات الموعد بالعربية..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
