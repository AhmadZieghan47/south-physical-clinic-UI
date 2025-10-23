// Error Display Styles
// This file contains CSS styles for error display components

// Note: These styles are designed to work with Bootstrap classes
// Import this file in your main CSS or use the classes directly in components

export const errorDisplayStyles = `
  /* Error Alert Styles */
  .error-alert {
    border-radius: 8px;
    border: 1px solid;
    padding: 1rem;
    margin-bottom: 1rem;
    position: relative;
  }

  .error-alert.danger {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
  }

  .error-alert.warning {
    background-color: #fff3cd;
    border-color: #ffeaa7;
    color: #856404;
  }

  .error-alert.info {
    background-color: #d1ecf1;
    border-color: #bee5eb;
    color: #0c5460;
  }

  .error-alert.secondary {
    background-color: #e2e3e5;
    border-color: #d6d8db;
    color: #383d41;
  }

  /* Error Icon Styles */
  .error-icon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  .error-icon.critical {
    color: #dc3545;
  }

  .error-icon.high {
    color: #ffc107;
  }

  .error-icon.medium {
    color: #17a2b8;
  }

  .error-icon.low {
    color: #6c757d;
  }

  /* Validation Error Styles */
  .validation-error {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .validation-error ul {
    margin-bottom: 0;
    padding-left: 1.5rem;
  }

  .validation-error li {
    margin-bottom: 0.5rem;
  }

  .validation-error li:last-child {
    margin-bottom: 0;
  }

  .field-label {
    font-weight: 600;
    color: #495057;
  }

  /* Network Error Styles */
  .network-error {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .network-error .retry-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  /* Auth Error Styles */
  .auth-error {
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .auth-error .login-prompt {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .auth-error .countdown {
    font-size: 0.875rem;
    color: #6c757d;
  }

  /* Error Toast Styles */
  .error-toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1055;
    max-width: 400px;
  }

  .error-toast {
    background-color: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    margin-bottom: 0.5rem;
  }

  .error-toast .toast-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    padding: 0.75rem 1rem;
    border-radius: 8px 8px 0 0;
  }

  .error-toast .toast-body {
    padding: 1rem;
  }

  /* Error Boundary Styles */
  .error-boundary {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1rem;
  }

  .error-boundary .error-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  /* Retry Button Styles */
  .retry-button {
    background-color: #007bff;
    border: 1px solid #007bff;
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }

  .retry-button:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }

  .retry-button:disabled {
    background-color: #6c757d;
    border-color: #6c757d;
    cursor: not-allowed;
  }

  /* Loading States */
  .error-loading {
    opacity: 0.6;
    pointer-events: none;
  }

  .error-loading .retry-button {
    background-color: #6c757d;
    border-color: #6c757d;
    cursor: not-allowed;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .error-toast-container {
      top: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
      max-width: none;
    }

    .error-alert,
    .validation-error,
    .network-error,
    .auth-error {
      padding: 0.75rem;
    }

    .error-boundary {
      margin: 0.5rem;
      padding: 1rem;
    }

    .network-error .retry-buttons,
    .error-boundary .error-actions {
      flex-direction: column;
    }

    .network-error .retry-buttons button,
    .error-boundary .error-actions button {
      width: 100%;
    }
  }

  /* Animation Styles */
  .error-toast-enter {
    opacity: 0;
    transform: translateX(100%);
  }

  .error-toast-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
  }

  .error-toast-exit {
    opacity: 1;
    transform: translateX(0);
  }

  .error-toast-exit-active {
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
  }

  /* Focus Styles for Accessibility */
  .error-alert button:focus,
  .retry-button:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .error-alert.danger {
      background-color: #ffffff;
      border-color: #000000;
      color: #000000;
    }

    .error-alert.warning {
      background-color: #ffffff;
      border-color: #000000;
      color: #000000;
    }

    .error-alert.info {
      background-color: #ffffff;
      border-color: #000000;
      color: #000000;
    }

    .error-alert.secondary {
      background-color: #ffffff;
      border-color: #000000;
      color: #000000;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .error-toast-enter-active,
    .error-toast-exit-active {
      transition: none;
    }

    .retry-button {
      transition: none;
    }
  }
`;

export default errorDisplayStyles;
