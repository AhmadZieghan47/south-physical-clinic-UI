import React from "react";
import type { UserRole } from "../../../../api/users";

export interface UsersFilters {
  search: string;
  role?: UserRole;
  page: number;
  pageSize: number;
}

interface UserFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
  totalCount: number;
}

/**
 * Filter component for users list
 * Includes search and role filter
 */
const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      role: e.target.value as UserRole,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      page: 1,
      pageSize: filters.pageSize,
    });
  };

  const hasActiveFilters = filters.search || filters.role;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row align-items-end">
          {/* Search */}
          <div className="col-md-6">
            <div className="form-group mb-0">
              <label htmlFor="user-search" className="form-label">
                <i className="fe fe-search me-1"></i> Search
              </label>
              <input
                id="user-search"
                type="text"
                className="form-control"
                placeholder="Search by name, username, or email..."
                value={filters.search}
                onChange={handleSearchChange}
                aria-label="Search users by name, username, or email"
              />
            </div>
          </div>

          {/* Role */}
          <div className="col-md-4">
            <div className="form-group mb-0">
              <label htmlFor="user-role" className="form-label">
                <i className="fe fe-user me-1"></i> Role
              </label>
              <select
                id="user-role"
                className="form-control"
                value={filters.role}
                onChange={handleRoleChange}
                aria-label="Filter by role"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="RECEPTION">Reception</option>
                <option value="THERAPIST">Therapist</option>
              </select>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="col-md-2 d-flex align-items-center justify-content-end">
            <div className="d-flex gap-2 align-items-center">
              <span className="badge badge-info badge-lg">
                <i className="fe fe-users me-1"></i>
                {totalCount} Total
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleClearFilters}
                  title="Clear all filters"
                  aria-label="Clear all filters"
                >
                  <i className="fe fe-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;

