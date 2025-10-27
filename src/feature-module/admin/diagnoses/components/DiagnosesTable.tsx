import React from 'react';
import type { Diagnosis } from '../../../../types/diagnosis';

interface DiagnosesTableProps {
  diagnoses: Diagnosis[];
  onEdit: (diagnosis: Diagnosis) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
  total: number;
}

/**
 * Table component for displaying diagnoses with actions
 * Includes pagination controls
 */
const DiagnosesTable: React.FC<DiagnosesTableProps> = ({
  diagnoses,
  onEdit,
  onDelete,
  onPageChange,
  currentPage,
  pageSize,
  total
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleDeleteClick = (diagnosis: Diagnosis) => {
    if (window.confirm(`Are you sure you want to deactivate "${diagnosis.nameEn}"?\n\nThis will set its status to inactive and it will no longer appear in selection lists.`)) {
      onDelete(diagnosis.id);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover table-center mb-0">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name (English)</th>
                <th>Name (Arabic)</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {diagnoses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div className="empty-state">
                      <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
                      <p className="text-muted mb-0">No diagnoses found</p>
                      <small className="text-muted">Try adjusting your filters or create a new diagnosis</small>
                    </div>
                  </td>
                </tr>
              ) : (
                diagnoses.map((diagnosis) => (
                  <tr key={diagnosis.id}>
                    <td>
                      <strong className="text-primary">{diagnosis.code}</strong>
                    </td>
                    <td>{diagnosis.nameEn}</td>
                    <td className="text-end" dir="rtl">{diagnosis.nameAr}</td>
                    <td>
                      {diagnosis.category ? (
                        <span className="badge badge-info">
                          {diagnosis.category}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${diagnosis.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {diagnosis.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">{formatDate(diagnosis.createdAt)}</small>
                    </td>
                    <td className="text-end">
                      <div className="actions d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm bg-success-light"
                          onClick={() => onEdit(diagnosis)}
                          title="Edit diagnosis"
                          aria-label={`Edit ${diagnosis.nameEn}`}
                        >
                          <i className="fe fe-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm bg-danger-light"
                          onClick={() => handleDeleteClick(diagnosis)}
                          title={diagnosis.isActive ? 'Deactivate diagnosis' : 'Already inactive'}
                          aria-label={`Deactivate ${diagnosis.nameEn}`}
                          disabled={!diagnosis.isActive}
                        >
                          <i className="fe fe-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-wrapper mt-4">
            <nav aria-label="Diagnoses pagination">
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <i className="fe fe-chevron-left"></i> Previous
                  </button>
                </li>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => onPageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    Next <i className="fe fe-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Results info */}
        <div className="text-center mt-3">
          <small className="text-muted">
            Showing {diagnoses.length === 0 ? 0 : ((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, total)} of {total} diagnoses
          </small>
        </div>
      </div>
    </div>
  );
};

export default DiagnosesTable;

