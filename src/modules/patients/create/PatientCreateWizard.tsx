import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Wizard from "../../../core/components/Wizard/Wizard";
import StepPersonal from "./steps/StepPersonal";
import StepMedical from "./steps/StepMedical";
import StepInsurance from "./steps/StepInsurance";
import StepAttachments from "./steps/StepAttachments";
import StepReview from "./steps/StepReview";

import { fullSchema, type FullPayload } from "./schema";
import {
  createPatient,
  upsertInsurance,
  createTreatmentPlan,
  uploadAttachments,
} from "./api";

export default function PatientCreateWizard() {
  const navigate = useNavigate();
  const methods = useForm<FullPayload>({
    resolver: zodResolver(fullSchema),
    mode: "onBlur",
    defaultValues: {
      personal: { gender: "MALE", bloodGroup: "O+" },
      medical: {
        diagnoses: [],
        allergies: [],
        medicalHistory: [],
        extraCare: false,
        hasInsurance: false,
      },
      insurance: {},
      attachments: { files: [] as any },
      plan: { planType: "PHYSIO_STANDARD", sessionType: "", sessionsCount: 10 },
    },
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Watch the hasInsurance field to determine if insurance step should be shown
  const hasInsurance = methods.watch("medical.hasInsurance");

  // Dynamic steps array based on insurance requirement
  const allSteps = ["Personal", "Medical", "Insurance", "Attachments", "Review"];
  const steps = hasInsurance 
    ? allSteps 
    : allSteps.filter(step => step !== "Insurance");

  // Handle step transitions when insurance requirement changes
  useEffect(() => {
    const currentStepName = steps[step];
    
    // If we're currently on the insurance step but insurance is disabled, move to next step
    if (currentStepName === "Insurance" && !hasInsurance) {
      setStep(step + 1);
    }
    // If insurance is enabled and we're on attachments step, we might need to adjust
    else if (hasInsurance && currentStepName === "Attachments" && step === 2) {
      // We're on attachments but should be on insurance, move back
      setStep(step - 1);
    }
  }, [hasInsurance, step, steps]);

  const goNext = async () => {
    // validate current step only
    // const ok = await methods.trigger();
    if (true) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const finish = methods.handleSubmit(async (values) => {
    setLoading(true);
    try {
      const { id: patientId } = await createPatient(
        values.personal,
        values.medical
      );
      await upsertInsurance(patientId, values.insurance);
      await uploadAttachments(
        patientId,
        (values.attachments?.files || []).map((x: any) => x.file)
      );
      const plan = await createTreatmentPlan(patientId, values.plan);
      navigate(`/patients/${patientId}?plan=${plan.id}`);
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="page-wrapper">
        <div className="content">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="mb-4">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  Create Patient
                </h6>
              </div>

              <Wizard
                steps={steps}
                activeStep={step}
                onBack={goBack}
                onNext={goNext}
                onFinish={finish}
                loading={loading}
              >
                {step === 0 && <StepPersonal />}
                {step === 1 && <StepMedical />}
                {step === 2 && <StepInsurance />}
                {step === 3 && <StepAttachments />}
                {step === 4 && <StepReview />}
              </Wizard>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
