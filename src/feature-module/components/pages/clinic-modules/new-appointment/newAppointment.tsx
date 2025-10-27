import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import Wizard from "@/core/components/Wizard/Wizard";
import StepPatient from "./steps/StepPatient";
import StepDetails from "./steps/StepDetails";
import StepReview from "./steps/StepReview";

import { appointmentFormSchema, type AppointmentFormData } from "./schema";
import { createAppointment } from "./api";
import {
  useFormErrorHandling,
  useErrorToast,
} from "../../../../../hooks/useErrorHandling";
import {
  SmartError,
  ErrorBoundary,
} from "../../../../../components/ErrorDisplay";

export default function NewAppointment() {
  const navigate = useNavigate();
  const { patientId: urlPatientId } = useParams<{ patientId?: string }>();
  const [searchParams] = useSearchParams();
  const [isPatientPreSelected, setIsPatientPreSelected] = useState(false);
  const [isSchedulerPreFilled, setIsSchedulerPreFilled] = useState(false);

  const methods = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema) as any,
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      patientId: "",
      patientName: "",
      planId: "",
      planName: "",
      therapistId: "",
      therapistName: "",
      appointmentDate: "",
      startTime: "",
      endTime: "",
      sessionType: "REGULAR",
      location: "CLINIC",
      noteEn: "",
      noteAr: "",
      status: "BOOKED",
    },
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Handle patient pre-selection from URL parameter
  useEffect(() => {
    if (urlPatientId) {
      setIsPatientPreSelected(true);
      methods.setValue("patientId", urlPatientId);
      // We'll let the StepPatient component handle fetching and setting the patient name
    }
  }, [urlPatientId, methods]);

  // Handle pre-fill from scheduler (query params)
  useEffect(() => {
    const therapistId = searchParams.get("therapistId");
    const date = searchParams.get("date");
    const hour = searchParams.get("hour");

    if (therapistId && date && hour) {
      setIsSchedulerPreFilled(true);
      
      // Pre-fill form fields
      methods.setValue("therapistId", therapistId);
      methods.setValue("appointmentDate", date);
      
      // Convert hour to time format (HH:00)
      const startTime = `${hour.padStart(2, "0")}:00`;
      methods.setValue("startTime", startTime);
      
      // Auto-calculate end time (1 hour later)
      const endHour = parseInt(hour) + 1;
      const endTime = `${endHour.toString().padStart(2, "0")}:00`;
      methods.setValue("endTime", endTime);
    }
  }, [searchParams, methods]);

  // Enhanced error handling
  const { generalError, clearAllErrors, handleFormError } =
    useFormErrorHandling({
      context: {
        component: "NewAppointment",
        action: "create_appointment",
      },
    });

  // Error toast notifications
  const { showError } = useErrorToast({
    autoHide: true,
    duration: 5000,
    maxToasts: 3,
  });

  const steps = ["Patient", "Details", "Review"];

  const goNext = async () => {
    const currentStepName = steps[step];
    let fieldsToValidate: (keyof AppointmentFormData)[] = [];

    switch (currentStepName) {
      case "Patient":
        fieldsToValidate = ["patientId"];
        break;
      case "Details":
        fieldsToValidate = [
          "planId",
          "therapistId",
          "appointmentDate",
          "startTime",
          "sessionType",
          "location",
        ];
        break;
      case "Review":
        fieldsToValidate = [
          "patientId",
          "planId",
          "therapistId",
          "appointmentDate",
          "startTime",
          "sessionType",
          "location",
        ];
        break;
    }

    // Manual validation for current step
    const currentValues = methods.getValues();
    let isValid = true;

    for (const fieldPath of fieldsToValidate) {
      const value = currentValues[fieldPath];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        methods.setError(fieldPath, {
          type: "manual",
          message: `Please provide ${fieldPath
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}`,
        });
        isValid = false;
      }
    }

    // Auto-calculate end time if start time is provided
    if (currentStepName === "Details" || currentStepName === "Review") {
      const startTime = currentValues.startTime;
      if (startTime && !currentValues.endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
        const endTime = end.toTimeString().slice(0, 5); // Format as HH:mm
        methods.setValue("endTime", endTime);
      }
    }

    if (isValid) {
      const nextStep = Math.min(step + 1, steps.length - 1);
      setStep(nextStep);
    } else {
      methods.trigger();
    }
  };

  const goBack = () => {
    const prevStep = Math.max(step - 1, 0);
    setStep(prevStep);
  };

  const finish = methods.handleSubmit(async (values) => {
    setLoading(true);
    clearAllErrors();

    try {
      // Convert form data to API format and create appointment
      await createAppointment(values);

      // Navigate to appointments list with success message
      navigate("/appointments", {
        state: {
          message: "Appointment created successfully!",
          type: "success",
        },
      });
    } catch (error) {
      handleFormError(error);
      if (error && typeof error === "object" && "error" in error) {
        showError(error as any);
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <ErrorBoundary>
      <FormProvider {...methods}>
        <div className="page-wrapper">
          <div className="content d-flex justify-content-center">
            <div className="col-lg-10">
              <div className="mb-4">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  <i className="ti ti-calendar-plus me-2" />
                  Create New Appointment
                </h6>
              </div>

              {/* General Error Display */}
              {generalError && (
                <div className="mb-4">
                  <SmartError
                    error={generalError}
                    onDismiss={clearAllErrors}
                    showSuggestions={true}
                    showRetryButton={false}
                  />
                </div>
              )}

              <Wizard
                steps={steps}
                activeStep={step}
                onBack={goBack}
                onNext={goNext}
                onFinish={finish}
                loading={loading}
              >
                {steps[step] === "Patient" && (
                  <StepPatient
                    isPreSelected={isPatientPreSelected}
                    preSelectedPatientId={urlPatientId}
                  />
                )}
                {steps[step] === "Details" && (
                  <StepDetails isSchedulerPreFilled={isSchedulerPreFilled} />
                )}
                {steps[step] === "Review" && <StepReview />}
              </Wizard>
            </div>
          </div>
        </div>
      </FormProvider>
    </ErrorBoundary>
  );
}
