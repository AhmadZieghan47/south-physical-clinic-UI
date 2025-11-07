import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tag, Plus } from "lucide-react";
import { useEnumLabels } from "./hooks/useEnumLabels";
import { useEnumTypes } from "./hooks/useEnumTypes";
import EnumLabelsTable from "./components/EnumLabelsTable";
import EnumLabelFiltersComponent from "./components/EnumLabelFilters";
import EnumLabelFormModal from "./EnumLabelFormModal";
import type { EnumLabelFilters } from "../../../types/enumLabel";
import type { EnumLabel } from "../../../api/enumLabels";
import { enumLabelsApi } from "../../../api/enumLabels";
import "./styles/enum-labels.css";
import { ErrorBoundary } from "@/core/common/error-display/ErrorDisplay";

/**
 * Main page component for enum labels management
 * Provides full CRUD operations for enum labels
 */
const EnumLabelsListPage: React.FC = () => {
  const [filters, setFilters] = useState<EnumLabelFilters>({
    enumType: "",
    search: "",
    page: 1,
    pageSize: 100,
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedEnumLabel, setSelectedEnumLabel] = useState<EnumLabel | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { enumLabels, loading, error, total, refetch } = useEnumLabels(filters);
  const { enumTypes } = useEnumTypes();

  // Extract custom types from loaded enum labels
  const customTypesFromLabels = React.useMemo(() => {
    if (!enumLabels || !Array.isArray(enumLabels)) return [];
    const types = new Set(enumLabels.map(label => label.enumType));
    return Array.from(types).filter(type => 
      !['SessionType', 'Location', 'ApptStatus', 'CancelReason', 'Gender', 'Role', 'PriceBasis'].includes(type)
    );
  }, [enumLabels]);

  const handleCreate = () => {
    setSelectedEnumLabel(null);
    setShowFormModal(true);
  };

  const handleEdit = (enumLabel: EnumLabel) => {
    setSelectedEnumLabel(enumLabel);
    setShowFormModal(true);
  };

  const handleDelete = async (enumType: string, code: string) => {
    setDeleteLoading(true);
    try {
      await enumLabelsApi.delete(enumType, code);
      await refetch();
    } catch (err: any) {
      console.error("Error deleting enum label:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete enum label. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setSelectedEnumLabel(null);
    refetch();
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setSelectedEnumLabel(null);
  };

  // Use custom types from labels or enum types as fallback
  const customTypes = customTypesFromLabels.length > 0 
    ? customTypesFromLabels 
    : enumTypes.map((t) => t.type).filter(
        (type) =>
          ![
            "SessionType",
            "Location",
            "ApptStatus",
            "CancelReason",
            "Gender",
            "Role",
            "PriceBasis",
          ].includes(type)
      );

  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">
                  <Tag className="me-2" size={24} />
                  Enum Labels Management
                </h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Admin</Link>
                  </li>
                  <li className="breadcrumb-item active">Enum Labels</li>
                </ul>
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-primary"
                  onClick={handleCreate}
                  aria-label="Add new enum label"
                >
                  <Plus className="me-2" size={18} />
                  Add New Label
                </button>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info" role="alert">
            <i className="fe fe-info me-2"></i>
            <strong>Internationalization System:</strong> Enum labels provide
            multilingual support for dropdown values and system constants across
            the application.
          </div>

          {/* Filters */}
          <EnumLabelFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={total}
            customTypes={customTypes}
          />

          {/* Loading State */}
          {loading && !deleteLoading && (
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading enum labels...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              <i className="fe fe-alert-circle me-2"></i>
              <strong>Error loading enum labels:</strong> {error.message}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => refetch()}
              >
                <i className="fe fe-refresh-cw me-1"></i>
                Retry
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <EnumLabelsTable
              enumLabels={enumLabels}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPageChange={(page) =>
                setFilters((f: EnumLabelFilters) => ({ ...f, page }))
              }
              currentPage={filters.page}
              pageSize={filters.pageSize}
              total={total}
            />
          )}

          {/* Delete Loading Overlay */}
          {deleteLoading && (
            <div className="loading-overlay">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Deleting...</span>
              </div>
            </div>
          )}

          {/* Form Modal */}
          {showFormModal && (
            <EnumLabelFormModal
              enumLabel={selectedEnumLabel}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EnumLabelsListPage;
