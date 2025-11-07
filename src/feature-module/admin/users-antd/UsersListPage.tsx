import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Breadcrumb, Alert, Spin, message } from "antd";
import {
  UserAddOutlined,
  HomeOutlined,
  UserOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useUsers } from "./hooks/useUsers";
import UsersTable from "./components/UsersTable";
import UserFilters from "./components/UserFilters";
import UserFormModal from "./UserFormModal";
import ResetPasswordModal from "./ResetPasswordModal";
import type { UsersFilters } from "./components/UserFilters";
import type { AppUser } from "../../../api/users";
import { usersApi } from "../../../api/users";
import "./styles/users-antd.css";

/**
 * Main page component for users management using Ant Design components
 * Provides full CRUD operations with enhanced UI/UX
 */
const UsersListPage: React.FC = () => {
  const [filters, setFilters] = useState<UsersFilters>({
    search: "",
    page: 1,
    pageSize: 50,
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const { users, loading, error, total, refetch } = useUsers(filters);

  // Get current user ID from local storage or context
  useEffect(() => {
    // TODO: Replace with actual auth context
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user.id || "");
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setShowFormModal(true);
  };

  const handleEdit = (user: AppUser) => {
    setSelectedUser(user);
    setShowFormModal(true);
  };

  const handleResetPassword = (user: AppUser) => {
    setSelectedUser(user);
    setShowResetPasswordModal(true);
  };

  const handleDeactivate = async (id: string) => {
    setDeleteLoading(true);
    try {
      await usersApi.deactivate(id);
      message.success("User deactivated successfully");
      await refetch();
    } catch (err: any) {
      console.error("Error deactivating user:", err);
      message.error(
        err.response?.data?.message ||
          "Failed to deactivate user. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setSelectedUser(null);
    message.success(
      selectedUser ? "User updated successfully" : "User created successfully"
    );
    refetch();
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setSelectedUser(null);
  };

  const handleResetPasswordSuccess = () => {
    setShowResetPasswordModal(false);
    setSelectedUser(null);
  };

  const handleResetPasswordClose = () => {
    setShowResetPasswordModal(false);
    setSelectedUser(null);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters((f) => ({ ...f, page, pageSize }));
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="users-antd-page">
          {/* Page Header */}
          <PageHeader
            className="users-antd-header"
            title={
              <span>
                <UserOutlined style={{ marginRight: 8 }} />
                Users Management
              </span>
            }
            breadcrumb={
              <Breadcrumb
                items={[
                  {
                    title: (
                      <>
                        <HomeOutlined />
                        <Link to="/admin" style={{ marginLeft: 4 }}>
                          Admin
                        </Link>
                      </>
                    ),
                  },
                  {
                    title: "Users",
                  },
                ]}
              />
            }
            extra={[
              <Button
                key="add"
                type="primary"
                icon={<UserAddOutlined />}
                onClick={handleCreate}
                size="large"
              >
                Add New User
              </Button>,
            ]}
            style={{ background: "#fff", marginBottom: 16, borderRadius: 8 }}
          />

          {/* Filters */}
          <UserFilters
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={total}
          />

          {/* Error State */}
          {error && !loading && (
            <Alert
              message="Error loading users"
              description={error.message}
              type="error"
              showIcon
              action={
                <Button
                  size="small"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              }
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Table */}
          {!error && (
            <div
              style={{ background: "#fff", padding: "24px", borderRadius: 8 }}
            >
              <UsersTable
                users={users}
                onEdit={handleEdit}
                onResetPassword={handleResetPassword}
                onDeactivate={handleDeactivate}
                onPageChange={handlePageChange}
                currentPage={filters.page}
                pageSize={filters.pageSize}
                total={total}
                currentUserId={currentUserId}
                loading={loading || deleteLoading}
              />
            </div>
          )}

          {/* Delete Loading Overlay */}
          {deleteLoading && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <Spin size="large" tip="Processing..." />
            </div>
          )}

          {/* Form Modal */}
          {showFormModal && (
            <UserFormModal
              user={selectedUser}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}

          {/* Reset Password Modal */}
          {showResetPasswordModal && selectedUser && (
            <ResetPasswordModal
              user={selectedUser}
              onClose={handleResetPasswordClose}
              onSuccess={handleResetPasswordSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersListPage;
