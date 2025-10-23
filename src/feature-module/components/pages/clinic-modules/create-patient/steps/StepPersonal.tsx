import RHFText from "@/core/components/Form/RHFText";
import RHFDate from "@/core/components/Form/RHFDate";
import RHFSelect from "@/core/components/Form/RHFSelect";
import RHFCheckbox from "@/core/components/Form/RHFCheckbox";
import { useFormContext } from "react-hook-form";
import { useInsurers } from "@/hooks/useInsurers";

const genderOpts = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export default function StepPersonal() {
  const methods = useFormContext();
  const { insurers, loading, error } = useInsurers();
  
  // Watch the hasInsurance field to show/hide insurance details
  const hasInsurance = methods.watch("medical.hasInsurance");

  // Transform insurers data for the select component
  const insurerOptions = insurers.map((insurer) => ({
    label: insurer.nameEn,
    value: insurer.id,
  }));

  return (
    <div className="step-content">
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-2">Personal Information</h5>
        <p className="text-muted mb-0">
          Please provide the patient's basic personal information.
        </p>
      </div>
      <div className="row">
        <div className="col-md-6">
          <RHFText name="personal.firstName" label="First Name *" />
        </div>
        <div className="col-md-6">
          <RHFText name="personal.lastName" label="Last Name *" />
        </div>
        <div className="col-md-6">
          <RHFText name="personal.phone" label="Phone Number *" type="tel" />
        </div>
        <div className="col-md-6">
          <RHFDate name="personal.dob" label="DOB *" placeholder="YYYY-MM-DD" />
        </div>
        <div className="col-md-6">
          <RHFSelect
            name="personal.gender"
            label="Gender *"
            options={genderOpts}
            placeholder="Select"
          />
        </div>
        <div className="col-md-6">
          <RHFText name="personal.nationalId" label="National ID" />
        </div>
        <div className="col-xl-6">
          <RHFCheckbox
            className="important-switch"
            name="medical.hasInsurance"
            label="Has Insurance"
            variant="switch"
          />
        </div>
      </div>

      {/* Insurance Details Section - Conditionally Rendered */}
      {hasInsurance && (
        <div className="mt-4 pt-4 border-top">
          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-2">Insurance Information</h6>
            <p className="text-muted mb-0">
              Please provide the patient's insurance information.
            </p>
          </div>
          
          {loading ? (
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading insurers...</span>
              </div>
              <span className="ms-2">Loading insurers...</span>
            </div>
          ) : error ? (
            <div className="alert alert-warning mb-3" role="alert">
              <h6 className="alert-heading">Unable to load insurers</h6>
              <p className="mb-0">{error}</p>
              <small>
                Please contact your administrator to add insurers to the system.
              </small>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <RHFSelect
                  name="insurance.insurerCompany"
                  label="Insurer Company *"
                  options={insurerOptions}
                  placeholder="Select insurer"
                />
                {insurerOptions.length === 0 && (
                  <small className="text-muted">
                    No insurers available. Please contact your administrator.
                  </small>
                )}
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-medium">Coverage *</label>
                  <div className="input-group">
                    <input
                      max={100}
                      min={0}
                      type="number"
                      className={`form-control ${
                        methods.formState.errors.insurance &&
                        "coveragePercent" in methods.formState.errors.insurance
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter coverage percentage"
                      {...methods.register("insurance.coveragePercent", {
                        valueAsNumber: true,
                        validate: (value) => {
                          // Handle NaN case (empty input)
                          if (isNaN(value)) {
                            return "Coverage percentage is required";
                          }
                          if (value < 1 || value > 100) {
                            return "Coverage must be between 1-100";
                          }
                          return true;
                        },
                      })}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                  {methods.formState.errors.insurance &&
                    "coveragePercent" in methods.formState.errors.insurance && (
                      <div className="invalid-feedback d-block">
                        {
                          (methods.formState.errors.insurance as any).coveragePercent
                            ?.message
                        }
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6">
                <RHFText name="insurance.approvalNumber" label="Approval Number" />
              </div>
              <div className="col-md-6">
                <RHFDate name="insurance.expiryDate" label="Insurance Expiry" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
