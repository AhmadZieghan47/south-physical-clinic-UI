export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full-width';

export type ModalPosition = 'top' | 'center' | 'bottom';

export type ModalVariant = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'dark';

export type ModalHeaderStyle = 'default' | 'colored' | 'filled';

export type ModalFullscreen = boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ModalProps {
  // Visibility control (programmatic API)
  isOpen: boolean;
  onClose: () => void;
  
  // Content
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  
  // Size variants
  size?: ModalSize;
  
  // Position variants
  position?: ModalPosition;
  
  // Style variants
  variant?: ModalVariant;
  headerStyle?: ModalHeaderStyle;
  filled?: boolean; // Entire modal with background color
  
  // Behavior
  scrollable?: boolean;
  staticBackdrop?: boolean;
  closeButton?: boolean;
  fullscreen?: ModalFullscreen;
  
  // Alert modal style
  alert?: boolean; // Compact modal with icon
  alertIcon?: React.ReactNode; // Custom icon for alert modals
  
  // Accessibility
  ariaLabelledBy?: string;
  
  // Custom classes
  className?: string;
  dialogClassName?: string;
  contentClassName?: string;
  
  // Loading state
  isLoading?: boolean;
}


