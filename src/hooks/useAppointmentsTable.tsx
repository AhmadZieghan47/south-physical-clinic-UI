// Enhanced Appointments Hook with Integrated Error Handling
// This hook demonstrates how to use the new error handling system with API calls
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router";

import {
  getAppointments,
  isAppointmentNotFoundError,
  isAppointmentValidationError,
  isAppointmentConflictError,
  type GetAppointmentsResponse,
  type AppointmentWithRelations,
} from "@/api/enhancedAppointments";
import { useErrorHandling, useErrorToast } from "@/hooks/useErrorHandling";
import type { ApptStatusT, SessionTypeT, LocationT } from "@/types/typedefs";
import { all_routes } from "@/feature-module/routes/all_routes";

// ============================================================================
// ENHANCED APPOINTMENTS TABLE HOOK
// ============================================================================

export interface UseAppointmentsTableOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  planId?: string;
  therapistId?: string;
  status?: ApptStatusT;
  sessionType?: SessionTypeT;
  location?: LocationT;
  from?: string;
  to?: string;
  sortBy?: "createdAt" | "startsAt";
  sortOrder?: "ASC" | "DESC";
  autoRetry?: boolean;
  maxRetries?: number;
  showErrorToasts?: boolean;
  onViewDetails?: (appointmentId: string) => void;
  onEditAppointment?: (appointment: AppointmentWithRelations) => void;
  onCancelAppointment?: (appointment: AppointmentWithRelations) => void;
}

export function useAppointmentsTable(
  options: UseAppointmentsTableOptions = {}
) {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    planId,
    therapistId,
    status,
    sessionType,
    location,
    from,
    to,
    sortBy = "createdAt",
    sortOrder = "DESC",
    autoRetry = true,
    maxRetries = 3,
    showErrorToasts = true,
    onViewDetails,
    onEditAppointment,
    onCancelAppointment,
  } = options;

  // State management
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>(
    []
  );
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Error handling
  const {
    error,
    isLoading,
    executeWithErrorHandling,
    clearError,
    retry,
    retryCount,
  } = useErrorHandling({
    autoRetry,
    maxRetries,
    context: {
      component: "AppointmentsTable",
      action: "fetch_appointments",
    },
  });

  // Error toast notifications
  const { showError } = useErrorToast({
    autoHide: true,
    duration: 5000,
    maxToasts: 3,
  });

  // ============================================================================
  // FETCH APPOINTMENTS FUNCTION
  // ============================================================================

  const fetchAppointments = useCallback(async () => {
    const result = await executeWithErrorHandling(async () => {
      const response: GetAppointmentsResponse = await getAppointments({
        page: currentPage,
        pageSize: currentPageSize,
        search,
        planId,
        therapistId,
        status,
        sessionType,
        location,
        from,
        to,
        sortBy,
        sortOrder,
      });

      setAppointments(response.data);
      setTotalCount(response.total);
      return response;
    });

    return result;
  }, [
    currentPage,
    currentPageSize,
    search,
    planId,
    therapistId,
    status,
    sessionType,
    location,
    from,
    to,
    sortBy,
    sortOrder,
    executeWithErrorHandling,
  ]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Fetch appointments when dependencies change
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [
    search,
    planId,
    therapistId,
    status,
    sessionType,
    location,
    from,
    to,
    sortBy,
    sortOrder,
  ]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error && showErrorToasts) {
      showError(error);
    }
  }, [error, showErrorToasts, showError]);

  // ============================================================================
  // TABLE COLUMNS
  // ============================================================================

  const columns = useMemo(
    () => [
      {
        title: "Date & Time",
        dataIndex: "startsAt",
        render: (startsAt: string, record: AppointmentWithRelations) => {
          const startDate = new Date(startsAt);
          const endDate = new Date(record.endsAt);

          return (
            <div>
              <div className="fw-semibold">
                {startDate.toLocaleDateString()}
              </div>
              <div className="fs-13 text-muted">
                {startDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -
                {endDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        },
        sorter: (a: AppointmentWithRelations, b: AppointmentWithRelations) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      },
      {
        title: "Patient",
        dataIndex: "plan",
        render: (plan: any) => {
          if (!plan?.patient) return "N/A";

          return (
            <div>
              <Link
                to={`${all_routes.patientDetails.replace(
                  ":id",
                  plan.patient.id
                )}`}
                className="text-dark fw-semibold"
              >
                {plan.patient.fullName}
              </Link>
              <div className="fs-13 text-muted">{plan.patient.phone}</div>
            </div>
          );
        },
      },
      {
        title: "Therapist",
        dataIndex: "therapist",
        render: (therapist: any) => {
          if (!therapist) return "N/A";

          return <div className="fw-semibold">{therapist.username}</div>;
        },
      },
      {
        title: "Session Type",
        dataIndex: "sessionType",
        render: (sessionType: SessionTypeT) => (
          <span className="badge badge-soft-primary fs-13 fw-medium">
            {sessionType.replace("_", " ")}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: ApptStatusT) => {
          const statusClass = (status: ApptStatusT) => {
            switch (status) {
              case "COMPLETED":
                return { soft: "info", text: "info" };
              case "CHECKED_IN":
                return { soft: "warning", text: "warning" };
              case "RESCHEDULED":
                return { soft: "secondary", text: "secondary" };
              case "CANCELLED":
                return { soft: "danger", text: "danger" };
              case "BOOKED":
                return { soft: "primary", text: "primary" };
              default:
                return { soft: "secondary", text: "body" };
            }
          };

          const getStatusLabel = (status: ApptStatusT): string => {
            switch (status) {
              case "BOOKED":
                return "Scheduled";
              case "CHECKED_IN":
                return "Checked In";
              case "COMPLETED":
                return "Completed";
              case "CANCELLED":
                return "Cancelled";
              case "RESCHEDULED":
                return "Rescheduled";
              default:
                return status;
            }
          };

          const cls = statusClass(status);
          const label = getStatusLabel(status);

          return (
            <span
              className={`badge fs-13 badge-soft-${cls.soft} rounded text-${cls.text} fw-medium`}
            >
              {label}
            </span>
          );
        },
        sorter: (a: AppointmentWithRelations, b: AppointmentWithRelations) =>
          a.status.localeCompare(b.status),
      },
      {
        title: "Quick Actions",
        dataIndex: "id",
        render: (id: string, record: AppointmentWithRelations) => {
          const canCancel =
            record.status === "BOOKED" || record.status === "CHECKED_IN";

          return (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                title="View Details"
                onClick={() => onViewDetails?.(id)}
              >
                <i className="ti ti-eye" />
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                title="Edit Appointment"
                onClick={() => onEditAppointment?.(record)}
              >
                <i className="ti ti-edit" />
              </button>
              {canCancel && (
                <button
                  className="btn btn-sm btn-outline-warning"
                  title="Cancel Appointment"
                  onClick={() => onCancelAppointment?.(record)}
                >
                  <i className="ti ti-x" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [onViewDetails, onEditAppointment, onCancelAppointment]
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setCurrentPageSize(pageSize);
    }
  }, []);

  const handleRetry = useCallback(() => {
    retry();
    fetchAppointments();
  }, [retry, fetchAppointments]);

  // ============================================================================
  // ERROR HANDLING HELPERS
  // ============================================================================

  const getErrorMessage = useCallback((error: any) => {
    if (isAppointmentNotFoundError(error)) {
      return "Appointment not found. It may have been deleted by another user.";
    }
    if (isAppointmentValidationError(error)) {
      return "Please check the appointment information and try again.";
    }
    if (isAppointmentConflictError(error)) {
      return "This appointment conflicts with existing data or scheduling rules.";
    }
    return "An error occurred while processing the request.";
  }, []);

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // Data
    appointments,
    totalCount,
    currentPage,
    currentPageSize,

    // Loading and error states
    loading: isLoading,
    error,
    retryCount,

    // Table configuration
    columns,

    // Event handlers
    handlePageChange,
    handleRetry,
    clearError,

    // Error handling
    getErrorMessage,
  };
}

// ============================================================================
// SIMPLIFIED HOOK FOR BASIC USAGE
// ============================================================================

export function useAppointmentsTableSimple(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
) {
  return useAppointmentsTable({ page, pageSize, search });
}
