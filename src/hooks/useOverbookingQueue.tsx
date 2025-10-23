import { useState, useEffect, useCallback, useMemo } from "react";
import { message } from "antd";
import {
  getQueueItems,
  addToQueue,
  updateQueueItem,
  removeFromQueue,
  isPatientInQueue,
} from "../api/overbookingQueue";
import { useErrorHandling, useErrorToast } from "@/hooks/useErrorHandling";
import type {
  QueueItemWithPatient,
  GetQueueResponse,
  QueueFilters,
  CreateQueueItemRequest,
  UpdateQueueItemRequest,
} from "../types/overbookingQueue";
import type { PriorityT } from "../types/typedefs";

// ============================================================================
// HOOK OPTIONS
// ============================================================================

interface UseOverbookingQueueOptions extends QueueFilters {
  autoRefresh?: boolean;
  refreshInterval?: number;
  showErrorToasts?: boolean;
  showSuccessToasts?: boolean;
  onQueueItemSelect?: (item: QueueItemWithPatient) => void;
  onError?: (error: any) => void;
}

interface UseOverbookingQueueReturn {
  queueItems: QueueItemWithPatient[];
  totalCount: number;
  currentPage: number;
  currentPageSize: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isAdding: boolean;
  isUpdating: Record<string, boolean>;
  isRemoving: Record<string, boolean>;
  error: any;
  hasError: boolean;
  refresh: () => Promise<GetQueueResponse | null>;
  handleRetry: () => void;
  clearError: () => void;
  addPatientToQueue: (data: CreateQueueItemRequest) => Promise<QueueItemWithPatient | null>;
  updateQueueItemData: (id: string, data: UpdateQueueItemRequest) => Promise<QueueItemWithPatient | null>;
  removePatientFromQueue: (id: string) => Promise<void>;
  handlePageChange: (page: number, pageSize?: number) => void;
  updateFilters: (filters: Partial<QueueFilters>) => void;
  clearFilters: () => void;
  isPatientAlreadyInQueue: (patientId: string) => Promise<boolean>;
  tableColumns: any[];
  formatPriority: (priority: PriorityT) => { label: string; className: string; icon: string };
  formatDateTime: (dateTime: string) => string;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useOverbookingQueue(
  options: UseOverbookingQueueOptions = {}
): UseOverbookingQueueReturn {
  const {
    page = 1,
    pageSize = 20,
    search,
    priority,
    isActive = true,
    addedBy,
    fromAddedAt,
    toAddedAt,
    autoRefresh = false,
    refreshInterval = 30000,
    showErrorToasts = true,
    showSuccessToasts = true,
    onQueueItemSelect,
    onError,
  } = options;

  // ============================================================================
  // STATE
  // ============================================================================

  const [queueData, setQueueData] = useState<GetQueueResponse>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 20,
  });

  const [filters, setFilters] = useState<QueueFilters>({
    page,
    pageSize,
    search,
    priority,
    isActive,
    addedBy,
    fromAddedAt,
    toAddedAt,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});

  // Error handling
  const {
    error,
    isLoading,
    executeWithErrorHandling,
    clearError,
    retry,
  } = useErrorHandling({
    autoRetry: false,
    maxRetries: 2,
    context: {
      component: "OverbookingQueue",
      action: "manage_queue",
    },
  });

  const { showError } = useErrorToast({
    autoHide: true,
    duration: 5000,
    maxToasts: 3,
  });

  // ============================================================================
  // UTILITY FUNCTIONS - DEFINED EARLY
  // ============================================================================

  const formatPriority = useCallback((priority: PriorityT) => {
    const configs = {
      HIGH: { label: "High", className: "badge bg-danger-transparent text-danger", icon: "ti ti-alert-triangle" },
      MEDIUM: { label: "Medium", className: "badge bg-warning-transparent text-warning", icon: "ti ti-clock" },
      LOW: { label: "Low", className: "badge bg-info-transparent text-info", icon: "ti ti-calendar" },
    };
    return configs[priority] || configs.LOW;
  }, []);

  const formatDateTime = useCallback((dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  }, []);

  const isPatientAlreadyInQueue = useCallback(
    async (patientId: string): Promise<boolean> => {
      try {
        return await isPatientInQueue(patientId);
      } catch (error) {
        return false;
      }
    },
    []
  );

  const hasError = useMemo(() => error !== null, [error]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error && showErrorToasts) {
      showError(error);
    }
  }, [error, showErrorToasts, showError]);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const fetchQueueData = useCallback(async (showLoading = true) => {
    if (!showLoading) {
      setIsRefreshing(true);
    }
    
    const result = await executeWithErrorHandling(async () => {
      const response = await getQueueItems(filters);
      setQueueData(response);
      return response;
    });

    setIsRefreshing(false);
    return result;
  }, [filters, executeWithErrorHandling]);

  const addPatientToQueue = useCallback(
    async (data: CreateQueueItemRequest): Promise<QueueItemWithPatient | null> => {
      try {
        setIsAdding(true);
        const newItem = await addToQueue(data);
        await fetchQueueData(false);
        
        if (showSuccessToasts) {
          message.success("Patient added to queue successfully");
        }
        
        return newItem;
      } catch (err) {
        const error = err as any;
        if (showErrorToasts) {
          showError(error);
        }
        onError?.(error);
        return null;
      } finally {
        setIsAdding(false);
      }
    },
    [fetchQueueData, showErrorToasts, showSuccessToasts, showError, onError]
  );

  const updateQueueItemData = useCallback(
    async (id: string, data: UpdateQueueItemRequest): Promise<QueueItemWithPatient | null> => {
      try {
        setIsUpdating(prev => ({ ...prev, [id]: true }));
        const updatedItem = await updateQueueItem(id, data);
        
        setQueueData(prev => ({
          ...prev,
          data: prev.data.map(item => 
            item.id === id ? updatedItem : item
          ),
        }));
        
        if (showSuccessToasts) {
          message.success("Queue item updated successfully");
        }
        
        return updatedItem;
      } catch (err) {
        const error = err as any;
        if (showErrorToasts) {
          showError(error);
        }
        onError?.(error);
        return null;
      } finally {
        setIsUpdating(prev => ({ ...prev, [id]: false }));
      }
    },
    [showErrorToasts, showSuccessToasts, showError, onError]
  );

  const removePatientFromQueue = useCallback(
    async (id: string): Promise<void> => {
      try {
        setIsRemoving(prev => ({ ...prev, [id]: true }));
        await removeFromQueue(id);
        
        setQueueData(prev => ({
          ...prev,
          data: prev.data.filter(item => item.id !== id),
          total: prev.total - 1,
        }));
        
        if (showSuccessToasts) {
          message.success("Patient removed from queue");
        }
      } catch (err) {
        const error = err as any;
        if (showErrorToasts) {
          showError(error);
        }
        onError?.(error);
      } finally {
        setIsRemoving(prev => ({ ...prev, [id]: false }));
      }
    },
    [showErrorToasts, showSuccessToasts, showError, onError]
  );

  // ============================================================================
  // TABLE CONFIGURATION
  // ============================================================================

  const tableColumns = useMemo(() => [
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority: PriorityT) => {
        const config = formatPriority(priority);
        return (
          <span className={config.className}>
            <i className={`${config.icon} me-1`} />
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Patient",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId: string, record: any) => (
        <div>
          <div className="fw-medium">Patient ID: {patientId}</div>
          <small className="text-muted">
            {record.patient?.fullName || "Patient data loading..."}
          </small>
        </div>
      ),
    },
    {
      title: "Added",
      dataIndex: "addedAt",
      key: "addedAt",
      width: 160,
      render: (addedAt: string) => formatDateTime(addedAt),
    },
    {
      title: "Added By",
      dataIndex: "addedBy",
      key: "addedBy",
      width: 140,
      render: (addedBy: string, record: any) => 
        record.addedByUser?.username || `User ID: ${addedBy}`,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onQueueItemSelect?.(record)}
            disabled={isUpdating[record.id] || isRemoving[record.id]}
            title="Edit Queue Item"
          >
            <i className="ti ti-edit" />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              if (confirm("Are you sure you want to remove this patient from the queue?")) {
                removePatientFromQueue(record.id);
              }
            }}
            disabled={isUpdating[record.id] || isRemoving[record.id]}
            title="Remove from Queue"
          >
            {isRemoving[record.id] ? (
              <i className="ti ti-loader spin" />
            ) : (
              <i className="ti ti-trash" />
            )}
          </button>
        </div>
      ),
    },
  ], [formatPriority, formatDateTime, onQueueItemSelect, isUpdating, isRemoving, removePatientFromQueue]);

  // ============================================================================
  // PAGINATION & FILTERS
  // ============================================================================

  const handlePageChange = useCallback((newPage: number, newPageSize?: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
      ...(newPageSize && { pageSize: newPageSize }),
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<QueueFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: 20,
      isActive: true,
    });
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchQueueData(true);
  }, [fetchQueueData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchQueueData(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchQueueData]);

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  const refresh = useCallback(() => fetchQueueData(false), [fetchQueueData]);

  const handleRetry = useCallback(() => {
    retry();
    fetchQueueData(true);
  }, [retry, fetchQueueData]);

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    queueItems: queueData?.data || [],
    totalCount: queueData?.total || 0,
    currentPage: queueData?.page || 1,
    currentPageSize: queueData?.pageSize || 20,
    isLoading,
    isRefreshing,
    isAdding,
    isUpdating,
    isRemoving,
    error,
    hasError,
    refresh,
    handleRetry,
    clearError,
    addPatientToQueue,
    updateQueueItemData,
    removePatientFromQueue,
    handlePageChange,
    updateFilters,
    clearFilters,
    isPatientAlreadyInQueue,
    tableColumns,
    formatPriority,
    formatDateTime,
  };
}
