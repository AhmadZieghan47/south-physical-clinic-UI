import React from "react";
import { Table, Button, Tag, Avatar, Popconfirm, Space, Tooltip } from "antd";
import { EditOutlined, LockOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AppUser } from "../../../../api/users";
import dayjs from "dayjs";

interface UsersTableProps {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onResetPassword: (user: AppUser) => void;
  onDeactivate: (id: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  currentPage: number;
  pageSize: number;
  total: number;
  currentUserId: string;
  loading: boolean;
}

/**
 * Table component for displaying users with actions using Ant Design Table
 * Includes built-in pagination, sorting, and filtering support
 */
const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onResetPassword,
  onDeactivate,
  onPageChange,
  currentPage,
  pageSize,
  total,
  currentUserId,
  loading,
}) => {
  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "MANAGER":
        return "orange";
      case "RECEPTION":
        return "blue";
      case "THERAPIST":
        return "green";
      default:
        return "default";
    }
  };

  const handleDeactivateClick = (user: AppUser) => {
    if (user.id === currentUserId) {
      return;
    }
    onDeactivate(user.id);
  };

  const columns: ColumnsType<AppUser> = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      render: (text: string) => (
        <div className="user-avatar-cell">
          <Avatar style={{ backgroundColor: "#1890ff" }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <strong>{text}</strong>
        </div>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
      render: (text: string) => <span style={{ color: "#8c8c8c" }}>@{text}</span>,
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => (
        <Tag color={getRoleBadgeColor(role)} className={`role-tag-${role.toLowerCase()}`}>
          {role}
        </Tag>
      ),
      filters: [
        { text: "Admin", value: "ADMIN" },
        { text: "Manager", value: "MANAGER" },
        { text: "Reception", value: "RECEPTION" },
        { text: "Therapist", value: "THERAPIST" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Last Login",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 120,
      render: (date: string | null) =>
        date ? (
          <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ) : (
          <span style={{ fontSize: "12px", color: "#d9d9d9" }}>—</span>
        ),
      sorter: (a, b) => {
        if (!a.lastLoginAt) return 1;
        if (!b.lastLoginAt) return -1;
        return new Date(a.lastLoginAt).getTime() - new Date(b.lastLoginAt).getTime();
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record: AppUser) => (
        <Space size="small" className="user-actions">
          <Tooltip title="Edit user">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Reset password">
            <Button
              type="default"
              size="small"
              icon={<LockOutlined />}
              onClick={() => onResetPassword(record)}
            />
          </Tooltip>
          <Tooltip
            title={
              record.id === currentUserId
                ? "Cannot deactivate yourself"
                : record.isActive
                ? "Deactivate user"
                : "Already inactive"
            }
          >
            <Popconfirm
              title="Deactivate User"
              description={`Are you sure you want to deactivate "${record.fullName}"? This user will no longer be able to access the system.`}
              onConfirm={() => handleDeactivateClick(record)}
              okText="Yes, Deactivate"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              disabled={!record.isActive || record.id === currentUserId}
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                disabled={!record.isActive || record.id === currentUserId}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table<AppUser>
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} users`,
        pageSizeOptions: ["10", "20", "50", "100"],
        onChange: onPageChange,
      }}
      scroll={{ x: 1000 }}
      locale={{
        emptyText: (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", color: "#8c8c8c", marginBottom: "8px" }}>
              No users found
            </p>
            <small style={{ color: "#bfbfbf" }}>
              Try adjusting your filters or create a new user
            </small>
          </div>
        ),
      }}
    />
  );
};

export default UsersTable;

