import type { PlanRow } from "../tables/PlansTable";
import type { Patient } from "@/types/typedefs";

interface PlanCardProps {
  plan: PlanRow;
  patient: Patient;
}

const getStatusBadgeClass = (status: string) => {
  const k = status.toLowerCase();
  if (k.includes("discharged")) return "badge-soft-danger text-danger";
  if (k.includes("active")) return "badge-soft-success text-success";
  if (k.includes("pending")) return "badge-soft-warning text-warning";
  return "badge-soft-info text-info";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPlanTypeLabel = (planType: string): string => {
  switch (planType) {
    case "PAY_PER_VISIT":
      return "Pay Per Visit";
    case "PACKAGE":
      return "Package Plan";
    default:
      return planType;
  }
};

const getPriceBasisLabel = (priceBasis: string): string => {
  switch (priceBasis) {
    case "PER_VISIT":
      return "Per Visit";
    case "PACKAGE_RATE":
      return "Package Rate";
    default:
      return priceBasis;
  }
};

const getPackagePrice = (planType: string, priceBasis: string): string => {
  // This would typically come from a pricing service or database
  // For now, we'll use placeholder values based on plan type
  if (planType === "PACKAGE" && priceBasis === "PACKAGE_RATE") {
    return "450 JOD"; // Example package price
  } else if (planType === "PAY_PER_VISIT" && priceBasis === "PER_VISIT") {
    return "75 JOD/session"; // Example per visit price
  }
  return "Contact for pricing";
};

export default function PlanCard({ plan, patient }: PlanCardProps) {
  const progressPercentage = plan.totalSessions
    ? Math.round(
        ((plan.totalSessions - plan.remainingSessions) / plan.totalSessions) *
          100
      )
    : 0;

  const completedSessions = plan.totalSessions
    ? plan.totalSessions - plan.remainingSessions
    : 0;

  return (
    <div className="card plan-card-enhanced">
      {/* Header */}
      <div className="plan-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="plan-title-section">
            <h3 className="plan-title">
              <i className="ti ti-clipboard-list me-2"></i>
              Treatment Plan
            </h3>
            <p className="plan-subtitle">{getPlanTypeLabel(plan.planType)}</p>
          </div>
          <div className="plan-status-section">
            <span
              className={`plan-status-badge ${getStatusBadgeClass(
                plan.status
              )}`}
            >
              {plan.status}
            </span>
            <div className="plan-price">
              {getPackagePrice(plan.planType, plan.priceBasis)}
            </div>
          </div>
        </div>
      </div>

      <div className="plan-body">
        {/* Progress Section - Prominent Display */}
        {plan.totalSessions && (
          <div className="progress-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="progress-title mb-0">
                <i className="ti ti-chart-line me-2"></i>
                Session Progress
              </h5>
              <div className="progress-stats">
                <span className="progress-percentage">
                  {progressPercentage}%
                </span>
                <span className="progress-text">Complete</span>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress progress-enhanced">
                <div
                  className="progress-bar progress-bar-enhanced"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <div className="progress-labels">
                <span className="progress-label-start">0</span>
                <span className="progress-label-end">{plan.totalSessions}</span>
              </div>
            </div>

            <div className="progress-details">
              <div className="row text-center">
                <div className="col-4">
                  <div className="progress-stat">
                    <span className="stat-number text-success">
                      {completedSessions}
                    </span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="progress-stat">
                    <span
                      className={`stat-number ${
                        plan.remainingSessions <= 5
                          ? "text-warning"
                          : "text-primary"
                      }`}
                    >
                      {plan.remainingSessions}
                    </span>
                    <span className="stat-label">Remaining</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="progress-stat">
                    <span className="stat-number text-info">
                      {plan.targetFreqPerWeek}
                    </span>
                    <span className="stat-label">Per Week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Information Section */}
        <div className="medical-info-section">
          <h5 className="section-title">
            <i className="ti ti-stethoscope me-2"></i>
            Medical Information
          </h5>

          <div className="row">
            {/* Diagnosis */}
            <div className="col-md-6">
              <div className="info-card diagnosis-card">
                <h6 className="info-card-title">
                  <i className="ti ti-clipboard-check me-2"></i>
                  Diagnosis
                </h6>
                {plan.diagnoses && plan.diagnoses.length > 0 ? (
                  <div className="diagnosis-list">
                    {plan.diagnoses.map((diagnosis, _index) => (
                      <div key={diagnosis.id} className="diagnosis-item">
                        <div className="diagnosis-name">
                          {diagnosis.nameEn}
                          {diagnosis.isPrimary && (
                            <span className="badge badge-soft-primary ms-2">
                              Primary
                            </span>
                          )}
                        </div>
                        {diagnosis.notesEn && (
                          <div className="diagnosis-notes text-muted small">
                            {diagnosis.notesEn}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : plan.initialDxTextEn ? (
                  <p className="diagnosis-text">{plan.initialDxTextEn}</p>
                ) : plan.initialDxTextAr ? (
                  <p className="diagnosis-text">{plan.initialDxTextAr}</p>
                ) : (
                  <p className="text-muted">No diagnosis recorded</p>
                )}
              </div>
            </div>

            {/* Main Complaint */}
            <div className="col-md-6">
              <div className="info-card complaint-card">
                <h6 className="info-card-title">
                  <i className="ti ti-alert-circle me-2"></i>
                  Main Complaint
                </h6>
                {plan.complaints && plan.complaints.length > 0 ? (
                  <div className="complaint-list">
                    {plan.complaints.map((complaintText, index) => (
                      <div key={index} className="complaint-item">
                        <div className="complaint-name">{complaintText}</div>
                      </div>
                    ))}
                  </div>
                ) : patient.notes ? (
                  <p className="complaint-text">{patient.notes}</p>
                ) : (
                  <p className="text-muted">No main complaint recorded</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plan Details Section */}
        <div className="plan-details-section">
          <h5 className="section-title">
            <i className="ti ti-settings me-2"></i>
            Plan Details
          </h5>

          <div className="row">
            <div className="col-md-6">
              <div className="detail-item">
                <label className="detail-label">Package Code</label>
                <span className="detail-value">
                  {plan.packageCode || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <label className="detail-label">Price Basis</label>
                <span className="detail-value">
                  {getPriceBasisLabel(plan.priceBasis)}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-item">
                <label className="detail-label">Start Date</label>
                <span className="detail-value">
                  {formatDate(plan.startDate)}
                </span>
              </div>
              <div className="detail-item">
                <label className="detail-label">Frequency Advisory</label>
                <span className="detail-value">
                  {plan.freqAdvisory2w
                    ? "2-week advisory active"
                    : "Standard frequency"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Information */}
        {plan.insuranceReferralAuth && (
          <div className="insurance-section">
            <div className="insurance-card">
              <h6 className="insurance-title">
                <i className="ti ti-shield-check me-2"></i>
                Insurance Coverage
              </h6>
              <div className="insurance-details">
                <span className="insurance-auth">
                  {plan.insuranceReferralAuth}
                </span>
                <span className="insurance-status">Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
