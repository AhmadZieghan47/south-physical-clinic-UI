// Enhanced Overbooking Queue API with Integrated Error Handling
// This file provides enhanced API functions for overbooking queue operations with proper error handling

import { createModuleApi } from "../lib/enhancedApi";
import type {
  QueueItemWithPatient,
  GetQueueResponse,
  CreateQueueItemRequest,
  UpdateQueueItemRequest,
  QueueFilters,
} from "../types/overbookingQueue";

// Create a specialized API client for overbooking queue module
const queueApi = createModuleApi("OverbookingQueueModule", {
  context: { component: "OverbookingQueueAPI" },
  retryable: true,
  maxRetries: 2,
});

// ============================================================================
// OVERBOOKING QUEUE API FUNCTIONS
// ============================================================================

/**
 * Get paginated list of overbooking queue items
 */
export async function getQueueItems(
  params: QueueFilters = {}
): Promise<GetQueueResponse> {
  const { 
    page, 
    pageSize, 
    search, 
    priority, 
    isActive,
    patientId,
    addedBy, 
    fromAddedAt, 
    toAddedAt 
  } = params;

  const query: Record<string, any> = {};
  
  if (page !== undefined) query.page = page;
  if (pageSize !== undefined) query.pageSize = pageSize;
  if (search && search.trim().length > 0) query.search = search.trim();
  if (priority) query.priority = priority;
  if (isActive !== undefined) query.isActive = isActive;
  if (patientId) query.patientId = patientId;
  if (addedBy) query.addedBy = addedBy;
  if (fromAddedAt) query.fromAddedAt = fromAddedAt;
  if (toAddedAt) query.toAddedAt = toAddedAt;

  const response = await queueApi.get<QueueItemWithPatient[]>("/overbooking-queue", {
    params: query,
    context: { action: "get_queue_items", additionalData: { params } },
  });

  // Handle case where backend returns array directly instead of paginated response
  const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
  
  return {
    data: data,
    total: data.length, // Since backend doesn't provide pagination yet
    page: query.page || 1,
    pageSize: query.pageSize || 20,
  };
}

/**
 * Get a specific queue item by ID
 */
export async function getQueueItemById(id: string): Promise<QueueItemWithPatient> {
  const response = await queueApi.get<QueueItemWithPatient>(
    `/overbooking-queue/${id}`,
    {
      context: { action: "get_queue_item", additionalData: { id } },
    }
  );
  return response.data;
}

/**
 * Add a patient to the overbooking queue
 */
export async function addToQueue(
  data: CreateQueueItemRequest
): Promise<QueueItemWithPatient> {
  const response = await queueApi.post<QueueItemWithPatient>(
    "/overbooking-queue",
    data,
    {
      context: { 
        action: "add_to_queue", 
        additionalData: { patientId: data.patientId, priority: data.priority } 
      },
    }
  );
  return response.data;
}

/**
 * Update a queue item (priority, active status)
 */
export async function updateQueueItem(
  id: string,
  data: UpdateQueueItemRequest
): Promise<QueueItemWithPatient> {
  const response = await queueApi.patch<QueueItemWithPatient>(
    `/overbooking-queue/${id}`,
    data,
    {
      context: { 
        action: "update_queue_item", 
        additionalData: { id, updates: data } 
      },
    }
  );
  return response.data;
}

/**
 * Remove a patient from the overbooking queue (soft delete)
 */
export async function removeFromQueue(id: string): Promise<void> {
  await queueApi.delete(`/overbooking-queue/${id}`, {
    context: { action: "remove_from_queue", additionalData: { id } },
  });
}

/**
 * Bulk update queue items (for batch priority changes)
 */
export async function bulkUpdateQueueItems(
  updates: Array<{ id: string; data: UpdateQueueItemRequest }>
): Promise<QueueItemWithPatient[]> {
  const promises = updates.map(({ id, data }) => updateQueueItem(id, data));
  return Promise.all(promises);
}

/**
 * Get queue statistics (for dashboard widgets)
 */
export async function getQueueStats(): Promise<{
  totalActive: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  addedToday: number;
}> {
  const [activeQueue, todayQueue] = await Promise.all([
    getQueueItems({ isActive: true, pageSize: 1000 }),
    getQueueItems({ 
      isActive: true, 
      fromAddedAt: new Date().toISOString().split('T')[0],
      pageSize: 1000 
    })
  ]);

  const priorities = activeQueue.data.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalActive: activeQueue.total,
    highPriority: priorities.HIGH || 0,
    mediumPriority: priorities.MEDIUM || 0,
    lowPriority: priorities.LOW || 0,
    addedToday: todayQueue.total,
  };
}

// ============================================================================
// UTILITY FUNCTIONS  
// ============================================================================

/**
 * Search patients for queue addition (debounced)
 */
export async function searchPatientsForQueue(
  query: string
): Promise<Array<{ id: string; fullName: string; phone: string }>> {
  if (query.trim().length < 2) return [];

  const response = await queueApi.get<{
    data: Array<{ id: string; fullName: string; phone: string }>;
  }>("/patients", {
    params: { search: query.trim(), pageSize: 20 },
    context: { action: "search_patients_for_queue", additionalData: { query } },
  });

  return response.data.data;
}

/**
 * Check if patient is already in active queue
 */
export async function isPatientInQueue(patientId: string): Promise<boolean> {
  try {
    const response = await getQueueItems({ 
      patientId, 
      isActive: true, 
      pageSize: 1 
    });
    return response.total > 0;
  } catch (error) {
    // If there's an error, assume not in queue to avoid blocking
    return false;
  }
}
