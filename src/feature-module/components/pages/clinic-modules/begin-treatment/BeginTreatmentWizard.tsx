import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";

import Wizard from "@/core/components/Wizard/Wizard";
import Step1DiagnosisSelector from "./steps/Step1DiagnosisSelector";
import Step2Complaints from "./steps/Step2Complaints";
import Step3PlanSelection from "./steps/Step3PlanSelection";
import Step4DiscountRequest from "./steps/Step4DiscountRequest";

import { beginTreatmentSchema, type BeginTreatmentFormData } from "./schema";
import { beginTreatment, getBeginTreatmentData } from "./api";
import { useFormErrorHandling } from "@/hooks/useErrorHandling";
import { SmartError, ErrorBoundary } from "@/components/ErrorDisplay";
import { all_routes } from "@/feature-module/routes/all_routes";

const STEPS = [
  "Select Diagnoses",
  "Select Complaints",
  "Choose Treatment Plan",
  "Request Discount (Optional)",
];

export default function BeginTreatmentWizard() {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();

  const methods = useForm<BeginTreatmentFormData>({
    resolver: zodResolver(
      beginTreatmentSchema
    ) as Resolver<BeginTreatmentFormData>,
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      patientId: patientId || "",
      diagnoses: [],
      complaints: [""], // Start with one empty complaint
      planType: "PACKAGE",
      packageCode: "",
      numberOfSessions: 1,
      primaryTherapistId: "",
      referringDoctorId: "",
      startDate: new Date().toISOString().split("T")[0], // Always use current date
      targetFreqPerWeek: 1,
      discountRequest: undefined,
    },
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [beginTreatmentData, setBeginTreatmentData] = useState<any>(null);

  // Enhanced error handling
  const { generalError, clearAllErrors, handleFormError } =
    useFormErrorHandling({
      context: {
        component: "BeginTreatmentWizard",
        action: "begin-treatment",
      },
    });

  // Load initial data
  useEffect(() => {
    console.log("🔍 BeginTreatmentWizard mounted with patientId:", patientId);
    if (patientId) {
      loadBeginTreatmentData();
    } else {
      console.error("❌ No patientId found in URL params");
    }
  }, [patientId]);

  const loadBeginTreatmentData = async () => {
    try {
      console.log(
        "🔄 Starting to load begin treatment data for patientId:",
        patientId
      );
      setLoading(true);
      const data = await getBeginTreatmentData(patientId!);
      console.log("✅ Begin treatment data loaded successfully:", data);
      setBeginTreatmentData(data);

      // Set default values from loaded data
      if (data.therapists.length > 0) {
        methods.setValue("primaryTherapistId", data.therapists[0].id);
      }
      if (data.referringDoctors.length > 0) {
        methods.setValue("referringDoctorId", data.referringDoctors[0].id);
      }
    } catch (error) {
      console.error("❌ Error loading begin treatment data:", error);
      handleFormError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    console.log("🔄 handleNext called for step:", step);

    const currentStepName = STEPS[step];
    let fieldsToValidate: string[] = [];
    let isValid = true;

    switch (currentStepName) {
      case "Select Diagnoses":
        fieldsToValidate = ["diagnoses"];
        break;
      case "Select Complaints":
        fieldsToValidate = ["complaints"];
        break;
      case "Choose Treatment Plan":
        fieldsToValidate = [
          "planType",
          "packageCode",
          "numberOfSessions",
          "primaryTherapistId",
          "referringDoctorId",
          "startDate",
          "targetFreqPerWeek",
        ];
        break;
      case "Request Discount (Optional)":
        fieldsToValidate = ["discountRequest"];
        break;
    }

    try {
      isValid = await methods.trigger(fieldsToValidate as any);
      console.log("isValid", fieldsToValidate);
    } catch (error) {
      console.log("error catch", error);
      isValid = false;
    }

    if (isValid) {
      methods.clearErrors();
      const nextStep = Math.min(step + 1, STEPS.length - 1);
      setStep(nextStep);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFinish = async () => {
    console.log("🔄 handleFinish called - validating entire form");

    try {
      setLoading(true);
      clearAllErrors();

      // Use full schema validation for final submission
      const isValid = await methods.trigger();
      if (!isValid) {
        console.log("❌ Final validation failed");
        return;
      }

      const formData = methods.getValues();
      console.log(
        "✅ Final validation passed, submitting form data:",
        formData
      );

      await beginTreatment(formData);

      // Navigate to patient details page
      navigate(all_routes.patientDetails.replace(":id", patientId!));
    } catch (error) {
      console.error("❌ Error during form submission:", error);
      handleFormError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (!beginTreatmentData) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading treatment data...</span>
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <Step1DiagnosisSelector
            diagnoses={beginTreatmentData.diagnoses}
            onDiagnosesChange={(diagnoses) =>
              methods.setValue("diagnoses", diagnoses)
            }
          />
        );
      case 1:
        return (
          <Step2Complaints
            onComplaintsChange={(complaints) =>
              methods.setValue("complaints", complaints)
            }
          />
        );
      case 2:
        return (
          <Step3PlanSelection
            packages={beginTreatmentData.packages}
            therapists={beginTreatmentData.therapists}
            referringDoctors={beginTreatmentData.referringDoctors}
            onPlanChange={(planData) => {
              methods.setValue("planType", planData.planType);
              methods.setValue("packageCode", planData.packageCode);
              methods.setValue("numberOfSessions", planData.numberOfSessions);
              methods.setValue(
                "primaryTherapistId",
                planData.primaryTherapistId
              );
              methods.setValue("referringDoctorId", planData.referringDoctorId);
              methods.setValue(
                "startDate",
                new Date().toISOString().split("T")[0]
              ); // Always use current date
              methods.setValue("targetFreqPerWeek", planData.targetFreqPerWeek);
            }}
          />
        );
      case 3:
        return (
          <Step4DiscountRequest
            onDiscountChange={(discount) =>
              methods.setValue("discountRequest", discount)
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-0">
                Begin Treatment
                <span className="badge badge-soft-success fw-medium border py-1 px-2 border-success fs-13 ms-2">
                  Step {step + 1} of {STEPS.length}
                </span>
              </h4>
              <p className="text-muted mb-0 mt-1">
                Create a new treatment plan for patient #{patientId}
              </p>
            </div>
            <div className="text-end d-flex">
              <Link
                to={all_routes.patientDetails.replace(":id", patientId!)}
                className="btn btn-outline-secondary me-2 fs-13 btn-md"
              >
                <i className="ti ti-arrow-left me-1" />
                Back to Patient
              </Link>
            </div>
          </div>

          {/* General Error Display */}
          {generalError && (
            <div className="mb-4">
              <SmartError
                error={generalError}
                onDismiss={clearAllErrors}
                showSuggestions={true}
                showRetryButton={true}
                onRetry={() => {
                  clearAllErrors();
                  if (step === 0) {
                    loadBeginTreatmentData();
                  }
                }}
              />
            </div>
          )}

          <div className="d-flex justify-content-center">
            <div className="col-lg-12">
              <FormProvider {...methods}>
                <Wizard
                  steps={STEPS}
                  activeStep={step}
                  onBack={handleBack}
                  onNext={handleNext}
                  onFinish={handleFinish}
                  loading={loading}
                >
                  {renderStep()}
                </Wizard>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
