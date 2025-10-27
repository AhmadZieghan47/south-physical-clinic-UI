import React from "react";
import type { AppUser } from "../../../api/users";
import { useUserForm } from "./hooks/useUserForm";

interface UserFormModalProps {
  user: AppUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal component for creating and editing users
 * Includes form validation and error handling
 */
const UserFormModal: React.FC<UserFormModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const { formData, errors, loading, handleChange, handleSubmit } =
    useUserForm({
      user,
      onSuccess,
    });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="userFormModalTitle"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="userFormModalTitle">
              <i className={`fe ${user ? "fe-edit" : "fe-user-plus"} me-2`}></i>
              {user ? "Edit User" : "Add New User"}
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
              {/* General error message */}
              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  <i className="fe fe-alert-circle me-2"></i>
                  {errors.general}
                </div>
              )}

              <div className="row">
                {/* Full Name */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="user-fullName" className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="user-fullName"
                      type="text"
                      className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      maxLength={255}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      disabled={loading}
                    />
                    {errors.fullName && (
                      <div id="fullName-error" className="invalid-feedback" role="alert">
                        {errors.fullName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Username */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="user-username" className="form-label">
                      Username <span className="text-danger">*</span>
                    </label>
                    <input
                      id="user-username"
                      type="text"
                      className={`form-control ${errors.username ? "is-invalid" : ""}`}
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      maxLength={80}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.username}
                      aria-describedby={
                        errors.username ? "username-error username-help" : "username-help"
                      }
                      disabled={loading}
                    />
                    {errors.username && (
                      <div id="username-error" className="invalid-feedback" role="alert">
                        {errors.username}
                      </div>
                    )}
                    <small id="username-help" className="form-text text-muted">
                      Letters, numbers, hyphens, and underscores only
                    </small>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Email */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="user-email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      id="user-email"
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@example.com"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      disabled={loading}
                    />
                    {errors.email && (
                      <div id="email-error" className="invalid-feedback" role="alert">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="user-whatsappNumber" className="form-label">
                      WhatsApp Number
                    </label>
                    <input
                      id="user-whatsappNumber"
                      type="text"
                      className="form-control"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      maxLength={32}
                      disabled={loading}
                      aria-label="WhatsApp number (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Password (only for create) */}
              {!user && (
                <div className="form-group">
                  <label htmlFor="user-password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    id="user-password"
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    maxLength={100}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error password-help" : "password-help"
                    }
                    disabled={loading}
                  />
                  {errors.password && (
                    <div id="password-error" className="invalid-feedback" role="alert">
                      {errors.password}
                    </div>
                  )}
                  <small id="password-help" className="form-text text-muted">
                    Must be at least 8 characters
                  </small>
                </div>
              )}

              <div className="row">
                {/* Role */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="user-role" className="form-label">
                      Role <span className="text-danger">*</span>
                    </label>
                    <select
                      id="user-role"
                      className={`form-control ${errors.role ? "is-invalid" : ""}`}
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.role}
                      disabled={loading}
                      aria-label="Select user role"
                    >
                      <option value="">Select role</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="RECEPTION">Reception</option>
                      <option value="THERAPIST">Therapist</option>
                    </select>
                    {errors.role && (
                      <div id="role-error" className="invalid-feedback" role="alert">
                        {errors.role}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Status */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label d-block">Status</label>
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="user-isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          handleChange({
                            target: { name: "isActive", value: e.target.checked },
                          } as any)
                        }
                        disabled={loading}
                      />
                      <label className="custom-control-label" htmlFor="user-isActive">
                        Active
                      </label>
                    </div>
                    <small className="form-text text-muted">
                      Inactive users cannot log in to the system
                    </small>
                  </div>
                </div>
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
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className={`fe ${user ? "fe-check" : "fe-plus"} me-1`}></i>
                    {user ? "Update" : "Create"}
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

export default UserFormModal;

