import React from 'react';
import type { DiagnosesFilters } from '../../../../types/diagnosis';

interface DiagnosisFiltersProps {
  filters: DiagnosesFilters;
  onFiltersChange: (filters: DiagnosesFilters) => void;
  totalCount: number;
}

/**
 * Filter component for diagnoses list
 * Includes search, category filter, and status filter
 */
const DiagnosisFilters: React.FC<DiagnosisFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, category: e.target.value, page: 1 });
  };

  const handleStatusChange = (status: boolean | null) => {
    onFiltersChange({ ...filters, isActive: status, page: 1 });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      isActive: true,
      page: 1,
      pageSize: filters.pageSize
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.isActive !== true;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row align-items-end">
          {/* Search */}
          <div className="col-md-4">
            <div className="form-group mb-0">
              <label htmlFor="diagnosis-search" className="form-label">
                <i className="fe fe-search me-1"></i> Search
              </label>
              <input
                id="diagnosis-search"
                type="text"
                className="form-control"
                placeholder="Search by code or name..."
                value={filters.search}
                onChange={handleSearchChange}
                aria-label="Search diagnoses by code or name"
              />
            </div>
          </div>

          {/* Category */}
          <div className="col-md-3">
            <div className="form-group mb-0">
              <label htmlFor="diagnosis-category" className="form-label">
                <i className="fe fe-tag me-1"></i> Category
              </label>
              <select
                id="diagnosis-category"
                className="form-control"
                value={filters.category}
                onChange={handleCategoryChange}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                <option value="Musculoskeletal">Musculoskeletal</option>
                <option value="Neurological">Neurological</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Geriatric">Geriatric</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="col-md-3">
            <div className="form-group mb-0">
              <label className="form-label">
                <i className="fe fe-activity me-1"></i> Status
              </label>
              <div className="btn-group w-100" role="group" aria-label="Filter by status">
                <button
                  type="button"
                  className={`btn btn-sm ${filters.isActive === null ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleStatusChange(null)}
                  aria-pressed={filters.isActive === null}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filters.isActive === true ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleStatusChange(true)}
                  aria-pressed={filters.isActive === true}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filters.isActive === false ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleStatusChange(false)}
                  aria-pressed={filters.isActive === false}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="col-md-2 d-flex align-items-center justify-content-end">
            <div className="d-flex gap-2 align-items-center">
              <span className="badge badge-info badge-lg">
                <i className="fe fe-database me-1"></i>
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

export default DiagnosisFilters;

