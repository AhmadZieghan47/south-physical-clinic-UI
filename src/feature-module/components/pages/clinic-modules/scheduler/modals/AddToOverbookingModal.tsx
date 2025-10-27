import React, { useState } from "react";
import { SchedulerAPI } from "../api";
import type { CreateOverbookPayload } from "../types";
import type { PriorityT } from "@/types/typedefs";
import PatientSelector from "@/core/components/PatientSelector";
import { createModuleApi } from "@/lib/enhancedApi";

interface AddToOverbookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// API client for fetching patients
const patientsApi = createModuleApi("PatientsModule", {
  context: { component: "PatientSelector" },
});

const AddToOverbookingModal: React.FC<AddToOverbookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [patientId, setPatientId] = useState("");
  const [_patientName, setPatientName] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<PriorityT>("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    const response = await patientsApi.get<{ data: any[] }>("/patients", {
      params: { pageSize: 100, isActive: true },
    });
    return response.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId) {
      setError("Please select a patient");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateOverbookPayload = {
        patientId,
        reason: reason || undefined,
        extraCare: priority === "HIGH", // Map priority to extraCare for backend
        preferredTherapistId: null,
      };

      await SchedulerAPI.addOverbook(payload);
      
      // Reset form
      setPatientId("");
      setPatientName("");
      setReason("");
      setPriority("MEDIUM");
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to add to overbooking queue:", err);
      setError("Failed to add patient to queue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (id: string, name: string) => {
    setPatientId(id);
    setPatientName(name);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add to Overbooking Queue</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <PatientSelector
              value={patientId}
              onChange={handlePatientChange}
              error={error || undefined}
              disabled={loading}
              label="Patient"
              required={true}
              fetchPatients={fetchPatients}
            />

            <div className="form-group">
              <label htmlFor="priority" className="form-label mb-1 fw-medium">
                Priority <span className="text-danger">*</span>
              </label>
              <select
                id="priority"
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityT)}
                required
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
              <small className="text-muted">
                High priority patients will be placed first in auto-assign
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="reason" className="form-label mb-1 fw-medium">
                Reason (optional)
              </label>
              <textarea
                id="reason"
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Why is this patient being added to the queue?"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add to Queue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToOverbookingModal;



