import React from "react";
import { Table, Button, Badge, Pagination } from "react-bootstrap";
import { Edit, Lock, Trash2 } from "lucide-react";
import type { AppUser } from "../../../../api/users";

interface UsersTableProps {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onResetPassword: (user: AppUser) => void;
  onDeactivate: (id: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  currentPage: number;
  pageSize: number;
  total: number;
  currentUserId: string;
  loading: boolean;
}

/**
 * Improved table component using React-Bootstrap
 * Features: Better styling, responsive design, modern pagination
 */
const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onResetPassword,
  onDeactivate,
  onPageChange,
  onPageSizeChange,
  currentPage,
  pageSize,
  total,
  currentUserId,
  loading,
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

  const getRoleBadgeVariant = (role: string): string => {
    switch (role) {
      case "ADMIN":
        return "danger";
      case "MANAGER":
        return "warning";
      case "RECEPTION":
        return "info";
      case "THERAPIST":
        return "success";
      default:
        return "secondary";
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

  const renderPagination = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => onPageChange(1)} />
      );
    }

    // Previous
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
    );

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Next
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    );

    // Last page
    if (endPage < totalPages) {
      items.push(
        <Pagination.Last key="last" onClick={() => onPageChange(totalPages)} />
      );
    }

    return items;
  };

  if (loading && users.length === 0) {
    return (
      <div className="card card-modern">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-modern fade-in">
      <div className="card-body p-0">
        <div className="table-responsive">
          <Table hover className="table-modern mb-0">
            <thead>
              <tr>
                <th>User</th>
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
                  <td colSpan={7}>
                    <div className="empty-state-modern">
                      <i className="fas fa-users"></i>
                      <h5>No users found</h5>
                      <p>Try adjusting your filters or create a new user</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <strong>{user.fullName}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted">@{user.username}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <Badge
                        bg={getRoleBadgeVariant(user.role)}
                        className="role-badge"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg={user.isActive ? "success" : "secondary"}
                        className="status-badge"
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-muted">
                        {formatDate(user.lastLoginAt)}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="action-btn"
                          onClick={() => onEdit(user)}
                          title="Edit user"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="action-btn"
                          onClick={() => onResetPassword(user)}
                          title="Reset password"
                        >
                          <Lock size={16} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="action-btn"
                          onClick={() => handleDeactivateClick(user)}
                          disabled={!user.isActive || user.id === currentUserId}
                          title={
                            user.id === currentUserId
                              ? "Cannot deactivate yourself"
                              : user.isActive
                              ? "Deactivate user"
                              : "Already inactive"
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination and Page Size Selector */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">Rows per page:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="text-muted small">
                Showing{" "}
                {users.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, total)} of {total} users
              </div>

              <Pagination className="pagination-modern mb-0">
                {renderPagination()}
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
