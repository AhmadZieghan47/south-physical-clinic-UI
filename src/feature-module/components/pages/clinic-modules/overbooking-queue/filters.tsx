import { useState } from "react";
import { Select, DatePicker } from "antd";
import SearchInput from "@/core/common/dataTable/dataTableSearch";
import type { PriorityT } from "@/types/typedefs";
import { PRIORITY_CONFIGS } from "@/types/overbookingQueue";

const { RangePicker } = DatePicker;

interface OverbookingQueueFiltersProps {
  searchText: string;
  priority: PriorityT | undefined;
  isActive: boolean;
  dateFrom: string | undefined;
  dateTo: string | undefined;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: PriorityT | undefined) => void;
  onActiveChange: (value: boolean) => void;
  onDateRangeChange: (from?: string, to?: string) => void;
  onClearFilters: () => void;
}

const OverbookingQueueFilters = ({
  searchText,
  priority,
  isActive,
  dateFrom,
  dateTo,
  onSearchChange,
  onPriorityChange,
  onActiveChange,
  onDateRangeChange,
  onClearFilters,
}: OverbookingQueueFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  // ============================================================================
  // FILTER OPTIONS
  // ============================================================================

  const priorityOptions = [
    { value: undefined as PriorityT | undefined, label: "All Priorities", icon: undefined, color: undefined },
    ...Object.values(PRIORITY_CONFIGS).map((config) => ({
      value: config.value,
      label: config.label,
      icon: config.icon,
      color: config.colorClass,
    })),
  ];

  const statusOptions = [
    { value: true, label: "Active Only" },
    { value: false, label: "Inactive Only" },
  ];

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length === 2) {
      onDateRangeChange(dateStrings[0], dateStrings[1]);
    } else {
      onDateRangeChange(undefined, undefined);
    }
  };

  const hasActiveFilters = () => {
    return searchText || priority || !isActive || dateFrom || dateTo;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body py-3">
        {/* ============================================================================
        PRIMARY FILTER ROW - Always visible
        ============================================================================ */}
        <div className="row align-items-center g-3">
          <div className="col-md-6">
            <div style={{ height: "44px" }}>
              <SearchInput
                value={searchText}
                onChange={onSearchChange}
              />
            </div>
          </div>
          
          <div className="col-md-3">
            <Select
              placeholder="Filter by priority"
              value={priority}
              onChange={onPriorityChange}
              className="w-100"
              style={{ height: "44px" }}
              allowClear
              size="large"
              options={priorityOptions.map((option) => ({
                ...option,
                label: option.icon ? (
                  <div className="d-flex align-items-center gap-2">
                    <i className={option.icon} style={{ color: option.color }} />
                    {option.label}
                  </div>
                ) : (
                  option.label
                ),
              }))}
            />
          </div>

          <div className="col-md-3">
            <div className="d-flex align-items-center justify-content-end gap-2">
              <button
                type="button"
                className={`btn ${showFilters ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setShowFilters(!showFilters)}
                style={{ height: "44px" }}
              >
                <i className="ti ti-filter me-2" />
                More Filters
                <i className={`ti ti-chevron-${showFilters ? "up" : "down"} ms-2`} />
              </button>

              {hasActiveFilters() && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClearFilters}
                  style={{ height: "44px" }}
                  title="Clear all filters"
                >
                  <i className="ti ti-x" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================================
        ADVANCED FILTERS - Collapsible
        ============================================================================ */}
        {showFilters && (
          <div className="border-top mt-3 pt-3">
            <div className="row align-items-center g-3">
              <div className="col-md-4">
                <label className="form-label text-muted mb-2">
                  <i className="ti ti-calendar-event me-1" />
                  Date Range
                </label>
                <RangePicker
                  className="w-100"
                  size="large"
                  format="YYYY-MM-DD"
                  onChange={handleDateRangeChange}
                  placeholder={["Start date", "End date"]}
                  style={{ height: "44px" }}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-muted mb-2">
                  <i className="ti ti-eye me-1" />
                  Status
                </label>
                <Select
                  value={isActive}
                  onChange={onActiveChange}
                  className="w-100"
                  size="large"
                  style={{ height: "44px" }}
                  options={statusOptions.map((option) => ({
                    ...option,
                    label: (
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className={`badge ${
                            option.value
                              ? "bg-success-transparent text-success"
                              : "bg-secondary-transparent text-secondary"
                          }`}
                        >
                          {option.value ? "Active" : "Inactive"}
                        </div>
                        {option.label}
                      </div>
                    ),
                  }))}
                />
              </div>

              <div className="col-md-5">
                <label className="form-label text-muted mb-2">
                  <i className="ti ti-info-circle me-1" />
                  Quick Actions
                </label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => onPriorityChange("HIGH")}
                  >
                    <i className="ti ti-alert-triangle me-1" />
                    High Priority Only
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      onDateRangeChange(today, today);
                    }}
                  >
                    <i className="ti ti-calendar-today me-1" />
                    Added Today
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={onClearFilters}
                  >
                    <i className="ti ti-x me-1" />
                    Reset All
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            {hasActiveFilters() && (
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-muted small">Active filters:</span>
                  
                  {searchText && (
                    <span className="badge bg-primary-transparent text-primary">
                      Search: "{searchText}"
                    </span>
                  )}
                  
                  {priority && (
                    <span className={`badge ${PRIORITY_CONFIGS[priority].bgColorClass} ${PRIORITY_CONFIGS[priority].colorClass}`}>
                      Priority: {PRIORITY_CONFIGS[priority].label}
                    </span>
                  )}
                  
                  {!isActive && (
                    <span className="badge bg-secondary-transparent text-secondary">
                      Status: Inactive
                    </span>
                  )}
                  
                  {(dateFrom || dateTo) && (
                    <span className="badge bg-info-transparent text-info">
                      Dates: {dateFrom || "..."} to {dateTo || "..."}
                    </span>
                  )}
                  
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 ms-2"
                    onClick={onClearFilters}
                  >
                    <i className="ti ti-x" />
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverbookingQueueFilters;
