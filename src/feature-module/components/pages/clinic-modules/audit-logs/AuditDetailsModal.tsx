import React from "react";
import type { AuditLog } from "@/types/typedefs";

interface AuditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLog: AuditLog | null;
}

const AuditDetailsModal: React.FC<AuditDetailsModalProps> = ({
  isOpen,
  onClose,
  auditLog,
}) => {
  if (!isOpen || !auditLog) return null;

  const formatDetails = (details: any) => {
    if (!details) return "No details available";

    if (typeof details === "object") {
      return JSON.stringify(details, null, 2);
    }

    return String(details);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose} />

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="ti ti-file-text me-2" />
                Audit Log Details
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Timestamp</label>
                    <p className="form-control-plaintext">
                      {new Date(auditLog.ts).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">User ID</label>
                    <p className="form-control-plaintext">
                      {auditLog.userId || "System"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <p className="form-control-plaintext">
                      {auditLog.role ? (
                        <span className="badge badge-soft-info">
                          {auditLog.role}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Action</label>
                    <p className="form-control-plaintext">
                      <span className="badge badge-soft-primary">
                        {auditLog.action}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Entity</label>
                    <p className="form-control-plaintext">
                      <span className="badge badge-soft-secondary">
                        {auditLog.entity}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Entity ID</label>
                    <p className="form-control-plaintext">
                      <code>{auditLog.entityId}</code>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Details</label>
                <div className="border rounded p-3 bg-light">
                  <pre
                    className="mb-0 small text-muted"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {formatDetails(auditLog.details)}
                  </pre>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditDetailsModal;
