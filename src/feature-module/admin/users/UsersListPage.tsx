import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "./hooks/useUsers";
import UsersTable from "./components/UsersTable";
import UserFilters from "./components/UserFilters";
// import UserFormModal from "./UserFormModal";
import ResetPasswordModal from "./ResetPasswordModal";
import type { UsersFilters } from "./components/UserFilters";
import type { AppUser } from "../../../api/users";
import { usersApi } from "../../../api/users";
import "./styles/users.css";

/**
 * Main page component for users management
 * Provides full CRUD operations for users
 */
const UsersListPage: React.FC = () => {
  const [filters, setFilters] = useState<UsersFilters>({
    search: "",
    page: 1,
    pageSize: 50,
  });

  const [_showFormModal, setShowFormModal] = useState(false);
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
      await refetch();
    } catch (err: any) {
      console.error("Error deactivating user:", err);
      alert(
        err.response?.data?.message ||
          "Failed to deactivate user. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // const handleFormSuccess = () => {
  //   setShowFormModal(false);
  //   setSelectedUser(null);
  //   refetch();
  // };

  // const handleFormClose = () => {
  //   setShowFormModal(false);
  //   setSelectedUser(null);
  // };

  const handleResetPasswordSuccess = () => {
    setShowResetPasswordModal(false);
    setSelectedUser(null);
  };

  const handleResetPasswordClose = () => {
    setShowResetPasswordModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">
                <i className="fe fe-users me-2"></i>
                Users Management
              </h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin">Admin</Link>
                </li>
                <li className="breadcrumb-item active">Users</li>
              </ul>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                aria-label="Add new user"
              >
                <i className="fe fe-user-plus me-2"></i>
                Add New User
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <UserFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={total}
        />

        {/* Loading State */}
        {loading && !deleteLoading && (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading users...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            <i className="fe fe-alert-circle me-2"></i>
            <strong>Error loading users:</strong> {error.message}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={() => refetch()}
            >
              <i className="fe fe-refresh-cw me-1"></i>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <UsersTable
            users={users}
            onEdit={handleEdit}
            onResetPassword={handleResetPassword}
            onDeactivate={handleDeactivate}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            currentPage={filters.page}
            pageSize={filters.pageSize}
            total={total}
            currentUserId={currentUserId}
          />
        )}

        {/* Delete Loading Overlay */}
        {deleteLoading && (
          <div className="loading-overlay">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Processing...</span>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {/* {showFormModal && (
          <UserFormModal
            user={selectedUser}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )} */}

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
  );
};

export default UsersListPage;

