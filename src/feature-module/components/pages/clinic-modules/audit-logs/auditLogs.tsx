import { useState } from "react";
import Datatable from "@/core/common/dataTable";
import { useAuditLogTable } from "@/hooks/useAuditLogTable";
import AuditDetailsModal from "./AuditDetailsModal";

const AuditLogs = () => {
  const [filters, setFilters] = useState({
    entity: "",
    action: "",
    role: "",
  });

  const {
    columns,
    auditLogs,
    currentPage,
    currentPageSize,
    handlePageChange,
    handleRowClick,
    selectedAuditLog,
    modalOpen,
    closeModal,
  } = useAuditLogTable({
    page: 1,
    pageSize: 20,
    entity: filters.entity || undefined,
    action: filters.action || undefined,
    role: filters.role || undefined,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-0">
              Audit Logs
              <span className="badge badge-soft-primary fw-medium border py-1 px-2 border-primary fs-13 ms-2">
                System Activity Log
              </span>
            </h4>
          </div>
        </div>

        {/* Simple Filters */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Entity</label>
            <select
              className="form-select"
              value={filters.entity}
              onChange={(e) => handleFilterChange("entity", e.target.value)}
            >
              <option value="">All Entities</option>
              <option value="patient">Patient</option>
              <option value="appointment">Appointment</option>
              <option value="plan">Plan</option>
              <option value="payment">Payment</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Action</label>
            <select
              className="form-select"
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="RECEPTION">Reception</option>
              <option value="THERAPIST">Therapist</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setFilters({ entity: "", action: "", role: "" })}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <Datatable
            columns={columns}
            dataSource={auditLogs}
            Selection={false}
            searchText=""
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
            pagination={{
              serverSide: true,
              current: currentPage,
              pageSize: currentPageSize,
              total: auditLogs.length,
              onChange: handlePageChange,
            }}
          />
        </div>
      </div>

      {/* Audit Details Modal */}
      <AuditDetailsModal
        isOpen={modalOpen}
        onClose={closeModal}
        auditLog={selectedAuditLog}
      />
    </div>
  );
};

export default AuditLogs;
