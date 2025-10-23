// Overbooking Queue Types
// Matching backend typedefs and API contract

import type { BigIntStr, ISODateTime, PriorityT } from "./typedefs";

// Core overbooking queue interfaces matching backend
export interface OverbookingQueue {
  id: BigIntStr;
  patientId: BigIntStr;
  priority: PriorityT;
  isActive: boolean;
  addedBy: BigIntStr;
  addedAt: ISODateTime;
}

export interface InsertOverbookingQueue {
  id?: BigIntStr;
  patientId: BigIntStr;
  priority: PriorityT;
  isActive?: boolean;
  addedBy: BigIntStr;
  addedAt?: ISODateTime;
}

export interface UpdateOverbookingQueue {
  patientId?: BigIntStr;
  priority?: PriorityT;
  isActive?: boolean;
  addedBy?: BigIntStr;
  addedAt?: ISODateTime;
}

// Extended interfaces for UI display
export interface QueueItemWithPatient extends OverbookingQueue {
  patient: {
    id: BigIntStr;
    fullName: string;
    phone: string;
    dob: string;
  };
  addedByUser: {
    id: BigIntStr;
    username: string;
  };
}

// API response types
export interface GetQueueResponse {
  data: QueueItemWithPatient[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateQueueItemRequest {
  patientId: string;
  priority: PriorityT;
  isActive?: boolean;
  addedBy: string;
  addedAt?: string;
}

export interface UpdateQueueItemRequest {
  priority?: PriorityT;
  isActive?: boolean;
}

// Filter and search parameters
export interface QueueFilters {
  page?: number;
  pageSize?: number;
  search?: string; // patient name search
  priority?: PriorityT;
  isActive?: boolean;
  patientId?: string; // filter by specific patient
  addedBy?: string;
  fromAddedAt?: string;
  toAddedAt?: string;
}

// Component prop types
export interface OverbookingQueueProps {
  initialFilters?: Partial<QueueFilters>;
  onPatientSelect?: (patientId: string) => void;
  compact?: boolean; // for dashboard widget
}

export interface AddQueueItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: QueueItemWithPatient) => void;
  preselectedPatient?: { id: string; name: string };
}

export interface EditQueueItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: QueueItemWithPatient) => void;
  queueItem: QueueItemWithPatient | null;
}

// Priority display configuration
export interface PriorityConfig {
  value: PriorityT;
  label: string;
  colorClass: string;
  bgColorClass: string;
  icon: string;
  description: string;
}

export const PRIORITY_CONFIGS: Record<PriorityT, PriorityConfig> = {
  HIGH: {
    value: "HIGH",
    label: "High Priority",
    colorClass: "text-danger",
    bgColorClass: "bg-danger-transparent",
    icon: "ti ti-alert-triangle",
    description: "Urgent - needs immediate attention",
  },
  MEDIUM: {
    value: "MEDIUM", 
    label: "Medium Priority",
    colorClass: "text-warning",
    bgColorClass: "bg-warning-transparent",
    icon: "ti ti-clock",
    description: "Important - schedule within 24 hours",
  },
  LOW: {
    value: "LOW",
    label: "Low Priority", 
    colorClass: "text-info",
    bgColorClass: "bg-info-transparent",
    icon: "ti ti-calendar",
    description: "Standard - schedule when convenient",
  },
};

// Table column configuration
export interface QueueTableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
}

export const QUEUE_TABLE_COLUMNS: QueueTableColumn[] = [
  { key: "priority", title: "Priority", width: "120px" },
  { key: "patient", title: "Patient", sortable: true },
  { key: "phone", title: "Phone", width: "140px" },
  { key: "addedAt", title: "Added", sortable: true, width: "160px" },
  { key: "addedBy", title: "Added By", width: "140px" },
  { key: "actions", title: "Actions", width: "120px" },
];
