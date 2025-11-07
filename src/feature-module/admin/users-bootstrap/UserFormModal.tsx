import React from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { UserPlus, Edit, Save } from "lucide-react";
import type { AppUser } from "../../../api/users";
import { useUserForm } from "./hooks/useUserForm";

interface UserFormModalProps {
  user: AppUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Improved modal component using React-Bootstrap Modal
 * Features: Better styling, validation feedback, accessibility
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Modal
      show={true}
      onHide={onClose}
      size="lg"
      backdrop={loading ? "static" : true}
      keyboard={!loading}
      centered
    >
      <Modal.Header closeButton className="modal-header-modern">
        <Modal.Title className="d-flex align-items-center gap-2">
          {user ? <Edit size={20} /> : <UserPlus size={20} />}
          {user ? "Edit User" : "Add New User"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleFormSubmit} noValidate>
        <Modal.Body>
          {/* General error message */}
          {errors.general && (
            <Alert variant="danger" dismissible className="mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {errors.general}
            </Alert>
          )}

          <Row className="g-3">
            {/* Full Name */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-modern">
                  Full Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  maxLength={255}
                  required
                  isInvalid={!!errors.fullName}
                  disabled={loading}
                  className="form-control-modern"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Username */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-modern">
                  Username <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  maxLength={80}
                  required
                  isInvalid={!!errors.username}
                  disabled={loading}
                  className="form-control-modern"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Letters, numbers, hyphens, and underscores only
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-modern">
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                  isInvalid={!!errors.email}
                  disabled={loading}
                  className="form-control-modern"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* WhatsApp Number */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-modern">
                  WhatsApp Number
                </Form.Label>
                <Form.Control
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  maxLength={32}
                  disabled={loading}
                  className="form-control-modern"
                />
              </Form.Group>
            </Col>

            {/* Password (only for create) */}
            {!user && (
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="form-label-modern">
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    maxLength={100}
                    required
                    isInvalid={!!errors.password}
                    disabled={loading}
                    className="form-control-modern"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Must be at least 8 characters
                  </Form.Text>
                </Form.Group>
              </Col>
            )}

            {/* Role */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-modern">
                  Role <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.role}
                  disabled={loading}
                  className="form-control-modern"
                >
                  <option value="">Select role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="RECEPTION">Reception</option>
                  <option value="THERAPIST">Therapist</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Active Status */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="form-label-modern d-block">
                  Status
                </Form.Label>
                <Form.Check
                  type="switch"
                  id="isActive-switch"
                  name="isActive"
                  label={formData.isActive ? "Active" : "Inactive"}
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "isActive", value: e.target.checked },
                    } as any)
                  }
                  disabled={loading}
                  className="mt-2"
                />
                <Form.Text className="text-muted">
                  Inactive users cannot log in to the system
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
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
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="me-2" />
                {user ? "Update" : "Create"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserFormModal;

