import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-semibold text-danger">
              <i className="ti ti-alert-triangle me-2"></i>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <div className="modal-body pt-0">
            <div className="text-center mb-3">
              <div className="avatar-lg mx-auto mb-4">
                <div className="avatar-title bg-danger-subtle text-danger rounded-circle fs-20">
                  <i className="ti ti-trash"></i>
                </div>
              </div>
            </div>
            <p className="text-muted text-center mb-3">
              {message}
            </p>
            {itemName && (
              <div className="alert alert-warning" role="alert">
                <strong>Item:</strong> {itemName}
              </div>
            )}
            <div className="alert alert-danger" role="alert">
              <i className="ti ti-alert-circle me-2"></i>
              <strong>Warning:</strong> This action cannot be undone.
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-light"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="ti ti-trash me-2"></i>
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
