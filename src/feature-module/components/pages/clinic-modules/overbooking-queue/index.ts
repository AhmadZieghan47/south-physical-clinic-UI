// Overbooking Queue Components Index
// Centralized exports for all overbooking queue related components

export { default as OverbookingQueue } from './overbookingQueue';
export { default as OverbookingQueueFilters } from './filters';
export { default as AddQueueItemModal } from './addQueueItemModal';
export { default as EditQueueItemModal } from './editQueueItemModal';

// Re-export types for convenience
export type {
  OverbookingQueue as OverbookingQueueType,
  QueueItemWithPatient,
  QueueFilters,
  CreateQueueItemRequest,
  UpdateQueueItemRequest,
  OverbookingQueueProps,
  AddQueueItemModalProps,
  EditQueueItemModalProps,
  PRIORITY_CONFIGS,
} from '@/types/overbookingQueue';

// Re-export API functions
export {
  getQueueItems,
  addToQueue,
  updateQueueItem,
  removeFromQueue,
  getQueueStats,
  searchPatientsForQueue,
  isPatientInQueue,
} from '@/api/overbookingQueue';

// Re-export hook
export { useOverbookingQueue } from '@/hooks/useOverbookingQueue';
