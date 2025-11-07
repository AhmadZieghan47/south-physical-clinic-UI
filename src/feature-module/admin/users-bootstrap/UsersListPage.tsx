import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Button, Alert, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { UserPlus, Home, Users, RefreshCw } from "lucide-react";
import { useUsers } from "./hooks/useUsers";
import UsersTable from "./components/UsersTable";
import UserFilters from "./components/UserFilters";
import UserFormModal from "./UserFormModal";
import ResetPasswordModal from "./ResetPasswordModal";
import type { UsersFilters } from "./components/UserFilters";
import type { AppUser } from "../../../api/users";
import { usersApi } from "../../../api/users";
import "./styles/users-bootstrap.css";

interface ToastData {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "info";
}

/**
 * Main page component for users management using React-Bootstrap
 * Features: Improved styling, better UX, toast notifications, modern design
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
  const [toast, setToast] = useState<ToastData>({
    show: false,
    message: "",
    variant: "success",
  });

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

  const showToast = (message: string, variant: "success" | "danger" | "info") => {
    setToast({ show: true, message, variant });
  };

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
      showToast("User deactivated successfully", "success");
      await refetch();
    } catch (err: any) {
      console.error("Error deactivating user:", err);
      showToast(
        err.response?.data?.message ||
          "Failed to deactivate user. Please try again.",
        "danger"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setSelectedUser(null);
    showToast(
      selectedUser ? "User updated successfully" : "User created successfully",
      "success"
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

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((f) => ({ ...f, page: 1, pageSize }));
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="users-bootstrap-page">
          {/* Page Header */}
          <div className="card card-modern mb-4 fade-in">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/admin" }}>
                      <Home size={16} className="me-1" />
                      Admin
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Users</Breadcrumb.Item>
                  </Breadcrumb>
                  <h3 className="mb-0 d-flex align-items-center gap-2">
                    <Users size={28} />
                    Users Management
                  </h3>
                </div>
                <Button
                  variant="primary"
                  onClick={handleCreate}
                  size="lg"
                  className="btn-modern btn-primary-modern"
                >
                  <UserPlus size={20} className="me-2" />
                  Add New User
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <UserFilters
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={total}
          />

          {/* Error State */}
          {error && !loading && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => refetch()}
              className="fade-in"
            >
              <Alert.Heading>
                <i className="fas fa-exclamation-circle me-2"></i>
                Error loading users
              </Alert.Heading>
              <p>{error.message}</p>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => refetch()}
                  className="btn-modern"
                >
                  <RefreshCw size={16} className="me-1" />
                  Retry
                </Button>
              </div>
            </Alert>
          )}

          {/* Table */}
          {!error && (
            <UsersTable
              users={users}
              onEdit={handleEdit}
              onResetPassword={handleResetPassword}
              onDeactivate={handleDeactivate}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              currentPage={filters.page}
              pageSize={filters.pageSize}
              total={total}
              currentUserId={currentUserId}
              loading={loading || deleteLoading}
            />
          )}

          {/* Delete Loading Overlay */}
          {deleteLoading && (
            <div className="loading-overlay-modern">
              <div className="text-center">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="visually-hidden">Processing...</span>
                </Spinner>
                <p className="mt-3 text-muted">Processing...</p>
              </div>
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

          {/* Toast Notifications */}
          <ToastContainer position="top-end" className="p-3 toast-container-custom">
            <Toast
              show={toast.show}
              onClose={() => setToast({ ...toast, show: false })}
              delay={5000}
              autohide
              bg={toast.variant}
              className="toast-custom"
            >
              <Toast.Header>
                <strong className="me-auto">
                  {toast.variant === "success"
                    ? "Success"
                    : toast.variant === "danger"
                    ? "Error"
                    : "Info"}
                </strong>
              </Toast.Header>
              <Toast.Body className={toast.variant === "success" || toast.variant === "danger" ? "text-white" : ""}>
                {toast.message}
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </div>
      </div>
    </div>
  );
};

export default UsersListPage;

