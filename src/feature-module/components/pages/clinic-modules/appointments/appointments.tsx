import { Link } from "react-router";
import { useState } from "react";

import { all_routes } from "@/feature-module/routes/all_routes";
import Datatable from "@/core/common/dataTable";
import AppointmentsFilters from "./filters";
import { useAppointmentsTable } from "@/hooks/useAppointmentsTable";
import { SmartError } from "@/components/ErrorDisplay";
import AppointmentDetailsModal from "@/core/components/AppointmentDetailsModal";
import EditAppointmentModal from "@/core/components/EditAppointmentModal";
import CancelAppointmentModal from "@/core/components/CancelAppointmentModal";
import type { ApptStatusT, SessionTypeT, CancelReasonT } from "@/types/typedefs";
import type { AppointmentWithRelations } from "@/api/enhancedAppointments";
import { cancelAppointment } from "@/api/enhancedAppointments";

const Appointments = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [status, setStatus] = useState<ApptStatusT | undefined>(undefined);
  const [sessionType, setSessionType] = useState<SessionTypeT | undefined>(
    undefined
  );
  const [therapistId, setTherapistId] = useState<string | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"createdAt" | "startsAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [appointmentToEdit, setAppointmentToEdit] =
    useState<AppointmentWithRelations | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<AppointmentWithRelations | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const {
    columns,
    appointments,
    totalCount,
    currentPage,
    currentPageSize,
    handlePageChange,
    error,
    handleRetry,
    clearError,
  } = useAppointmentsTable({
    page: 1,
    pageSize: 10,
    search: searchText,
    status,
    sessionType,
    therapistId,
    from: dateFrom,
    to: dateTo,
    sortBy,
    sortOrder,
    autoRetry: true,
    maxRetries: 3,
    showErrorToasts: true,
    onViewDetails: (appointmentId: string) => {
      setSelectedAppointmentId(appointmentId);
    },
    onEditAppointment: (appointment: AppointmentWithRelations) => {
      setAppointmentToEdit(appointment);
      setIsEditModalOpen(true);
    },
    onCancelAppointment: (appointment: AppointmentWithRelations) => {
      setAppointmentToCancel(appointment);
      setIsCancelModalOpen(true);
    },
  });

  const handleAppointmentUpdated = () => {
    setSelectedAppointmentId(null);
    // Refresh the appointments list
    handleRetry();
  };

  const handleSortByRecent = () => {
    setSortBy("createdAt");
    setSortOrder("DESC");
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setAppointmentToEdit(null);
  };

  const handleEditModalSaved = () => {
    handleAppointmentUpdated();
    handleEditModalClose();
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setAppointmentToCancel(null);
  };

  const handleCancelConfirm = async (cancelReason: CancelReasonT) => {
    if (!appointmentToCancel) return;

    setIsCancelling(true);
    try {
      await cancelAppointment(appointmentToCancel.id, cancelReason);
      handleAppointmentUpdated();
      handleCancelModalClose();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-0">
              Appointments List
              <span className="badge badge-soft-primary fw-medium border py-1 px-2 border-primary fs-13 ms-2">
                {`Total Appointments : ${totalCount}`}
              </span>
            </h4>
          </div>
          <div className="text-end d-flex">
            <Link
              to={all_routes.newAppointment}
              className="btn btn-primary fs-13 btn-md"
            >
              <i className="ti ti-plus me-1" />
              New Appointment
            </Link>
          </div>
        </div>

        <AppointmentsFilters
          searchText={searchText}
          setSearchText={setSearchText}
          status={status}
          setStatus={setStatus}
          sessionType={sessionType}
          setSessionType={setSessionType}
          therapistId={therapistId}
          setTherapistId={setTherapistId}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onSortByRecent={handleSortByRecent}
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
            dataSource={appointments}
            Selection={false}
            searchText={searchText}
            rowClassName={(record) => {
              // Highlight cancelled appointments
              return record.status === "CANCELLED" ? "table-danger" : "";
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
      <AppointmentDetailsModal
        isOpen={!!selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(null)}
        appointmentId={selectedAppointmentId}
        onAppointmentUpdated={handleAppointmentUpdated}
      />
      <EditAppointmentModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        appointment={appointmentToEdit}
        onSaved={handleEditModalSaved}
      />
      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        appointment={appointmentToCancel}
        isLoading={isCancelling}
      />
    </div>
  );
};

export default Appointments;
