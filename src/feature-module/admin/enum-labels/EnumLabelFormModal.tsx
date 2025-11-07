import React from 'react';
import { Plus, Edit } from 'lucide-react';
import type { EnumLabel } from '../../../api/enumLabels';
import { useEnumLabelForm } from './hooks/useEnumLabelForm';
import { COMMON_ENUM_TYPES } from '../../../types/enumLabel';

interface EnumLabelFormModalProps {
  enumLabel: EnumLabel | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal component for creating and editing enum labels
 * Includes form validation and bilingual input support
 */
const EnumLabelFormModal: React.FC<EnumLabelFormModalProps> = ({
  enumLabel,
  onClose,
  onSuccess
}) => {
  const { formData, errors, loading, handleChange, handleSubmit } = useEnumLabelForm({
    enumLabel,
    onSuccess
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const isEditMode = !!enumLabel;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1}
      role="dialog"
      aria-labelledby="enumLabelFormModalTitle"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="enumLabelFormModalTitle">
              {isEditMode ? (
                <>
                  <Edit className="me-2" size={20} />
                  Edit Enum Label
                </>
              ) : (
                <>
                  <Plus className="me-2" size={20} />
                  Add New Enum Label
                </>
              )}
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
                {/* Enum Type */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="enumType" className="form-label">
                      Enum Type <span className="text-danger">*</span>
                    </label>
                    {isEditMode ? (
                      <input
                        id="enumType"
                        type="text"
                        className="form-control"
                        value={formData.enumType}
                        disabled
                        aria-label="Enum type (read-only in edit mode)"
                      />
                    ) : (
                      <>
                        <input
                          id="enumType"
                          type="text"
                          list="enumTypeList"
                          className={`form-control ${errors.enumType ? 'is-invalid' : ''}`}
                          name="enumType"
                          value={formData.enumType}
                          onChange={handleChange}
                          placeholder="Select or enter enum type"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.enumType}
                          aria-describedby={errors.enumType ? 'enumType-error enumType-help' : 'enumType-help'}
                          disabled={loading}
                        />
                        <datalist id="enumTypeList">
                          {COMMON_ENUM_TYPES.map(type => (
                            <option key={type.value} value={type.value} />
                          ))}
                        </datalist>
                      </>
                    )}
                    {errors.enumType && (
                      <div id="enumType-error" className="invalid-feedback" role="alert">
                        {errors.enumType}
                      </div>
                    )}
                    <small id="enumType-help" className="form-text text-muted">
                      {isEditMode ? 'Enum type cannot be changed' : 'e.g., SessionType, Location, ApptStatus'}
                    </small>
                  </div>
                </div>

                {/* Code */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="code" className="form-label">
                      Code <span className="text-danger">*</span>
                    </label>
                    {isEditMode ? (
                      <input
                        id="code"
                        type="text"
                        className="form-control"
                        value={formData.code}
                        disabled
                        aria-label="Code (read-only in edit mode)"
                      />
                    ) : (
                      <input
                        id="code"
                        type="text"
                        className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="e.g., PT_ASSESSMENT"
                        maxLength={100}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.code}
                        aria-describedby={errors.code ? 'code-error code-help' : 'code-help'}
                        disabled={loading}
                      />
                    )}
                    {errors.code && (
                      <div id="code-error" className="invalid-feedback" role="alert">
                        {errors.code}
                      </div>
                    )}
                    <small id="code-help" className="form-text text-muted">
                      {isEditMode ? 'Code cannot be changed' : 'Unique code within this enum type (uppercase recommended)'}
                    </small>
                  </div>
                </div>
              </div>

              {/* Labels Section */}
              <div className="row">
                {/* Label (English) */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="labelEn" className="form-label">
                      Label (English) <span className="text-danger">*</span>
                    </label>
                    <input
                      id="labelEn"
                      type="text"
                      className={`form-control ${errors.labelEn ? 'is-invalid' : ''}`}
                      name="labelEn"
                      value={formData.labelEn}
                      onChange={handleChange}
                      placeholder="Enter label in English"
                      maxLength={255}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.labelEn}
                      aria-describedby={errors.labelEn ? 'labelEn-error' : undefined}
                      disabled={loading}
                    />
                    {errors.labelEn && (
                      <div id="labelEn-error" className="invalid-feedback" role="alert">
                        {errors.labelEn}
                      </div>
                    )}
                  </div>
                </div>

                {/* Label (Arabic) */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="labelAr" className="form-label">
                      Label (Arabic) <span className="text-danger">*</span>
                    </label>
                    <input
                      id="labelAr"
                      type="text"
                      className={`form-control ${errors.labelAr ? 'is-invalid' : ''}`}
                      name="labelAr"
                      value={formData.labelAr}
                      onChange={handleChange}
                      placeholder="أدخل التصنيف بالعربية"
                      dir="rtl"
                      maxLength={255}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.labelAr}
                      aria-describedby={errors.labelAr ? 'labelAr-error' : undefined}
                      disabled={loading}
                    />
                    {errors.labelAr && (
                      <div id="labelAr-error" className="invalid-feedback" role="alert">
                        {errors.labelAr}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Note: Additional fields (descriptions, displayOrder, isActive) will be added when backend supports them */}
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
                    <i className={`fe ${isEditMode ? 'fe-check' : 'fe-plus'} me-1`}></i>
                    {isEditMode ? 'Update' : 'Create'}
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

export default EnumLabelFormModal;

