import { useState, useEffect } from "react";
import { useFormErrorHandling } from "../../../../../hooks/useErrorHandling";
import {
  SmartError,
  ErrorBoundary,
} from "../../../../../components/ErrorDisplay";
import { api } from "../../../../../lib/api";

interface Discount {
  id: string;
  scope: "APPOINTMENT" | "PLAN";
  type: "PERCENT" | "FLAT";
  value: string;
  status: "PENDING" | "APPROVED" | "DENIED" | "REVOKED";
  requestedBy: string;
  decidedBy: string | null;
  reasonEn: string;
  reasonAr: string | null;
  decisionNoteEn: string | null;
  decisionNoteAr: string | null;
  planId: string | null;
  appointmentId: string | null;
  effectiveFrom: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DiscountApprovalForm {
  decisionNoteEn: string;
  decisionNoteAr: string;
  effectiveFrom: string;
}

interface DiscountDenialForm {
  decisionNoteEn: string;
  decisionNoteAr: string;
}

export default function DiscountManagementDashboard() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDenialModal, setShowDenialModal] = useState(false);
  const [approvalForm, setApprovalForm] = useState<DiscountApprovalForm>({
    decisionNoteEn: "",
    decisionNoteAr: "",
    effectiveFrom: new Date().toISOString().split("T")[0],
  });
  const [denialForm, setDenialForm] = useState<DiscountDenialForm>({
    decisionNoteEn: "",
    decisionNoteAr: "",
  });

  const { generalError, clearAllErrors, handleFormError } =
    useFormErrorHandling({
      context: {
        component: "DiscountManagementDashboard",
        action: "discount-management",
      },
    });

  useEffect(() => {
    loadPendingDiscounts();
  }, []);

  const loadPendingDiscounts = async () => {
    try {
      setLoading(true);
      clearAllErrors();

      console.log("🔄 Loading pending discounts...");
      const response = await api.get("/discounts/pending");
      console.log("✅ Pending discounts loaded:", response.data);
      setDiscounts(response.data);
    } catch (error: any) {
      console.error("❌ Error loading pending discounts:", error);
      handleFormError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDiscount = async () => {
    if (!selectedDiscount) return;

    try {
      console.log("🔄 Approving discount:", selectedDiscount.id);
      await api.post(`/discounts/${selectedDiscount.id}/approve`, approvalForm);
      console.log("✅ Discount approved successfully");

      setShowApprovalModal(false);
      setSelectedDiscount(null);
      setApprovalForm({
        decisionNoteEn: "",
        decisionNoteAr: "",
        effectiveFrom: new Date().toISOString().split("T")[0],
      });

      await loadPendingDiscounts();
    } catch (error: any) {
      console.error("❌ Error approving discount:", error);
      handleFormError(error);
    }
  };

  const handleDenyDiscount = async () => {
    if (!selectedDiscount) return;

    try {
      console.log("🔄 Denying discount:", selectedDiscount.id);
      await api.post(`/discounts/${selectedDiscount.id}/deny`, denialForm);
      console.log("✅ Discount denied successfully");

      setShowDenialModal(false);
      setSelectedDiscount(null);
      setDenialForm({
        decisionNoteEn: "",
        decisionNoteAr: "",
      });

      await loadPendingDiscounts();
    } catch (error: any) {
      console.error("❌ Error denying discount:", error);
      handleFormError(error);
    }
  };

  const openApprovalModal = (discount: Discount) => {
    setSelectedDiscount(discount);
    setShowApprovalModal(true);
  };

  const openDenialModal = (discount: Discount) => {
    setSelectedDiscount(discount);
    setShowDenialModal(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-warning";
      case "APPROVED":
        return "bg-success";
      case "DENIED":
        return "bg-danger";
      case "REVOKED":
        return "bg-secondary";
      default:
        return "bg-light text-dark";
    }
  };

  const getTypeDisplay = (type: string, value: string) => {
    return type === "PERCENT" ? `${value}%` : `$${value}`;
  };

  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <div className="content d-flex justify-content-center">
          <div className="col-lg-12">
            <div className="mb-4">
              <h6 className="fw-bold mb-0 d-flex align-items-center">
                Discount Management Dashboard
              </h6>
              <p className="text-muted mb-0 mt-1">
                Review and approve/deny discount requests from patients and staff
              </p>
            </div>

            {/* General Error Display */}
            {generalError && (
              <div className="mb-4">
                <SmartError
                  error={generalError}
                  onDismiss={clearAllErrors}
                  showSuggestions={true}
                  showRetryButton={true}
                />
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Pending Discount Requests</h5>
                <p className="text-muted mb-0 mt-1">
                  Review and make decisions on discount requests
                </p>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Loading discount requests...</span>
                  </div>
                ) : (
                  <>
                    {discounts.length === 0 ? (
                      <div className="text-center py-5">
                        <div className="mb-3">
                          <i className="ti ti-discount-2" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                        </div>
                        <h5 className="text-muted">No Pending Discount Requests</h5>
                        <p className="text-muted">
                          All discount requests have been processed or no new requests are available.
                        </p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Request ID</th>
                              <th>Patient/Plan</th>
                              <th>Discount Type</th>
                              <th>Value</th>
                              <th>Reason</th>
                              <th>Requested By</th>
                              <th>Requested At</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {discounts.map((discount) => (
                              <tr key={discount.id}>
                                <td>
                                  <span className="badge bg-light text-dark">
                                    #{discount.id.slice(-8)}
                                  </span>
                                </td>
                                <td>
                                  <div>
                                    <strong>
                                      {discount.scope === "PLAN"
                                        ? `Treatment Plan`
                                        : `Appointment`}
                                    </strong>
                                    <br />
                                    <small className="text-muted">
                                      {discount.scope === "PLAN"
                                        ? `Plan ${discount.planId}`
                                        : `Appointment ${discount.appointmentId}`}
                                    </small>
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${
                                    discount.type === "PERCENT" 
                                      ? "bg-info" 
                                      : "bg-warning"
                                  }`}>
                                    {discount.type}
                                  </span>
                                </td>
                                <td>
                                  <strong className={
                                    discount.type === "PERCENT" 
                                      ? "text-info" 
                                      : "text-warning"
                                  }>
                                    {getTypeDisplay(discount.type, discount.value)}
                                  </strong>
                                </td>
                                <td>
                                  <div
                                    className="text-truncate"
                                    style={{ maxWidth: "200px" }}
                                    title={discount.reasonEn}
                                  >
                                    {discount.reasonEn}
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>{discount.requestedBy}</strong>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    {new Date(discount.createdAt).toLocaleDateString()}
                                    <br />
                                    <small className="text-muted">
                                      {new Date(discount.createdAt).toLocaleTimeString()}
                                    </small>
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${getStatusBadgeClass(discount.status)}`}>
                                    {discount.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => openApprovalModal(discount)}
                                      disabled={discount.status !== "PENDING"}
                                      title="Approve this discount request"
                                    >
                                      <i className="ti ti-check me-1"></i>
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => openDenialModal(discount)}
                                      disabled={discount.status !== "PENDING"}
                                      title="Deny this discount request"
                                    >
                                      <i className="ti ti-x me-1"></i>
                                      Deny
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedDiscount && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center">
                    <i className="ti ti-check-circle me-2 text-success"></i>
                    Approve Discount Request
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowApprovalModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Discount Details</label>
                    <div className="card">
                      <div className="card-body">
                        <p>
                          <strong>Type:</strong> {selectedDiscount.scope}
                        </p>
                        <p>
                          <strong>Value:</strong>{" "}
                          {getTypeDisplay(
                            selectedDiscount.type,
                            selectedDiscount.value
                          )}
                        </p>
                        <p>
                          <strong>Reason:</strong> {selectedDiscount.reasonEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="decisionNoteEn" className="form-label">
                      Decision Note (English) *
                    </label>
                    <textarea
                      id="decisionNoteEn"
                      className="form-control"
                      rows={3}
                      value={approvalForm.decisionNoteEn}
                      onChange={(e) =>
                        setApprovalForm({
                          ...approvalForm,
                          decisionNoteEn: e.target.value,
                        })
                      }
                      placeholder="Enter approval notes..."
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="decisionNoteAr" className="form-label">
                      Decision Note (Arabic)
                    </label>
                    <textarea
                      id="decisionNoteAr"
                      className="form-control"
                      rows={3}
                      value={approvalForm.decisionNoteAr}
                      onChange={(e) =>
                        setApprovalForm({
                          ...approvalForm,
                          decisionNoteAr: e.target.value,
                        })
                      }
                      placeholder="أدخل ملاحظات الموافقة..."
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="effectiveFrom" className="form-label">
                      Effective From
                    </label>
                    <input
                      type="date"
                      id="effectiveFrom"
                      className="form-control"
                      value={approvalForm.effectiveFrom}
                      onChange={(e) =>
                        setApprovalForm({
                          ...approvalForm,
                          effectiveFrom: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowApprovalModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleApproveDiscount}
                    disabled={!approvalForm.decisionNoteEn.trim()}
                  >
                    Approve Discount
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Denial Modal */}
        {showDenialModal && selectedDiscount && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center">
                    <i className="ti ti-x-circle me-2 text-danger"></i>
                    Deny Discount Request
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDenialModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Discount Details</label>
                    <div className="card">
                      <div className="card-body">
                        <p>
                          <strong>Type:</strong> {selectedDiscount.scope}
                        </p>
                        <p>
                          <strong>Value:</strong>{" "}
                          {getTypeDisplay(
                            selectedDiscount.type,
                            selectedDiscount.value
                          )}
                        </p>
                        <p>
                          <strong>Reason:</strong> {selectedDiscount.reasonEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="denialNoteEn" className="form-label">
                      Denial Reason (English) *
                    </label>
                    <textarea
                      id="denialNoteEn"
                      className="form-control"
                      rows={3}
                      value={denialForm.decisionNoteEn}
                      onChange={(e) =>
                        setDenialForm({
                          ...denialForm,
                          decisionNoteEn: e.target.value,
                        })
                      }
                      placeholder="Enter reason for denial..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="denialNoteAr" className="form-label">
                      Denial Reason (Arabic)
                    </label>
                    <textarea
                      id="denialNoteAr"
                      className="form-control"
                      rows={3}
                      value={denialForm.decisionNoteAr}
                      onChange={(e) =>
                        setDenialForm({
                          ...denialForm,
                          decisionNoteAr: e.target.value,
                        })
                      }
                      placeholder="أدخل سبب الرفض..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDenialModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDenyDiscount}
                    disabled={!denialForm.decisionNoteEn.trim()}
                  >
                    Deny Discount
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
