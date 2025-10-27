import React from "react";
import type { AppUser } from "../../../api/users";
import { usePasswordReset } from "./hooks/usePasswordReset";

interface ResetPasswordModalProps {
  user: AppUser;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal component for resetting user password
 * Includes password validation and confirmation
 */
const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const { formData, errors, loading, handleChange, handleSubmit } =
    usePasswordReset({
      userId: user.id,
      onSuccess: () => {
        alert(
          `Password reset successfully for ${user.fullName}. The user can now log in with the new password.`
        );
        onSuccess();
      },
    });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const getPasswordStrength = (password: string): string => {
    if (!password) return "";
    if (password.length < 8) return "weak";
    if (password.length < 12) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="resetPasswordModalTitle"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="resetPasswordModalTitle">
              <i className="fe fe-lock me-2"></i>
              Reset Password
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              {/* User info */}
              <div className="alert alert-info" role="status">
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-sm me-3">
                    <span className="avatar-title rounded-circle bg-primary">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <strong>{user.fullName}</strong>
                    <br />
                    <small className="text-muted">@{user.username} • {user.email}</small>
                  </div>
                </div>
              </div>

              {/* General error message */}
              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  <i className="fe fe-alert-circle me-2"></i>
                  {errors.general}
                </div>
              )}

              {/* New Password */}
              <div className="form-group">
                <label htmlFor="reset-newPassword" className="form-label">
                  New Password <span className="text-danger">*</span>
                </label>
                <input
                  id="reset-newPassword"
                  type="password"
                  className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  minLength={8}
                  maxLength={100}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.newPassword}
                  aria-describedby={
                    errors.newPassword
                      ? "newPassword-error newPassword-help"
                      : "newPassword-help"
                  }
                  disabled={loading}
                />
                {errors.newPassword && (
                  <div id="newPassword-error" className="invalid-feedback" role="alert">
                    {errors.newPassword}
                  </div>
                )}
                <small id="newPassword-help" className="form-text text-muted">
                  Must be at least 8 characters
                </small>

                {/* Password strength indicator */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="progress" style={{ height: "5px" }}>
                      <div
                        className={`progress-bar ${
                          passwordStrength === "weak"
                            ? "bg-danger"
                            : passwordStrength === "medium"
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        role="progressbar"
                        style={{
                          width:
                            passwordStrength === "weak"
                              ? "33%"
                              : passwordStrength === "medium"
                              ? "66%"
                              : "100%",
                        }}
                        aria-valuenow={
                          passwordStrength === "weak"
                            ? 33
                            : passwordStrength === "medium"
                            ? 66
                            : 100
                        }
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <small
                      className={`text-${
                        passwordStrength === "weak"
                          ? "danger"
                          : passwordStrength === "medium"
                          ? "warning"
                          : "success"
                      }`}
                    >
                      Password strength:{" "}
                      {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                    </small>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group mb-0">
                <label htmlFor="reset-confirmPassword" className="form-label">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  id="reset-confirmPassword"
                  type="password"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  minLength={8}
                  maxLength={100}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <div id="confirmPassword-error" className="invalid-feedback" role="alert">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Warning message */}
              <div className="alert alert-warning mt-3 mb-0" role="note">
                <i className="fe fe-alert-triangle me-2"></i>
                <small>
                  The user will need to use this new password to log in. Make sure to communicate
                  this change to them securely.
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                <i className="fe fe-x me-1"></i>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="fe fe-check me-1"></i>
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default ResetPasswordModal;

