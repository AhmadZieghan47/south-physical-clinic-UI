// Enhanced Patients Hook with Integrated Error Handling
// This hook demonstrates how to use the new error handling system with API calls

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router";

import {
  getPatients,
  deletePatient,
  isPatientNotFoundError,
  isPatientValidationError,
  isPatientConflictError,
  type GetPatientsResponse,
} from "../api/enhancedPatients";
import { useErrorHandling, useErrorToast } from "../hooks/useErrorHandling";
import type { Patient } from "../types/typedefs";
import { all_routes } from "../feature-module/routes/all_routes";
import DeleteModal from "../core/common/delete-modal";

// ============================================================================
// ENHANCED PATIENTS TABLE HOOK
// ============================================================================

export interface UsePatientsTableOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  autoRetry?: boolean;
  maxRetries?: number;
  showErrorToasts?: boolean;
}

export function usePatientsTable(options: UsePatientsTableOptions = {}) {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    autoRetry = true,
    maxRetries = 3,
    showErrorToasts = true,
  } = options;

  // State management
  const [patients, setPatients] = useState<Patient[]>([]);
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
      component: "PatientsTable",
      action: "fetch_patients",
    },
  });

  // Error toast notifications
  const { showError } = useErrorToast({
    autoHide: true,
    duration: 5000,
    maxToasts: 3,
  });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================================================
  // FETCH PATIENTS FUNCTION
  // ============================================================================

  const fetchPatients = useCallback(async () => {
    const result = await executeWithErrorHandling(async () => {
      const response: GetPatientsResponse = await getPatients({
        page: currentPage,
        pageSize: currentPageSize,
        search,
      });

      setPatients(response.data);
      setTotalCount(response.total);
      return response;
    });

    return result;
  }, [currentPage, currentPageSize, search, executeWithErrorHandling]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Fetch patients when dependencies change
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [search]);

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
        title: "Name",
        dataIndex: "fullName",
        render: (text: String, record: Patient) => (
          <Link
            to={`${all_routes.patientDetails.replace(":id", record.id)}`}
            className="text-dark fw-semibold"
          >
            {text}
          </Link>
        ),
      },
      {
        title: "Phone",
        dataIndex: "phone",
      },
      {
        title: "Date Of Birth",
        dataIndex: "dob",
      },
      {
        title: "Balance",
        dataIndex: "balance",
        render: (bal: any) => (
          <span
            className={`badge rounded fs-13 fw-medium
        ${
          +bal >= 0
            ? "badge-soft-success text-success border-success border"
            : "badge-soft-danger text-danger border-danger border"
        }`}
          >
            {bal}
          </span>
        ),
        sorter: (a: any, b: any) => a.balance - b.balance,
      },
      {
        title: "Status",
        dataIndex: "isActive",
        render: (isActive: boolean) => (
          <span
            className={`badge rounded fs-13 fw-medium
        ${
          isActive
            ? "badge-soft-success text-success border-success border"
            : "badge-soft-danger text-danger border-danger border"
        }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        ),
        sorter: (a: any, b: any) => (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0),
      },
      {
        title: "Quick Actions",
        dataIndex: "id",
        render: (id: string, record: Patient) => {
          const hasActivePlans =
            record.plans &&
            record.plans.some((plan: any) => plan.status === "ONGOING");

          return (
            <div className="d-flex gap-2">
              <Link
                to={`${all_routes.patientDetails.replace(":id", id)}`}
                className="btn btn-sm btn-outline-primary"
                title="View Details"
              >
                <i className="ti ti-eye" />
              </Link>
              <Link
                to={`${all_routes.editPatient?.replace(":id", id) || "#"}`}
                className="btn btn-sm btn-outline-secondary"
                title="Edit Patient"
              >
                <i className="ti ti-edit" />
              </Link>
              {!hasActivePlans && (
                <Link
                  to={`${all_routes.beginTreatment.replace(":patientId", id)}`}
                  className="btn btn-sm btn-outline-success"
                  title="Begin Treatment"
                >
                  <i className="ti ti-stethoscope" />
                </Link>
              )}
              <button
                className="btn btn-sm btn-outline-danger"
                title="Delete Patient"
                onClick={() => {
                  const patient = patients.find((p) => p.id === id);
                  if (patient) {
                    setPatientToDelete(patient);
                    setDeleteModalOpen(true);
                  }
                }}
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          );
        },
      },
    ],
    [patients]
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

  const handleDeleteConfirm = useCallback(async () => {
    if (!patientToDelete) return;

    setIsDeleting(true);
    try {
      await executeWithErrorHandling(async () => {
        await deletePatient(patientToDelete.id);

        // Refresh the patients list
        const response = await getPatients({
          page: currentPage,
          pageSize: currentPageSize,
          search,
        });

        setPatients(response.data);
        setTotalCount(response.total);
      });

      setDeleteModalOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      // Error is already handled by executeWithErrorHandling
      console.error("Failed to delete patient:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [
    patientToDelete,
    currentPage,
    currentPageSize,
    search,
    executeWithErrorHandling,
  ]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
    setPatientToDelete(null);
  }, []);

  const handleRetry = useCallback(() => {
    retry();
    fetchPatients();
  }, [retry, fetchPatients]);

  // ============================================================================
  // ERROR HANDLING HELPERS
  // ============================================================================

  const getErrorMessage = useCallback((error: any) => {
    if (isPatientNotFoundError(error)) {
      return "Patient not found. It may have been deleted by another user.";
    }
    if (isPatientValidationError(error)) {
      return "Please check the patient information and try again.";
    }
    if (isPatientConflictError(error)) {
      return "This patient already exists or conflicts with existing data.";
    }
    return "An error occurred while processing the request.";
  }, []);

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // Data
    patients,
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

    // Delete modal
    deleteModal: (
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This action will permanently remove the patient and all associated data."
        itemName={patientToDelete?.fullName}
        isLoading={isDeleting}
      />
    ),
  };
}

// ============================================================================
// SIMPLIFIED HOOK FOR BASIC USAGE
// ============================================================================

export function usePatientsTableSimple(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
) {
  return usePatientsTable({ page, pageSize, search });
}
