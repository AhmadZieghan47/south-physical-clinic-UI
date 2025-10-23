import { useFormContext } from "react-hook-form";
import type { FullPayload } from "../schema";

export default function StepReview() {
  const { getValues } = useFormContext<FullPayload>();
  const v = getValues();

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatGender = (gender: string) => {
    const labels: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };
    return labels[gender] || gender;
  };

  return (
    <div className="step-content">
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-2">Review Patient Information</h5>
        <p className="text-muted mb-0">
          Please review the patient information before creating the record.
        </p>
      </div>

      <div className="card">
        <div className="card-header bg-light">
          <h6 className="fw-bold mb-0">Patient Summary</h6>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Personal Information */}
            <div className="col-lg-6">
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="ti ti-user me-2" />
                  Personal Information
                </h6>
                <div className="ps-3">
                  <p className="mb-1">
                    <strong>Name:</strong>{" "}
                    {v.personal.firstName && v.personal.lastName
                      ? `${v.personal.firstName} ${v.personal.lastName}`
                      : "Not provided"}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong>{" "}
                    {v.personal.phone || "Not provided"}
                  </p>
                  <p className="mb-1">
                    <strong>Date of Birth:</strong>{" "}
                    {formatDate(v.personal.dob)}
                  </p>
                  <p className="mb-1">
                    <strong>Gender:</strong>{" "}
                    {formatGender(v.personal.gender)}
                  </p>
                  <p className="mb-1">
                    <strong>Blood Group:</strong>{" "}
                    {v.personal.bloodGroup || "Not provided"}
                  </p>
                  <p className="mb-0">
                    <strong>National ID:</strong>{" "}
                    {v.personal.nationalId || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="col-lg-6">
              <div className="mb-4">
                <h6 className="fw-bold text-primary mb-2">
                  <i className="ti ti-stethoscope me-2" />
                  Medical Information
                </h6>
                <div className="ps-3">
                  <p className="mb-1">
                    <strong>Medical History:</strong>{" "}
                    {v.medical.medicalHistory && v.medical.medicalHistory.length > 0
                      ? v.medical.medicalHistory.join(", ")
                      : "None recorded"}
                  </p>
                  <p className="mb-1">
                    <strong>Orthopedic Implants:</strong>{" "}
                    {v.medical.orthopedicImplants && v.medical.orthopedicImplants.length > 0
                      ? v.medical.orthopedicImplants.join(", ")
                      : "None recorded"}
                  </p>
                  <p className="mb-1">
                    <strong>Extra Care:</strong>{" "}
                    <span className={`badge badge-soft-${v.medical.extraCare ? "success" : "secondary"} fs-13 fw-medium`}>
                      {v.medical.extraCare ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="mb-0">
                    <strong>Insurance Status:</strong>{" "}
                    <span className={`badge badge-soft-${v.medical.hasInsurance ? "primary" : "secondary"} fs-13 fw-medium`}>
                      {v.medical.hasInsurance ? "Has Insurance" : "No Insurance"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Information - Only show if hasInsurance is true */}
          {v.medical.hasInsurance && (
            <div className="row">
              <div className="col-12">
                <div className="mb-4">
                  <h6 className="fw-bold text-primary mb-2">
                    <i className="ti ti-shield-check me-2" />
                    Insurance Information
                  </h6>
                  <div className="ps-3">
                    <div className="row">
                      <div className="col-lg-6">
                        <p className="mb-1">
                          <strong>Insurer Company:</strong>{" "}
                          {v.insurance?.insurerCompany || "Not selected"}
                        </p>
                        <p className="mb-1">
                          <strong>Coverage Percentage:</strong>{" "}
                          {v.insurance?.coveragePercent !== undefined && v.insurance?.coveragePercent !== null
                            ? `${v.insurance.coveragePercent}%`
                            : "Not provided"}
                        </p>
                      </div>
                      <div className="col-lg-6">
                        <p className="mb-1">
                          <strong>Approval Number:</strong>{" "}
                          {v.insurance?.approvalNumber || "Not provided"}
                        </p>
                        <p className="mb-0">
                          <strong>Expiry Date:</strong>{" "}
                          {v.insurance?.expiryDate ? formatDate(v.insurance.expiryDate) : "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attachments */}
          {v.attachments?.files && v.attachments.files.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="mb-0">
                  <h6 className="fw-bold text-primary mb-2">
                    <i className="ti ti-paperclip me-2" />
                    Attachments
                  </h6>
                  <div className="ps-3">
                    <p className="mb-1">
                      <strong>Files:</strong> {v.attachments.files.length} file(s) selected
                    </p>
                    <div className="mt-2">
                      {v.attachments.files.map((file: any, index: number) => (
                        <span key={index} className="badge badge-soft-info me-2 mb-1">
                          <i className="ti ti-file me-1" />
                          {file.name}
                        </span>
                      ))}
                    </div>
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
                  v.personal.firstName && v.personal.lastName ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${v.personal.firstName && v.personal.lastName ? "check" : "x"} me-2`}
                />
                Name provided
              </li>
              <li
                className={`mb-1 ${
                  v.personal.phone ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${v.personal.phone ? "check" : "x"} me-2`}
                />
                Phone number provided
              </li>
              <li
                className={`mb-1 ${
                  v.personal.dob ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${v.personal.dob ? "check" : "x"} me-2`}
                />
                Date of birth provided
              </li>
              <li
                className={`mb-1 ${
                  v.personal.gender ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${v.personal.gender ? "check" : "x"} me-2`}
                />
                Gender selected
              </li>
            </ul>
          </div>
          <div className="col-lg-6">
            <ul className="list-unstyled mb-0">
              <li
                className={`mb-1 ${
                  !v.medical.hasInsurance || (v.medical.hasInsurance && v.insurance?.insurerCompany && v.insurance?.coveragePercent)
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${
                    !v.medical.hasInsurance || (v.medical.hasInsurance && v.insurance?.insurerCompany && v.insurance?.coveragePercent)
                      ? "check"
                      : "x"
                  } me-2`}
                />
                Insurance information {v.medical.hasInsurance ? "complete" : "not required"}
              </li>
              <li
                className={`mb-1 ${
                  v.medical.medicalHistory !== undefined ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${v.medical.medicalHistory !== undefined ? "check" : "x"} me-2`}
                />
                Medical history recorded
              </li>
              <li
                className={`mb-1 ${
                  v.medical.orthopedicImplants !== undefined ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${v.medical.orthopedicImplants !== undefined ? "check" : "x"} me-2`}
                />
                Orthopedic implants recorded
              </li>
              <li
                className={`mb-1 ${
                  v.attachments?.files !== undefined ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`ti ti-${v.attachments?.files !== undefined ? "check" : "x"} me-2`}
                />
                Attachments {v.attachments?.files && v.attachments.files.length > 0 ? "uploaded" : "optional"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
