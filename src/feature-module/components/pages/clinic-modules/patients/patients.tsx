import { Link } from "react-router";
import { useState } from "react";

import { all_routes } from "@/feature-module/routes/all_routes";
import Datatable from "@/core/common/dataTable";
import SearchFilters from "./filters";
import { usePatientsTable } from "@/hooks/useEnhancedPatientsTable";
import { SmartError } from "@/components/ErrorDisplay";

const Patients = () => {
  const [searchText, setSearchText] = useState<string>("");

  const {
    columns,
    patients,
    totalCount,
    currentPage,
    currentPageSize,
    handlePageChange,
    deleteModal,
    error,
    handleRetry,
    clearError,
  } = usePatientsTable({
    page: 1,
    pageSize: 10,
    search: searchText,
    autoRetry: true,
    maxRetries: 3,
    showErrorToasts: true,
  });

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-0">
              Patients List
              <span className="badge badge-soft-primary fw-medium border py-1 px-2 border-primary fs-13 ms-2">
                {`Total Patients : ${totalCount}`}
              </span>
            </h4>
          </div>
          <div className="text-end d-flex">
            <div className="dropdown me-1">
              <Link
                to="#"
                className="btn btn-md fs-14 fw-normal border bg-white rounded text-dark d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Export
              </Link>
            </div>
            <Link
              to={all_routes.createPatient}
              className="btn btn-primary ms-2 fs-13 btn-md"
            >
              <i className="ti ti-plus me-1" />
              New Patient
            </Link>
          </div>
        </div>
        <SearchFilters
          searchText={searchText}
          setSearchText={setSearchText as any}
        />

        {/* Error Display */}
        {error && (
          <div className="mb-3">
            <SmartError
              error={error}
              onRetry={handleRetry}
              onDismiss={clearError}
              showSuggestions={true}
              showRetryButton={true}
            />
          </div>
        )}

        <div className="table-responsive">
          <Datatable
            columns={columns}
            dataSource={patients}
            Selection={false}
            searchText={searchText}
            rowClassName={(record) => {
              const hasPlans = record.plans && record.plans.length > 0;
              return hasPlans ? "" : "table-warning";
            }}
            pagination={{
              serverSide: true,
              current: currentPage,
              pageSize: currentPageSize,
              total: totalCount,
              onChange: handlePageChange,
            }}
          />
        </div>
      </div>
      {deleteModal}
    </div>
  );
};

export default Patients;
