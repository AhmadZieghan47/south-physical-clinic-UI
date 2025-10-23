import { useState } from "react";
import { Link } from "react-router";
import { all_routes } from "@/feature-module/routes/all_routes";
import Datatable from "@/core/common/dataTable";
import { useOverbookingQueue } from "@/hooks/useOverbookingQueue";
import { SmartError } from "@/components/ErrorDisplay";
import type { PriorityT } from "@/types/typedefs";
import type { QueueItemWithPatient } from "@/types/overbookingQueue";
import OverbookingQueueFilters from "./filters";
import AddQueueItemModal from "./addQueueItemModal";
import EditQueueItemModal from "./editQueueItemModal";

const OverbookingQueue = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [searchText, setSearchText] = useState<string>("");
  const [priority, setPriority] = useState<PriorityT | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<QueueItemWithPatient | null>(null);

  // ============================================================================
  // HOOK INTEGRATION
  // ============================================================================
  
  const {
    queueItems,
    totalCount,
    currentPage,
    currentPageSize,
    isLoading,
    isRefreshing,
    isAdding,
    error,
    hasError,
    tableColumns,
    refresh,
    handleRetry,
    clearError,
    handlePageChange,
    updateFilters,
    clearFilters,
  } = useOverbookingQueue({
    page: 1,
    pageSize: 20,
    search: searchText,
    priority,
    isActive,
    fromAddedAt: dateFrom,
    toAddedAt: dateTo,
    autoRefresh: true,
    refreshInterval: 30000,
    showErrorToasts: true,
    showSuccessToasts: true,
    onQueueItemSelect: (item) => {
      setSelectedQueueItem(item);
      setIsEditModalOpen(true);
    },
  });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleSearch = (value: string) => {
    setSearchText(value);
    updateFilters({ search: value });
  };

  const handlePriorityFilter = (value: PriorityT | undefined) => {
    setPriority(value);
    updateFilters({ priority: value });
  };

  const handleActiveFilter = (value: boolean) => {
    setIsActive(value);
    updateFilters({ isActive: value });
  };

  const handleDateRangeFilter = (from?: string, to?: string) => {
    setDateFrom(from);
    setDateTo(to);
    updateFilters({ fromAddedAt: from, toAddedAt: to });
  };

  const handleClearFilters = () => {
    setSearchText("");
    setPriority(undefined);
    setIsActive(true);
    setDateFrom(undefined);
    setDateTo(undefined);
    clearFilters();
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleAddModalSuccess = () => {
    setIsAddModalOpen(false);
    // Queue will auto-refresh due to the hook
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedQueueItem(null);
  };

  const handleEditModalSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedQueueItem(null);
    // Local state will be updated by the hook
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderEmptyState = () => (
    <div className="text-center py-5">
      <div className="mb-4">
        <i className="ti ti-users-group" style={{ fontSize: "4rem", color: "var(--gray-400)" }} />
      </div>
      <h5 className="text-muted mb-3">No patients in queue</h5>
      <p className="text-muted mb-4">
        {searchText || priority || dateFrom || dateTo
          ? "No patients match your current filters."
          : "The overbooking queue is currently empty. Add patients when all appointment slots are full."}
      </p>
      <button
        className="btn btn-primary"
        onClick={() => setIsAddModalOpen(true)}
      >
        <i className="ti ti-plus me-2" />
        Add Patient to Queue
      </button>
    </div>
  );

  const renderErrorState = () => (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <SmartError
          error={error}
          showRetryButton={true}
          onRetry={handleRetry}
          onDismiss={clearError}
          className="mb-4"
        />
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading queue...</p>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  if (hasError && !queueItems.length) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.dashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Overbooking Queue</li>
                </ul>
              </div>
            </div>
          </div>
          {renderErrorState()}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* ============================================================================
        PAGE HEADER
        ============================================================================ */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={all_routes.dashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Overbooking Queue</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ============================================================================
        PAGE TITLE & ACTIONS
        ============================================================================ */}
        <div className="row">
          <div className="col-sm-12">
            <div className="card-table">
              <div className="card-body">
                <div className="page-table-header mb-2">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="doctor-table-blk">
                        <h3>Overbooking Queue</h3>
                        <div className="doctor-search-blk">
                          <div className="d-flex align-items-center gap-3">
                            <div className="text-muted">
                              <i className="ti ti-users me-1" />
                              {totalCount} {totalCount === 1 ? "patient" : "patients"} in queue
                            </div>
                            {isRefreshing && (
                              <div className="text-primary">
                                <i className="ti ti-refresh spin me-1" />
                                Refreshing...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto text-end float-end ms-auto download-grp">
                      <button
                        className="btn btn-primary"
                        onClick={() => setIsAddModalOpen(true)}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <>
                            <i className="ti ti-loader spin me-2" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="ti ti-plus me-2" />
                            Add to Queue
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-primary ms-2"
                        onClick={refresh}
                        disabled={isRefreshing}
                      >
                        <i className="ti ti-refresh" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ============================================================================
                FILTERS
                ============================================================================ */}
                <OverbookingQueueFilters
                  searchText={searchText}
                  priority={priority}
                  isActive={isActive}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onSearchChange={handleSearch}
                  onPriorityChange={handlePriorityFilter}
                  onActiveChange={handleActiveFilter}
                  onDateRangeChange={handleDateRangeFilter}
                  onClearFilters={handleClearFilters}
                />

                {/* ============================================================================
                ERROR DISPLAY (non-blocking)
                ============================================================================ */}
                {hasError && queueItems && queueItems.length > 0 && (
                  <div className="mb-3">
                    <SmartError
                      error={error}
                      showRetryButton={true}
                      onRetry={handleRetry}
                      onDismiss={clearError}
                    />
                  </div>
                )}

                {/* ============================================================================
                DATA TABLE
                ============================================================================ */}
                {isLoading ? (
                  renderLoadingState()
                ) : !queueItems || queueItems.length === 0 ? (
                  renderEmptyState()
                ) : (
                  <div className="table-responsive">
                    <Datatable
                      columns={tableColumns}
                      dataSource={queueItems}
                      searchText=""
                      pagination={{
                        current: currentPage,
                        pageSize: currentPageSize,
                        total: totalCount,
                        onChange: handlePageChange,
                        serverSide: true,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================================
        MODALS
        ============================================================================ */}
        <AddQueueItemModal
          isOpen={isAddModalOpen}
          onClose={handleAddModalClose}
          onSuccess={handleAddModalSuccess}
        />

        <EditQueueItemModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSuccess={handleEditModalSuccess}
          queueItem={selectedQueueItem}
        />
      </div>
    </div>
  );
};

export default OverbookingQueue;
