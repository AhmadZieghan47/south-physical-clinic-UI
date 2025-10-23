import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { PackageOption, AppUser, ReferringDoctor } from "../schema";

interface Step3PlanSelectionProps {
  packages: PackageOption[];
  therapists: AppUser[];
  referringDoctors: ReferringDoctor[];
  onPlanChange: (planData: {
    planType: "PAY_PER_VISIT" | "PACKAGE";
    packageCode: string;
    numberOfSessions: number;
    primaryTherapistId: string;
    referringDoctorId: string;
    startDate: string;
    targetFreqPerWeek: number;
  }) => void;
}

export default function Step3PlanSelection({
  packages,
  therapists,
  referringDoctors,
  onPlanChange,
}: Step3PlanSelectionProps) {
  const { watch } = useFormContext();

  const [planType, setPlanType] = useState<"PAY_PER_VISIT" | "PACKAGE">(
    "PACKAGE"
  );
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(
    null
  );
  const [numberOfSessions, setNumberOfSessions] = useState(1);
  const [primaryTherapistId, setPrimaryTherapistId] = useState("");
  const [referringDoctorId, setReferringDoctorId] = useState("");
  const [targetFreqPerWeek, setTargetFreqPerWeek] = useState(1);

  const watchedData = watch();

  useEffect(() => {
    // Initialize from form values
    if (watchedData.planType) setPlanType(watchedData.planType);
    if (watchedData.packageCode) {
      const pkg = packages.find((p) => p.code === watchedData.packageCode);
      if (pkg) setSelectedPackage(pkg);
    }
    if (watchedData.numberOfSessions)
      setNumberOfSessions(watchedData.numberOfSessions);
    if (watchedData.primaryTherapistId)
      setPrimaryTherapistId(watchedData.primaryTherapistId);
    if (watchedData.referringDoctorId)
      setReferringDoctorId(watchedData.referringDoctorId);
    if (watchedData.targetFreqPerWeek)
      setTargetFreqPerWeek(watchedData.targetFreqPerWeek);
  }, []);

  useEffect(() => {
    // Update form when local state changes
    const planData = {
      planType,
      packageCode: selectedPackage?.code || "",
      numberOfSessions,
      primaryTherapistId,
      referringDoctorId,
      startDate: new Date().toISOString().split("T")[0], // Always use current date
      targetFreqPerWeek,
    };

    onPlanChange(planData);
  }, [
    planType,
    selectedPackage,
    numberOfSessions,
    primaryTherapistId,
    referringDoctorId,
    targetFreqPerWeek,
  ]);

  const handlePlanTypeChange = (type: "PAY_PER_VISIT" | "PACKAGE") => {
    setPlanType(type);
    if (type === "PAY_PER_VISIT") {
      setSelectedPackage(null);
    }
  };

  const handlePackageSelect = (pkg: PackageOption) => {
    setSelectedPackage(pkg);
  };

  const handleNumberOfSessionsChange = (count: number) => {
    setNumberOfSessions(count);
  };

  return (
    <div className="row">
      <div className="col-12">
        <h5 className="mb-3">Choose Treatment Plan</h5>

        {/* Plan Type Selection */}
        <div className="mb-4">
          <div className="row">
            <div className="col-md-3">
              <h6>Plan Type</h6>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${
                    planType === "PACKAGE"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handlePlanTypeChange("PACKAGE")}
                >
                  Package Plan
                </button>
                <button
                  type="button"
                  className={`btn ${
                    planType === "PAY_PER_VISIT"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handlePlanTypeChange("PAY_PER_VISIT")}
                >
                  Pay Per Visit
                </button>
              </div>
            </div>
            <div className="col-md-9">
              {planType === "PACKAGE" && (
                <div className="form-group">
                  <h6 className="form-label">Choose Package</h6>
                  <select
                    className="form-control"
                    value={selectedPackage?.code || ""}
                    onChange={(e) => {
                      const selectedPkg = packages.find(
                        (pkg) => pkg.code === e.target.value
                      );
                      if (selectedPkg) {
                        handlePackageSelect(selectedPkg);
                      }
                    }}
                  >
                    <option value="">Select a package</option>
                    {packages.map((pkg) => (
                      <option key={pkg.code} value={pkg.code}>
                        {pkg.nameEn} - ${pkg.totalPrice}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Package Selection (only for PACKAGE type) */}

        {/* Number of Sessions and Target Frequency */}
        <div className="mb-4">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Total Sessions</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="100"
                  value={numberOfSessions}
                  onChange={(e) =>
                    handleNumberOfSessionsChange(parseInt(e.target.value) || 1)
                  }
                />
                <small className="form-text text-muted">
                  Enter the total number of sessions for this treatment plan
                </small>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Sessions Frequency</label>
                <select
                  className="form-control"
                  value={targetFreqPerWeek}
                  onChange={(e) =>
                    setTargetFreqPerWeek(parseInt(e.target.value))
                  }
                >
                  <option value={1}>1 session per week</option>
                  <option value={2}>2 sessions per week</option>
                  <option value={3}>3 sessions per week</option>
                  <option value={4}>4 sessions per week</option>
                  <option value={5}>5 sessions per week</option>
                </select>
                <small className="form-text text-muted">
                  How many sessions per week for this treatment plan
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Details */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Primary Therapist</label>
              <select
                className="form-control"
                value={primaryTherapistId}
                onChange={(e) => setPrimaryTherapistId(e.target.value)}
              >
                <option value="">Select Therapist</option>
                {therapists.map((therapist) => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Referring Doctor</label>
              <select
                className="form-control"
                value={referringDoctorId}
                onChange={(e) => setReferringDoctorId(e.target.value)}
              >
                <option value="">Select Doctor</option>
                {referringDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.nameEn}{" "}
                    {doctor.specialtyEn && `(${doctor.specialtyEn})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card bg-light">
          <div className="card-body">
            <h6>Plan Summary</h6>
            <div className="row">
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Plan Type:</strong> {planType}
                </p>
                {selectedPackage && (
                  <p className="mb-1">
                    <strong>Package:</strong> {selectedPackage.nameEn}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Total Sessions:</strong> {numberOfSessions}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Target Frequency:</strong> {targetFreqPerWeek} per
                  week
                </p>
                <p className="mb-1">
                  <strong>Start Date:</strong> {new Date().toLocaleDateString()}
                </p>
                {selectedPackage && (
                  <p className="mb-1">
                    <strong>Package Price:</strong> $
                    {selectedPackage.totalPrice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
