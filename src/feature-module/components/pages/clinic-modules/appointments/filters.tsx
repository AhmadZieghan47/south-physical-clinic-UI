import SearchInput from "@/core/common/dataTable/dataTableSearch";
import type { ApptStatusT, SessionTypeT } from "@/types/typedefs";

interface Props {
  searchText: string;
  setSearchText: (text: string) => void;
  status?: ApptStatusT;
  setStatus?: (status: ApptStatusT | undefined) => void;
  sessionType?: SessionTypeT;
  setSessionType?: (sessionType: SessionTypeT | undefined) => void;
  therapistId?: string;
  setTherapistId?: (therapistId: string | undefined) => void;
  dateFrom?: string;
  setDateFrom?: (dateFrom: string | undefined) => void;
  dateTo?: string;
  setDateTo?: (dateTo: string | undefined) => void;
  sortBy?: "createdAt" | "startsAt";
  setSortBy?: (sortBy: "createdAt" | "startsAt") => void;
  sortOrder?: "ASC" | "DESC";
  setSortOrder?: (sortOrder: "ASC" | "DESC") => void;
  onSortByRecent?: () => void;
}

export default function AppointmentsFilters({
  searchText,
  setSearchText,
  status,
  setStatus,
  sessionType,
  setSessionType,
  therapistId,
  setTherapistId,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onSortByRecent,
}: Props) {
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const clearAllFilters = () => {
    setSearchText("");
    setStatus?.(undefined);
    setSessionType?.(undefined);
    setTherapistId?.(undefined);
    setDateFrom?.(undefined);
    setDateTo?.(undefined);
  };

  const statusOptions: { value: ApptStatusT; label: string }[] = [
    { value: "BOOKED", label: "Booked" },
    { value: "CHECKED_IN", label: "Checked In" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "RESCHEDULED", label: "Rescheduled" },
  ];

  const sessionTypeOptions: { value: SessionTypeT; label: string }[] = [
    { value: "REGULAR", label: "Regular" },
    { value: "SHOCK_WAVE", label: "Shock Wave" },
    { value: "INDIBA", label: "Indiba" },
    { value: "HOME", label: "Home" },
    { value: "HOJAMA", label: "Hojama" },
    { value: "ELDER", label: "Elder" },
    { value: "HOSPITAL", label: "Hospital" },
  ];

  // Mock therapist options - in real app, this would come from an API
  const therapistOptions: { value: string; label: string }[] = [
    { value: "1", label: "Dr. Smith" },
    { value: "2", label: "Dr. Johnson" },
    { value: "3", label: "Dr. Brown" },
    { value: "4", label: "Dr. Wilson" },
  ];

  return (
    <div className="mb-3">
      {/* Search Bar */}
      <div className="search-set mb-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <div className="table-search d-flex align-items-center mb-0">
            <div className="search-input">
              <SearchInput value={searchText} onChange={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      {/* Flat Quick Filters */}
      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
        {/* Status Filter */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Status:{" "}
            {status
              ? statusOptions.find((s) => s.value === status)?.label
              : "All"}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setStatus?.(undefined)}
              >
                All Status
              </button>
            </li>
            {statusOptions.map((option) => (
              <li key={option.value}>
                <button
                  className="dropdown-item"
                  onClick={() => setStatus?.(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Session Type Filter */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Type:{" "}
            {sessionType
              ? sessionTypeOptions.find((s) => s.value === sessionType)?.label
              : "All"}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSessionType?.(undefined)}
              >
                All Types
              </button>
            </li>
            {sessionTypeOptions.map((option) => (
              <li key={option.value}>
                <button
                  className="dropdown-item"
                  onClick={() => setSessionType?.(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Therapist Filter */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Therapist:{" "}
            {therapistId
              ? therapistOptions.find((t) => t.value === therapistId)?.label
              : "All"}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setTherapistId?.(undefined)}
              >
                All Therapists
              </button>
            </li>
            {therapistOptions.map((option) => (
              <li key={option.value}>
                <button
                  className="dropdown-item"
                  onClick={() => setTherapistId?.(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Date Range Filter */}
        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            className="form-control form-control-sm"
            placeholder="From Date"
            value={dateFrom || ""}
            onChange={(e) => setDateFrom?.(e.target.value || undefined)}
            style={{ width: "140px" }}
          />
          <span className="text-muted">to</span>
          <input
            type="date"
            className="form-control form-control-sm"
            placeholder="To Date"
            value={dateTo || ""}
            onChange={(e) => setDateTo?.(e.target.value || undefined)}
            style={{ width: "140px" }}
          />
        </div>

        {/* Sort By Recent Button */}
        <button className="btn btn-primary btn-sm" onClick={onSortByRecent}>
          <i className="ti ti-sort-descending me-1" />
          Sort By: Recent
        </button>

        {/* Clear All Filters */}
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={clearAllFilters}
        >
          <i className="ti ti-x me-1" />
          Clear All
        </button>
      </div>
    </div>
  );
}
