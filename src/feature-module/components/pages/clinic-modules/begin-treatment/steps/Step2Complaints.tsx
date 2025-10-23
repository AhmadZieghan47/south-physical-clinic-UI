import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface Step2ComplaintsProps {
  onComplaintsChange: (complaints: string[]) => void;
}

export default function Step2Complaints({
  onComplaintsChange,
}: Step2ComplaintsProps) {
  const { watch, setValue } = useFormContext();
  const [complaints, setComplaints] = useState<string[]>([]);

  const watchedComplaints = watch("complaints") || [];

  useEffect(() => {
    setComplaints(watchedComplaints);
  }, [watchedComplaints]);

  const addComplaint = () => {
    const newComplaints = [...complaints, ""];
    setComplaints(newComplaints);
    setValue("complaints", newComplaints);
    onComplaintsChange(newComplaints);
  };

  const removeComplaint = (index: number) => {
    const newComplaints = complaints.filter((_, i) => i !== index);
    setComplaints(newComplaints);
    setValue("complaints", newComplaints);
    onComplaintsChange(newComplaints);
  };

  const updateComplaint = (index: number, value: string) => {
    const newComplaints = complaints.map((complaint, i) =>
      i === index ? value : complaint
    );
    setComplaints(newComplaints);
    setValue("complaints", newComplaints);
    onComplaintsChange(newComplaints);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Enter Main Complaints</h5>
            <p className="text-muted mb-0 mt-1">
              Enter the main complaints that the patient is experiencing. You can add multiple complaints.
            </p>
          </div>
          <div className="card-body">
            {/* Complaints List */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">
                  Patient Complaints
                  <span className="badge badge-soft-primary fw-medium border py-1 px-2 border-primary fs-13 ms-2">
                    {complaints.length}
                  </span>
                </h6>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={addComplaint}
                >
                  <i className="ti ti-plus me-1" />
                  Add Complaint
                </button>
              </div>

              {complaints.length === 0 && (
                <div className="text-center py-4">
                  <div className="alert alert-info" role="alert">
                    <i className="ti ti-info-circle me-2" />
                    No complaints entered yet. Click "Add Complaint" to start.
                  </div>
                </div>
              )}

              {complaints.map((complaint, index) => (
                <div key={index} className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Enter complaint ${index + 1}...`}
                      value={complaint}
                      onChange={(e) => updateComplaint(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeComplaint(index)}
                      disabled={complaints.length === 1}
                    >
                      <i className="ti ti-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            {complaints.length > 0 && (
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="mb-3">Complaints Summary</h6>
                  <ul className="list-unstyled mb-0">
                    {complaints.map((complaint, index) => (
                      <li key={index} className="mb-1">
                        <i className="ti ti-circle-filled text-primary me-2" style={{ fontSize: '8px' }} />
                        {complaint || `Complaint ${index + 1} (empty)`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
