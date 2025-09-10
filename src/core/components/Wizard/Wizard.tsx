import React from "react";

type WizardProps = {
  steps: string[];
  activeStep: number;
  onBack?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  loading?: boolean;
  children: React.ReactNode;
};

export default function Wizard({
  steps,
  activeStep,
  onBack,
  onNext,
  onFinish,
  loading,
  children,
}: WizardProps) {
  const last = activeStep === steps.length - 1;

  return (
    <div className="card">
      <div className="card-body">
        {/* Stepper */}
        <ol className="list-unstyled d-flex flex-wrap mb-4 gap-3">
          {steps.map((s, i) => (
            <li
              key={s}
              className={`px-3 py-2 rounded border ${
                i === activeStep ? "bg-primary text-white" : "bg-light"
              }`}
            >
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        {/* Content */}
        <div className="mb-4">{children}</div>

        {/* Actions */}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-light"
            onClick={onBack}
            disabled={activeStep === 0 || loading}
          >
            Back
          </button>
          {!last ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNext}
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onFinish}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Patient & Plan"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
