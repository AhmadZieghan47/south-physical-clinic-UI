import React from "react";
import type { AppUser } from "../../../../api/users";
import { EditIcon, LockIcon, TrashIcon } from "lucide-react";

interface UsersTableProps {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onResetPassword: (user: AppUser) => void;
  onDeactivate: (id: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
  total: number;
  currentUserId: string;
}

/**
 * Table component for displaying users with actions
 * Includes pagination controls
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
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getRoleBadgeClass = (role: string): string => {
    switch (role) {
      case "ADMIN":
        return "badge-danger";
      case "MANAGER":
        return "badge-warning";
      case "RECEPTION":
        return "badge-info";
      case "THERAPIST":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  };

  const handleDeactivateClick = (user: AppUser) => {
    if (user.id === currentUserId) {
      alert("You cannot deactivate your own account.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to deactivate "${user.fullName}"?\n\nThis user will no longer be able to access the system.`
      )
    ) {
      onDeactivate(user.id);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover table-center mb-0">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div className="empty-state">
                      <i className="fas fa-users fa-3x mb-3 text-muted"></i>
                      <p className="text-muted mb-0">No users found</p>
                      <small className="text-muted">
                        Try adjusting your filters or create a new user
                      </small>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm me-2">
                          <span className="avatar-title rounded-circle bg-primary">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <strong>{user.fullName}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted">@{user.username}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.isActive ? "badge-success" : "badge-secondary"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {formatDate(user.lastLoginAt)}
                      </small>
                    </td>
                    <td className="text-end">
                      <div className="actions d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm bg-success-light"
                          onClick={() => onEdit(user)}
                          title="Edit user"
                          aria-label={`Edit ${user.fullName}`}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn btn-sm bg-warning-light"
                          onClick={() => onResetPassword(user)}
                          title="Reset password"
                          aria-label={`Reset password for ${user.fullName}`}
                        >
                          <LockIcon />
                        </button>
                        <button
                          className="btn btn-sm bg-danger-light"
                          onClick={() => handleDeactivateClick(user)}
                          title={
                            user.id === currentUserId
                              ? "Cannot deactivate yourself"
                              : user.isActive
                              ? "Deactivate user"
                              : "Already inactive"
                          }
                          aria-label={`Deactivate ${user.fullName}`}
                          disabled={!user.isActive || user.id === currentUserId}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-wrapper mt-4">
            <nav aria-label="Users pagination">
              <ul className="pagination justify-content-center mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <i className="fe fe-chevron-left"></i> Previous
                  </button>
                </li>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => onPageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    Next <i className="fe fe-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Results info */}
        <div className="text-center mt-3">
          <small className="text-muted">
            Showing {users.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}{" "}
            to {Math.min(currentPage * pageSize, total)} of {total} users
          </small>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;

