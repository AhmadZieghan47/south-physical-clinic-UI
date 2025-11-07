import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Switch, Alert, Row, Col } from "antd";
import { UserAddOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import type { AppUser } from "../../../api/users";
import { useUserForm } from "./hooks/useUserForm";

const { Option } = Select;

interface UserFormModalProps {
  user: AppUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal component for creating and editing users using Ant Design Form
 * Includes form validation, error handling, and accessibility features
 */
const UserFormModal: React.FC<UserFormModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { formData, errors, loading, handleChange, handleSubmit } =
    useUserForm({
      user,
      onSuccess,
    });

  // Sync form data with antd form
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const onFinish = () => {
    // Create a synthetic event for handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleSubmit(syntheticEvent);
  };

  const handleFieldChange = (changedFields: any) => {
    // Update the hook's form data when antd form changes
    Object.keys(changedFields).forEach((key) => {
      handleChange({
        target: { name: key, value: changedFields[key] },
      } as any);
    });
  };

  return (
    <Modal
      title={
        <span>
          {user ? <EditOutlined /> : <UserAddOutlined />}
          {" "}
          {user ? "Edit User" : "Add New User"}
        </span>
      }
      open={true}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={
        <span>
          <SaveOutlined /> {user ? "Update" : "Create"}
        </span>
      }
      cancelText="Cancel"
      width={800}
      maskClosable={!loading}
      keyboard={!loading}
    >
      {errors.general && (
        <Alert
          message="Error"
          description={errors.general}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFieldChange}
        initialValues={formData}
        disabled={loading}
      >
        <Row gutter={16}>
          {/* Full Name */}
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Full name is required" },
                { max: 255, message: "Full name must not exceed 255 characters" },
              ]}
              validateStatus={errors.fullName ? "error" : ""}
              help={errors.fullName}
            >
              <Input
                placeholder="Enter full name"
                maxLength={255}
                disabled={loading}
              />
            </Form.Item>
          </Col>

          {/* Username */}
          <Col span={12}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Username is required" },
                { min: 3, message: "Username must be at least 3 characters" },
                { max: 80, message: "Username must not exceed 80 characters" },
                {
                  pattern: /^[a-zA-Z0-9_-]+$/,
                  message: "Only letters, numbers, hyphens, and underscores allowed",
                },
              ]}
              validateStatus={errors.username ? "error" : ""}
              help={errors.username || "Letters, numbers, hyphens, and underscores only"}
            >
              <Input
                placeholder="Enter username"
                maxLength={80}
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Email */}
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email format" },
              ]}
              validateStatus={errors.email ? "error" : ""}
              help={errors.email}
            >
              <Input
                type="email"
                placeholder="user@example.com"
                disabled={loading}
              />
            </Form.Item>
          </Col>

          {/* WhatsApp Number */}
          <Col span={12}>
            <Form.Item
              label="WhatsApp Number"
              name="whatsappNumber"
              rules={[{ max: 32, message: "WhatsApp number must not exceed 32 characters" }]}
            >
              <Input
                placeholder="+1234567890"
                maxLength={32}
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Password (only for create) */}
        {!user && (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
              { max: 100, message: "Password must not exceed 100 characters" },
            ]}
            validateStatus={errors.password ? "error" : ""}
            help={errors.password || "Must be at least 8 characters"}
          >
            <Input.Password
              placeholder="Minimum 8 characters"
              maxLength={100}
              disabled={loading}
            />
          </Form.Item>
        )}

        <Row gutter={16}>
          {/* Role */}
          <Col span={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Role is required" }]}
              validateStatus={errors.role ? "error" : ""}
              help={errors.role}
            >
              <Select placeholder="Select role" disabled={loading}>
                <Option value="ADMIN">Admin</Option>
                <Option value="MANAGER">Manager</Option>
                <Option value="RECEPTION">Reception</Option>
                <Option value="THERAPIST">Therapist</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Active Status */}
          <Col span={12}>
            <Form.Item
              label="Status"
              name="isActive"
              valuePropName="checked"
              tooltip="Inactive users cannot log in to the system"
            >
              <div>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  disabled={loading}
                />
                <div style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px" }}>
                  Inactive users cannot log in to the system
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserFormModal;

