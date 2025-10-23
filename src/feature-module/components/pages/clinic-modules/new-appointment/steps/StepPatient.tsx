import { useState, useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";

import type { AppointmentFormData } from "../schema";
import { getPatientsForSelection } from "../api";

interface Patient {
  id: string;
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
}

interface StepPatientProps {
  isPreSelected?: boolean;
  preSelectedPatientId?: string;
}

export default function StepPatient({
  isPreSelected = false,
  preSelectedPatientId,
}: StepPatientProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AppointmentFormData>();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPatientId = watch("patientId");

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) {
      return patients;
    }

    const searchLower = searchTerm.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(searchLower) ||
        patient.phone.includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchLower)
    );
  }, [patients, searchTerm]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await getPatientsForSelection();
        const patientsData = response.data || [];
        setPatients(patientsData);

        // If patient is pre-selected, find and set the patient name
        if (isPreSelected && preSelectedPatientId) {
          const preSelectedPatient = patientsData.find(
            (p: Patient) => p.id === preSelectedPatientId
          );
          if (preSelectedPatient) {
            setValue("patientName", preSelectedPatient.fullName);
          }
        }
      } catch (err) {
        setError("Failed to load patients. Please try again.");
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [isPreSelected, preSelectedPatientId, setValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setValue("patientId", patientId);
      setValue("patientName", patient.fullName);
      // Clear plan selection when patient changes
      setValue("planId", "");
      setValue("planName", "");
      // Clear search term and close dropdown when patient is selected
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);

    // If user clears the search and there was a selected patient, clear the selection
    if (!value && selectedPatientId) {
      setValue("patientId", "");
      setValue("patientName", "");
      setValue("planId", "");
      setValue("planName", "");
    }
  };

  const handleInputFocus = () => {
    if (!isPreSelected) {
      setShowDropdown(true);
    }
  };

  const clearSelection = () => {
    setValue("patientId", "");
    setValue("patientName", "");
    setValue("planId", "");
    setValue("planName", "");
    setSearchTerm("");
    setShowDropdown(false);
  };

  return (
    <div className="step-content">
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-2">
          {isPreSelected ? "Selected Patient" : "Select Patient"}
        </h5>
        <p className="text-muted mb-0">
          {isPreSelected
            ? "The patient has been pre-selected for this appointment."
            : "Choose the patient for this appointment."}
        </p>
      </div>

      {error && (
        <div className="alert alert-danger mb-3">
          <i className="ti ti-alert-circle me-2" />
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3">
            <label className="form-label mb-1 fw-medium">
              Patient <span className="text-danger">*</span>
            </label>
            {loading ? (
              <div className="form-control d-flex align-items-center justify-content-center py-3">
                <div className="spinner-border spinner-border-sm me-2" />
                Loading patients...
              </div>
            ) : (
              <div className="position-relative" ref={dropdownRef}>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.patientId ? "is-invalid" : ""
                    } ${isPreSelected ? "bg-light" : ""}`}
                    placeholder="Search patients by name, phone, or ID..."
                    value={
                      selectedPatientId
                        ? (() => {
                            const selectedPatient = patients.find(
                              (p) => p.id === selectedPatientId
                            );
                            return selectedPatient
                              ? `${selectedPatient.fullName} - ${selectedPatient.phone}`
                              : searchTerm;
                          })()
                        : searchTerm
                    }
                    onChange={handleSearchChange}
                    onFocus={handleInputFocus}
                    disabled={isPreSelected}
                    autoComplete="off"
                  />
                  {selectedPatientId && !isPreSelected && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={clearSelection}
                      title="Clear selection"
                    >
                      <i className="ti ti-x"></i>
                    </button>
                  )}
                </div>
                {showDropdown && !isPreSelected && (
                  <div
                    className="position-absolute top-100 start-0 end-0 bg-white border border-top-0 rounded-bottom shadow-lg"
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 1000,
                    }}
                  >
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="p-2 border-bottom cursor-pointer hover-bg-light"
                          onClick={() => handlePatientChange(patient.id)}
                          style={{ cursor: "pointer" }}
                          onMouseEnter={(e) =>
                            e.currentTarget.classList.add("bg-light")
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.classList.remove("bg-light")
                          }
                        >
                          <div className="fw-medium">{patient.fullName}</div>
                          <small className="text-muted">
                            {patient.phone} • ID: {patient.id}
                          </small>
                        </div>
                      ))
                    ) : searchTerm ? (
                      <div className="p-3 text-muted text-center">
                        No patients found matching "{searchTerm}"
                      </div>
                    ) : (
                      <div className="p-3 text-muted text-center">
                        Start typing to search patients...
                      </div>
                    )}
                  </div>
                )}
                {/* Hidden input for form validation */}
                <input
                  type="hidden"
                  {...register("patientId")}
                  value={selectedPatientId || ""}
                />
              </div>
            )}
            {errors.patientId && (
              <div className="invalid-feedback">{errors.patientId.message}</div>
            )}
            {isPreSelected && (
              <div className="form-text text-info">
                <i className="ti ti-lock me-1" />
                Patient is pre-selected and cannot be changed
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPatientId && (
        <div className="card bg-light">
          <div className="card-body">
            <h6 className="fw-bold mb-2">Selected Patient</h6>
            {(() => {
              const patient = patients.find((p) => p.id === selectedPatientId);
              return patient ? (
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Name:</strong> {patient.fullName}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {patient.phone}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>DOB:</strong>{" "}
                      {new Date(patient.dob).toLocaleDateString()}
                    </p>
                    <p className="mb-0">
                      <strong>Gender:</strong> {patient.gender}
                    </p>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
