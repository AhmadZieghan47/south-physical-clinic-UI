import { useState, useEffect, useMemo, useRef } from "react";

interface Patient {
  id: string;
  fullName: string;
  phone: string;
  dob?: string;
  gender?: string;
}

interface PatientSelectorProps {
  value: string;
  onChange: (patientId: string, patientName: string) => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  fetchPatients: () => Promise<{ data: Patient[] }>;
}

export function PatientSelector({
  value,
  onChange,
  error,
  disabled = false,
  label = "Patient",
  required = true,
  fetchPatients,
}: PatientSelectorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const loadPatients = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await fetchPatients();
        setPatients(response.data || []);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setFetchError("Failed to load patients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [fetchPatients]);

  // Close dropdown when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowDropdown(true);

    // Clear selection when user types
    if (value) {
      onChange("", "");
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setShowDropdown(true);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = patients.find((p) => p.id === patientId);
    if (selectedPatient) {
      onChange(patientId, selectedPatient.fullName);
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const clearSelection = () => {
    onChange("", "");
    setSearchTerm("");
    setShowDropdown(false);
  };

  const selectedPatient = patients.find((p) => p.id === value);
  const displayValue = selectedPatient
    ? `${selectedPatient.fullName} - ${selectedPatient.phone}`
    : searchTerm;

  return (
    <div className="mb-3">
      <label className="form-label mb-1 fw-medium">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {loading ? (
        <div className="form-control d-flex align-items-center justify-content-center py-3">
          <div className="spinner-border spinner-border-sm me-2" />
          Loading patients...
        </div>
      ) : fetchError ? (
        <div className="alert alert-danger">{fetchError}</div>
      ) : (
        <div className="position-relative" ref={dropdownRef}>
          <div className="input-group">
            <input
              type="text"
              className={`form-control ${error ? "is-invalid" : ""} ${
                disabled ? "bg-light" : ""
              }`}
              placeholder="Search patients by name, phone, or ID..."
              value={displayValue}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              disabled={disabled}
              autoComplete="off"
            />
            {value && !disabled && (
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
          {showDropdown && !disabled && (
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
                    onClick={() => handlePatientSelect(patient.id)}
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
        </div>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

export default PatientSelector;

