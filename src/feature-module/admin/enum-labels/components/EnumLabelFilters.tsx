import React from 'react';
import { Search, X } from 'lucide-react';
import type { EnumLabelFilters } from '../../../../types/enumLabel';
import EnumTypeSelector from './EnumTypeSelector';

interface EnumLabelFiltersProps {
  filters: EnumLabelFilters;
  onFiltersChange: (filters: EnumLabelFilters) => void;
  totalCount: number;
  customTypes?: string[];
}

/**
 * Filters component for enum labels
 */
const EnumLabelFiltersComponent: React.FC<EnumLabelFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
  customTypes
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleTypeChange = (enumType: string) => {
    onFiltersChange({ ...filters, enumType, page: 1 });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      enumType: '',
      search: '',
      page: 1,
      pageSize: filters.pageSize
    });
  };

  const hasActiveFilters = filters.search || filters.enumType;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row align-items-end">
          {/* Type Selector */}
          <div className="col-12 mb-3">
            <EnumTypeSelector
              selectedType={filters.enumType}
              onTypeChange={handleTypeChange}
              customTypes={customTypes}
            />
          </div>

          {/* Search */}
          <div className="col-md-6">
            <div className="form-group mb-0">
              <label htmlFor="search" className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  id="search"
                  type="text"
                  className="form-control"
                  placeholder="Search by code or label..."
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {/* Results Count & Clear Filters */}
          <div className="col-md-6 text-end">
            <div className="d-flex justify-content-end align-items-center" style={{ height: '38px' }}>
              <span className="text-muted me-3">
                {totalCount} {totalCount === 1 ? 'result' : 'results'}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleClearFilters}
                >
                  <X size={14} className="me-1" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnumLabelFiltersComponent;

