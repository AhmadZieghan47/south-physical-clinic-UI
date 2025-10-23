import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router";

import Wizard from "@/core/components/Wizard/Wizard";
import { useFormErrorHandling, useErrorToast } from "@/hooks/useErrorHandling";
import { SmartError, ErrorBoundary } from "@/components/ErrorDisplay";
import StepPersonal from "./steps/StepPersonal";
import StepMedical from "./steps/StepMedical";
import StepAttachments from "./steps/StepAttachments";
import StepReview from "./steps/StepReview";
import { fullSchema, type FullPayload } from "./schema";
import { createPatient, upsertInsurance, uploadAttachments } from "./api";

export default function CreatePatient() {
  const navigate = useNavigate();
  const methods = useForm<FullPayload>({
    resolver: zodResolver(fullSchema) as Resolver<FullPayload>,
    mode: "onSubmit", // Use onSubmit mode to prevent premature validation
    reValidateMode: "onBlur", // Re-validate on blur
    defaultValues: {
      personal: {
        firstName: "",
        lastName: "",
        phone: "",
        dob: "",
        gender: "MALE",
        bloodGroup: "O+",
        nationalId: "",
      },
      medical: {
        medicalHistory: [],
        orthopedicImplants: [],
        extraCare: false,
        hasInsurance: false,
      },
      insurance: {},
      attachments: { files: [] as any },
    },
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Enhanced error handling - only for API errors, not form validation
  const { generalError, clearAllErrors, handleFormError } =
    useFormErrorHandling({
      context: {
        component: "CreatePatient",
        action: "create_patient",
      },
    });

  // Error toast notifications
  const { showError } = useErrorToast({
    autoHide: true,
    duration: 5000,
    maxToasts: 3,
  });

  // Static steps array - insurance is now part of personal step
  const steps = [
    "Personal",
    "Medical", 
    "Attachments",
    "Review",
  ];

  // No longer needed - insurance is part of personal step

  const goNext = async () => {
    const currentStepName = steps[step];
    let fieldsToValidate: string[] = [];
    let isValid = true;

    switch (currentStepName) {
      case "Personal":
        fieldsToValidate = [
          "personal.firstName",
          "personal.lastName",
          "personal.phone",
          "personal.dob",
          "personal.gender",
          "medical.hasInsurance",
          // Include insurance fields when hasInsurance is true
          "insurance.insurerCompany",
          "insurance.coveragePercent",
        ];
        break;
      case "Medical":
        fieldsToValidate = [
          "medical.medicalHistory",
          "medical.orthopedicImplants",
          "medical.extraCare",
        ];
        break;
      case "Attachments":
        fieldsToValidate = ["attachments.files"];
        break;
      case "Review":
        // For review, run a full form validation using trigger() without args
        fieldsToValidate = [];
        break;
    }

    // Use resolver-driven validation for all steps
    try {
      if (currentStepName === "Review") {
        // Full form validation
        isValid = await methods.trigger();
      } else {
        isValid = await methods.trigger(fieldsToValidate as any);
      }
    } catch (error: any) {
      isValid = false;
    }

    if (isValid) {
      // Clear stale errors only after successful validation
      methods.clearErrors();
      const nextStep = Math.min(step + 1, steps.length - 1);
      setStep(nextStep);
    }
    // If not valid, the errors are already set above
  };

  const goBack = () => {
    const prevStep = Math.max(step - 1, 0);
    setStep(prevStep);
  };

  const finish = methods.handleSubmit(async (values) => {
    setLoading(true);
    clearAllErrors();

    try {
      // Create patient
      const { id: patientId } = await createPatient(
        values.personal,
        values.medical
      );

      // Create insurance profile only if hasInsurance is true
      if (values.medical.hasInsurance) {
        await upsertInsurance(patientId, values.insurance);
      }

      // Upload attachments only if files are selected
      if (values.attachments?.files && values.attachments.files.length > 0) {
        await uploadAttachments(
          patientId,
          values.attachments.files.map((x: any) => x.file)
        );
      }

      // Navigate to patient details page
      navigate(`/patient-details/${patientId}`);
    } catch (error) {
      // Only handle API errors here, not form validation errors
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
            <div className="col-lg-12">
              <div className="mb-4">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  Create Patient
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
                {steps[step] === "Personal" && <StepPersonal />}
                {steps[step] === "Medical" && <StepMedical />}
                {steps[step] === "Attachments" && <StepAttachments />}
                {steps[step] === "Review" && <StepReview />}
              </Wizard>
            </div>
          </div>
        </div>
      </FormProvider>
    </ErrorBoundary>
  );
}
