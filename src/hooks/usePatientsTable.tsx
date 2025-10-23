import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";

import { getPatients, deletePatient } from "../api/patients";
import type { Patient } from "../types/typedefs";
import { all_routes } from "../feature-module/routes/all_routes";
import DeleteModal from "../core/common/delete-modal";

export function usePatientsTable(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        title: "Quick Actions",
        dataIndex: "id",
        render: (id: string) => (
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
        ),
      },
    ],
    [patients, setPatientToDelete, setDeleteModalOpen]
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getPatients({ page: currentPage, pageSize: currentPageSize, search })
      .then(({ data, total }) => {
        if (isMounted) {
          setPatients(data);
          setTotalCount(total);
        }
      })
      .catch((error) => {
        // handle errors gracefully – e.g. show toast or log
        console.error("Failed to fetch patients:", error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // cleanup: prevent state update if the component unmounts before fetch completes
    return () => {
      isMounted = false;
    };
  }, [currentPage, currentPageSize, search]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [search]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setCurrentPageSize(pageSize);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;

    setIsDeleting(true);
    try {
      await deletePatient(patientToDelete.id);
      // Refresh the patients list
      const { data, total } = await getPatients({
        page: currentPage,
        pageSize: currentPageSize,
        search,
      });
      setPatients(data);
      setTotalCount(total);
      setDeleteModalOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      // Handle error - you might want to show a toast notification here
      console.error("Failed to delete patient:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  return {
    columns,
    patients,
    totalCount,
    loading,
    currentPage,
    currentPageSize,
    handlePageChange,
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
