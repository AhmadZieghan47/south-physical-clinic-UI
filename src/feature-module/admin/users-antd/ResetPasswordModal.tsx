import React, { useEffect } from "react";
import { Modal, Form, Input, Alert, Progress, Avatar, Space } from "antd";
import { LockOutlined, CheckOutlined, WarningOutlined } from "@ant-design/icons";
import type { AppUser } from "../../../api/users";
import { usePasswordReset } from "./hooks/usePasswordReset";
import { message } from "antd";

interface ResetPasswordModalProps {
  user: AppUser;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal component for resetting user password using Ant Design components
 * Includes password validation, strength indicator, and confirmation
 */
const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { formData, errors, loading, handleChange, handleSubmit } =
    usePasswordReset({
      userId: user.id,
      onSuccess: () => {
        message.success(
          `Password reset successfully for ${user.fullName}. The user can now log in with the new password.`
        );
        onSuccess();
      },
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

  const getPasswordStrength = (password: string): {
    percent: number;
    status: "success" | "normal" | "exception";
    label: string;
  } => {
    if (!password) return { percent: 0, status: "exception", label: "" };
    if (password.length < 8)
      return { percent: 33, status: "exception", label: "Weak" };
    if (password.length < 12)
      return { percent: 66, status: "normal", label: "Medium" };
    return { percent: 100, status: "success", label: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <Modal
      title={
        <span>
          <LockOutlined /> Reset Password
        </span>
      }
      open={true}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={
        <span>
          <CheckOutlined /> Reset Password
        </span>
      }
      cancelText="Cancel"
      width={600}
      maskClosable={!loading}
      keyboard={!loading}
    >
      {/* User Info */}
      <Alert
        message={
          <Space>
            <Avatar style={{ backgroundColor: "#1890ff" }}>
              {user.fullName.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <strong>{user.fullName}</strong>
              <br />
              <small style={{ color: "#8c8c8c" }}>
                @{user.username} • {user.email}
              </small>
            </div>
          </Space>
        }
        type="info"
        style={{ marginBottom: 16 }}
      />

      {/* General error message */}
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
        {/* New Password */}
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "New password is required" },
            { min: 8, message: "Password must be at least 8 characters" },
            { max: 100, message: "Password must not exceed 100 characters" },
          ]}
          validateStatus={errors.newPassword ? "error" : ""}
          help={errors.newPassword || "Must be at least 8 characters"}
        >
          <Input.Password
            placeholder="Enter new password"
            maxLength={100}
            disabled={loading}
          />
        </Form.Item>

        {/* Password strength indicator */}
        {formData.newPassword && (
          <div className="password-strength-indicator" style={{ marginTop: -16, marginBottom: 16 }}>
            <Progress
              percent={passwordStrength.percent}
              status={passwordStrength.status}
              showInfo={false}
              strokeColor={
                passwordStrength.status === "exception"
                  ? "#ff4d4f"
                  : passwordStrength.status === "normal"
                  ? "#faad14"
                  : "#52c41a"
              }
            />
            <small
              className={`password-strength-${
                passwordStrength.label.toLowerCase()
              }`}
              style={{
                color:
                  passwordStrength.status === "exception"
                    ? "#ff4d4f"
                    : passwordStrength.status === "normal"
                    ? "#faad14"
                    : "#52c41a",
              }}
            >
              Password strength: {passwordStrength.label}
            </small>
          </div>
        )}

        {/* Confirm Password */}
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm the password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword}
        >
          <Input.Password
            placeholder="Re-enter new password"
            maxLength={100}
            disabled={loading}
          />
        </Form.Item>

        {/* Warning message */}
        <Alert
          message="Important"
          description="The user will need to use this new password to log in. Make sure to communicate this change to them securely."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
        />
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;

