import React from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Lock, Check, AlertTriangle } from "lucide-react";
import type { AppUser } from "../../../api/users";
import { usePasswordReset } from "./hooks/usePasswordReset";

interface ResetPasswordModalProps {
  user: AppUser;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Improved password reset modal using React-Bootstrap
 * Features: Better styling, password strength indicator, validation feedback
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const getPasswordStrength = (password: string): {
    width: string;
    color: string;
    label: string;
  } => {
    if (!password) return { width: "0%", color: "secondary", label: "" };
    if (password.length < 8)
      return { width: "33%", color: "danger", label: "Weak" };
    if (password.length < 12)
      return { width: "66%", color: "warning", label: "Medium" };
    return { width: "100%", color: "success", label: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <Modal
      show={true}
      onHide={onClose}
      backdrop={loading ? "static" : true}
      keyboard={!loading}
      centered
    >
      <Modal.Header closeButton className="modal-header-modern">
        <Modal.Title className="d-flex align-items-center gap-2">
          <Lock size={20} />
          Reset Password
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleFormSubmit} noValidate>
        <Modal.Body>
          {/* User Info */}
          <Alert variant="info" className="d-flex align-items-center mb-3">
            <div className="user-avatar me-3">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user.fullName}</strong>
              <br />
              <small className="text-muted">
                @{user.username} • {user.email}
              </small>
            </div>
          </Alert>

          {/* General error message */}
          {errors.general && (
            <Alert variant="danger" dismissible className="mb-3">
              <AlertTriangle size={16} className="me-2" />
              {errors.general}
            </Alert>
          )}

          {/* New Password */}
          <Form.Group className="mb-3">
            <Form.Label className="form-label-modern">
              New Password <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              minLength={8}
              maxLength={100}
              required
              isInvalid={!!errors.newPassword}
              disabled={loading}
              className="form-control-modern"
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Must be at least 8 characters
            </Form.Text>

            {/* Password strength indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="password-strength">
                  <div
                    className={`password-strength-bar password-strength-${passwordStrength.label.toLowerCase()}`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
                <small className={`text-${passwordStrength.color} mt-1`}>
                  Password strength: {passwordStrength.label}
                </small>
              </div>
            )}
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3">
            <Form.Label className="form-label-modern">
              Confirm Password <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              minLength={8}
              maxLength={100}
              required
              isInvalid={!!errors.confirmPassword}
              disabled={loading}
              className="form-control-modern"
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Warning message */}
          <Alert variant="warning" className="mb-0">
            <AlertTriangle size={16} className="me-2" />
            <small>
              The user will need to use this new password to log in. Make sure
              to communicate this change to them securely.
            </small>
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="btn-modern"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="btn-modern btn-primary-modern"
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Resetting...
              </>
            ) : (
              <>
                <Check size={16} className="me-2" />
                Reset Password
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;

