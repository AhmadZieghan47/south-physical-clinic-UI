import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDiagnoses } from './hooks/useDiagnoses';
import DiagnosesTable from './components/DiagnosesTable';
import DiagnosisFilters from './components/DiagnosisFilters';
import DiagnosisFormModal from './DiagnosisFormModal';
import type { Diagnosis, DiagnosesFilters } from '../../../types/diagnosis';
import { diagnosesApi } from '../../../api/diagnoses';
import './styles/diagnoses.css';

/**
 * Main page component for diagnoses management
 * Provides full CRUD operations for diagnoses
 */
const DiagnosesListPage: React.FC = () => {
  const [filters, setFilters] = useState<DiagnosesFilters>({
    search: '',
    category: '',
    isActive: true,
    page: 1,
    pageSize: 50
  });
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { diagnoses, loading, error, total, refetch } = useDiagnoses(filters);

  const handleCreate = () => {
    setSelectedDiagnosis(null);
    setShowFormModal(true);
  };

  const handleEdit = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setShowFormModal(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      await diagnosesApi.delete(id);
      await refetch();
    } catch (err: any) {
      console.error('Error deleting diagnosis:', err);
      alert(err.response?.data?.message || 'Failed to delete diagnosis. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setSelectedDiagnosis(null);
    refetch();
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setSelectedDiagnosis(null);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">
                <i className="fe fe-file-text me-2"></i>
                Diagnoses Management
              </h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin">Admin</Link>
                </li>
                <li className="breadcrumb-item active">Diagnoses</li>
              </ul>
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-primary"
                onClick={handleCreate}
                aria-label="Add new diagnosis"
              >
                <i className="fe fe-plus me-2"></i>
                Add New Diagnosis
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <DiagnosisFilters 
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={total}
        />

        {/* Loading State */}
        {loading && !deleteLoading && (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading diagnoses...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            <i className="fe fe-alert-circle me-2"></i>
            <strong>Error loading diagnoses:</strong> {error.message}
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
          <DiagnosesTable
            diagnoses={diagnoses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={(page) => setFilters(f => ({ ...f, page }))}
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
          <DiagnosisFormModal
            diagnosis={selectedDiagnosis}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default DiagnosesListPage;

