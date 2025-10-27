import React from 'react';
import type { Diagnosis } from '../../../types/diagnosis';
import { useDiagnosisForm } from './hooks/useDiagnosisForm';

interface DiagnosisFormModalProps {
  diagnosis: Diagnosis | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal component for creating and editing diagnoses
 * Includes form validation and error handling
 */
const DiagnosisFormModal: React.FC<DiagnosisFormModalProps> = ({
  diagnosis,
  onClose,
  onSuccess
}) => {
  const { formData, errors, loading, handleChange, handleSubmit } = useDiagnosisForm({
    diagnosis,
    onSuccess
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1}
      role="dialog"
      aria-labelledby="diagnosisFormModalTitle"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="diagnosisFormModalTitle">
              <i className={`fe ${diagnosis ? 'fe-edit' : 'fe-plus'} me-2`}></i>
              {diagnosis ? 'Edit Diagnosis' : 'Add New Diagnosis'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              {/* General error message */}
              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  <i className="fe fe-alert-circle me-2"></i>
                  {errors.general}
                </div>
              )}

              <div className="row">
                {/* Code */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="diagnosis-code" className="form-label">
                      Code <span className="text-danger">*</span>
                    </label>
                    <input
                      id="diagnosis-code"
                      type="text"
                      className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="e.g., M54.5"
                      maxLength={50}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.code}
                      aria-describedby={errors.code ? 'code-error code-help' : 'code-help'}
                      disabled={loading}
                    />
                    {errors.code && (
                      <div id="code-error" className="invalid-feedback" role="alert">
                        {errors.code}
                      </div>
                    )}
                    <small id="code-help" className="form-text text-muted">
                      ICD-10 diagnosis code (max 50 characters)
                    </small>
                  </div>
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="diagnosis-category" className="form-label">
                      Category
                    </label>
                    <select
                      id="diagnosis-category"
                      className="form-control"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                      disabled={loading}
                      aria-label="Select diagnosis category"
                    >
                      <option value="">Select category</option>
                      <option value="Musculoskeletal">Musculoskeletal</option>
                      <option value="Neurological">Neurological</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Respiratory">Respiratory</option>
                      <option value="Pediatric">Pediatric</option>
                      <option value="Geriatric">Geriatric</option>
                      <option value="Sports">Sports</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Name (English) */}
              <div className="form-group">
                <label htmlFor="diagnosis-name-en" className="form-label">
                  Name (English) <span className="text-danger">*</span>
                </label>
                <input
                  id="diagnosis-name-en"
                  type="text"
                  className={`form-control ${errors.nameEn ? 'is-invalid' : ''}`}
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  placeholder="Enter diagnosis name in English"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.nameEn}
                  aria-describedby={errors.nameEn ? 'nameEn-error' : undefined}
                  disabled={loading}
                />
                {errors.nameEn && (
                  <div id="nameEn-error" className="invalid-feedback" role="alert">
                    {errors.nameEn}
                  </div>
                )}
              </div>

              {/* Name (Arabic) */}
              <div className="form-group">
                <label htmlFor="diagnosis-name-ar" className="form-label">
                  Name (Arabic) <span className="text-danger">*</span>
                </label>
                <input
                  id="diagnosis-name-ar"
                  type="text"
                  className={`form-control ${errors.nameAr ? 'is-invalid' : ''}`}
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                  placeholder="أدخل اسم التشخيص بالعربية"
                  dir="rtl"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.nameAr}
                  aria-describedby={errors.nameAr ? 'nameAr-error' : undefined}
                  disabled={loading}
                />
                {errors.nameAr && (
                  <div id="nameAr-error" className="invalid-feedback" role="alert">
                    {errors.nameAr}
                  </div>
                )}
              </div>

              {/* Active Status */}
              <div className="form-group mb-0">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="diagnosis-isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleChange({
                      target: { name: 'isActive', value: e.target.checked }
                    } as any)}
                    disabled={loading}
                  />
                  <label className="custom-control-label" htmlFor="diagnosis-isActive">
                    Active
                  </label>
                </div>
                <small className="form-text text-muted">
                  Only active diagnoses will be available for selection in treatment plans
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                <i className="fe fe-x me-1"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className={`fe ${diagnosis ? 'fe-check' : 'fe-plus'} me-1`}></i>
                    {diagnosis ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default DiagnosisFormModal;

