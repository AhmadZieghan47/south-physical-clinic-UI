import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { DiscountRequest } from "../schema";

interface Step4DiscountRequestProps {
  onDiscountChange: (discount: DiscountRequest | undefined) => void;
}

export default function Step4DiscountRequest({
  onDiscountChange,
}: Step4DiscountRequestProps) {
  const { watch } = useFormContext();

  const [requestDiscount, setRequestDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<"PERCENT" | "FLAT">(
    "PERCENT"
  );
  const [discountValue, setDiscountValue] = useState("");
  const [reasonEn, setReasonEn] = useState("");
  const [reasonAr, setReasonAr] = useState("");

  const watchedDiscount = watch("discountRequest");

  useEffect(() => {
    if (watchedDiscount) {
      setRequestDiscount(true);
      setDiscountType(watchedDiscount.type);
      setDiscountValue(watchedDiscount.value);
      setReasonEn(watchedDiscount.reasonEn);
      setReasonAr(watchedDiscount.reasonAr || "");
    }
  }, []);

  useEffect(() => {
    if (requestDiscount) {
      const discount: DiscountRequest = {
        type: discountType,
        value: discountValue,
        reasonEn,
        reasonAr: reasonAr || undefined,
      };
      onDiscountChange(discount);
    } else {
      onDiscountChange(undefined);
    }
  }, [requestDiscount, discountType, discountValue, reasonEn, reasonAr]);

  const handleRequestToggle = (enabled: boolean) => {
    setRequestDiscount(enabled);
    if (!enabled) {
      // Reset values when disabled
      setDiscountType("PERCENT");
      setDiscountValue("");
      setReasonEn("");
      setReasonAr("");
    }
  };

  const validateDiscountValue = (value: string) => {
    if (discountType === "PERCENT") {
      const numValue = parseFloat(value);
      return numValue >= 0 && numValue <= 100;
    } else {
      const numValue = parseFloat(value);
      return numValue >= 0;
    }
  };

  const getDiscountValuePlaceholder = () => {
    return discountType === "PERCENT" ? "e.g., 15" : "e.g., 50";
  };

  const getDiscountValueHelp = () => {
    return discountType === "PERCENT"
      ? "Enter percentage (0-100)"
      : "Enter amount in dollars";
  };

  return (
    <div className="row">
      <div className="col-12">
        <h5 className="mb-3">Request Discount (Optional)</h5>
        <p className="text-muted mb-4">
          You can request a discount for this treatment plan. All discount
          requests require admin approval.
        </p>

        {/* Discount Request Toggle */}
        <div className="mb-4">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="requestDiscount"
              checked={requestDiscount}
              onChange={(e) => handleRequestToggle(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="requestDiscount">
              <strong>Request Discount</strong>
            </label>
          </div>
          <small className="text-muted">
            Check this box if you want to request a discount for this treatment
            plan.
          </small>
        </div>

        {requestDiscount && (
          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">Discount Details</h6>

              {/* Discount Type */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Discount Type</label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${
                        discountType === "PERCENT"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setDiscountType("PERCENT")}
                    >
                      Percentage
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        discountType === "FLAT"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setDiscountType("FLAT")}
                    >
                      Fixed Amount
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Discount Value</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${
                        discountValue && !validateDiscountValue(discountValue)
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder={getDiscountValuePlaceholder()}
                      value={discountValue}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Auto-format to ensure proper decimal places
                        if (value && !value.includes('.')) {
                          // If it's a whole number, add .00
                          value = value + '.00';
                        } else if (value && value.endsWith('.')) {
                          // If it ends with a dot, add 00
                          value = value + '00';
                        } else if (value && value.includes('.') && value.split('.')[1].length === 1) {
                          // If it has only one decimal place, add another 0
                          value = value + '0';
                        }
                        setDiscountValue(value);
                      }}
                    />
                    <span className="input-group-text">
                      {discountType === "PERCENT" ? "%" : "$"}
                    </span>
                  </div>
                  <small className="text-muted">{getDiscountValueHelp()}</small>
                  {discountValue && !validateDiscountValue(discountValue) && (
                    <div className="invalid-feedback">
                      {discountType === "PERCENT"
                        ? "Percentage must be between 0 and 100"
                        : "Amount must be a positive number"}
                    </div>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Reason (English) *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Please provide a reason for the discount request..."
                    value={reasonEn}
                    onChange={(e) => setReasonEn(e.target.value)}
                  />
                  <small className="text-muted">
                    This reason will be reviewed by administrators.
                  </small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Reason (Arabic)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="يرجى تقديم سبب لطلب الخصم..."
                    value={reasonAr}
                    onChange={(e) => setReasonAr(e.target.value)}
                  />
                  <small className="text-muted">
                    Optional Arabic translation of the reason.
                  </small>
                </div>
              </div>

              {/* Preview */}
              <div className="alert alert-info">
                <h6 className="alert-heading">Discount Request Preview</h6>
                <p className="mb-1">
                  <strong>Type:</strong>{" "}
                  {discountType === "PERCENT" ? "Percentage" : "Fixed Amount"}
                </p>
                <p className="mb-1">
                  <strong>Value:</strong> {discountValue || "Not specified"}{" "}
                  {discountType === "PERCENT" ? "%" : "$"}
                </p>
                <p className="mb-1">
                  <strong>Reason:</strong> {reasonEn || "Not provided"}
                </p>
                {reasonAr && (
                  <p className="mb-0">
                    <strong>Reason (Arabic):</strong> {reasonAr}
                  </p>
                )}
              </div>

              {/* Important Notes */}
              <div className="alert alert-warning">
                <h6 className="alert-heading">Important Notes</h6>
                <ul className="mb-0">
                  <li>All discount requests require admin approval</li>
                  <li>
                    The treatment plan will be created with "PENDING" discount
                    status
                  </li>
                  <li>
                    You will be notified once the discount is approved or denied
                  </li>
                  <li>
                    If approved, the discount will be automatically applied to
                    the plan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {!requestDiscount && (
          <div className="card bg-light">
            <div className="card-body text-center">
              <h6>No Discount Request</h6>
              <p className="text-muted mb-0">
                The treatment plan will be created at full price. You can always
                request a discount later if needed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
