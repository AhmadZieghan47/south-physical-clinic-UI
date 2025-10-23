import { useState, useEffect } from "react";
import type { PaymentMethod } from "@/types/typedefs";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: PaymentFormData) => void;
  patientId: string;
  loading?: boolean;
  patientName: string;
}

export interface PaymentFormData {
  amountJd: string;
  method: PaymentMethod;
  description?: string;
  planId?: string;
  appointmentId?: string;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patientId,
  patientName,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amountJd: "",
    method: "CASH",
    description: "",
    planId: "",
    appointmentId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, loading]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amountJd || parseFloat(formData.amountJd) <= 0) {
      newErrors.amountJd = "Amount must be greater than 0";
    }

    if (!formData.method) {
      newErrors.method = "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(patientId);
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      amountJd: "",
      method: "CASH",
      description: "",
      planId: "",
      appointmentId: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Payment</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="amountJd" className="form-label">
                      Amount (JOD) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${
                        errors.amountJd ? "is-invalid" : ""
                      }`}
                      id="amountJd"
                      name="amountJd"
                      value={formData.amountJd}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      disabled={loading}
                    />
                    {errors.amountJd && (
                      <div className="invalid-feedback">{errors.amountJd}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="method" className="form-label">
                      Payment Method <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        errors.method ? "is-invalid" : ""
                      }`}
                      id="method"
                      name="method"
                      value={formData.method}
                      onChange={handleInputChange}
                      disabled={loading}
                    >
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="INSURANCE">Insurance</option>
                    </select>
                    {errors.method && (
                      <div className="invalid-feedback">{errors.method}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description (Optional)
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter payment description..."
                  disabled={loading}
                />
              </div>

              <div className="alert alert-info">
                <i className="ti ti-info-circle me-2"></i>
                <strong>Note:</strong> This payment will be recorded for Patient
                Name: <code>{patientName}</code>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="ti ti-plus me-2"></i>
                    Add Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        onClick={handleClose}
        style={{ cursor: "pointer", zIndex: -1 }}
      ></div>
    </div>
  );
};

export default AddPaymentModal;
