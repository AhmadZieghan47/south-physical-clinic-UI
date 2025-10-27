import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, Info, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import type { ModalProps } from './types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  position = 'center',
  variant = 'default',
  headerStyle = 'default',
  filled = false,
  scrollable = false,
  staticBackdrop = false,
  closeButton = true,
  fullscreen = false,
  alert = false,
  alertIcon,
  ariaLabelledBy,
  className = '',
  dialogClassName = '',
  contentClassName = '',
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get default alert icon based on variant
  const getDefaultAlertIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h1" />;
      case 'info':
        return <Info className="h1 text-info" />;
      case 'warning':
        return <AlertTriangle className="h1 text-warning" />;
      case 'danger':
        return <XCircle className="h1" />;
      default:
        return <AlertCircle className="h1" />;
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (!staticBackdrop && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, staticBackdrop, onClose]);

  // Manage body scroll and modal-open class
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Add modal-open class and prevent body scroll
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      
      // Focus modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Remove modal-open class and restore body scroll
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      
      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!staticBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Build dynamic classes
  const dialogClasses = [
    'modal-dialog',
    size !== 'md' && size !== 'full-width' && `modal-${size}`,
    size === 'full-width' && 'modal-full-width',
    position === 'center' && 'modal-dialog-centered',
    position === 'top' && 'modal-top',
    position === 'bottom' && 'modal-bottom',
    scrollable && 'modal-dialog-scrollable',
    fullscreen === true && 'modal-fullscreen',
    fullscreen && typeof fullscreen === 'string' && `modal-fullscreen-${fullscreen}-down`,
    dialogClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = [
    'modal-content',
    filled && variant !== 'default' && `modal-filled bg-${variant}`,
    contentClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const headerClasses = [
    'modal-header',
    headerStyle === 'colored' && variant !== 'default' && `text-bg-${variant} border-0`,
    alert && 'border-0 pb-0',
  ]
    .filter(Boolean)
    .join(' ');

  const titleClasses = [
    'modal-title',
    alert && 'fw-semibold',
    alert && variant !== 'default' && !filled && `text-${variant}`,
  ]
    .filter(Boolean)
    .join(' ');

  const closeButtonClasses = [
    'btn-close',
    (headerStyle === 'colored' || filled) && variant !== 'default' && 'btn-close-white',
  ]
    .filter(Boolean)
    .join(' ');

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Modal backdrop */}
      <div className="modal-backdrop fade show" />
      
      {/* Modal */}
      <div
        className={`modal fade show d-block ${className}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy || 'modal-title'}
        onClick={handleBackdropClick}
        ref={modalRef}
      >
        <div className={dialogClasses}>
          <div className={contentClasses}>
            {/* Modal Header */}
            {(title || closeButton) && (
              <div className={headerClasses}>
                {title && (
                  <h4 className={titleClasses} id={ariaLabelledBy || 'modal-title'}>
                    {alert && variant !== 'default' && !filled && (
                      <AlertCircle className="me-2" style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }} />
                    )}
                    {title}
                  </h4>
                )}
                {closeButton && (
                  <button
                    type="button"
                    className={closeButtonClasses}
                    onClick={onClose}
                    disabled={isLoading}
                    aria-label="Close"
                  />
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="modal-body">
              {alert && (
                <div className="text-center mb-3">
                  <div className={variant !== 'default' && !filled ? `text-${variant}` : ''}>
                    {alertIcon || getDefaultAlertIcon()}
                  </div>
                  {title && alert && <h4 className="mt-2">{title}</h4>}
                </div>
              )}
              {children}
            </div>

            {/* Modal Footer */}
            {footer && (
              <div className="modal-footer">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;

