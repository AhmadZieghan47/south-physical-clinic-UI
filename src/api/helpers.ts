/**
 * API Helper Utilities for Memory Safety
 * These utilities help prevent memory leaks by validating API responses
 */

/**
 * Validates and ensures API response is an array
 * Prevents memory issues from storing non-array data in array state
 * 
 * @example
 * const response = await api.get('/items');
 * const items = ensureArray<Item>(response.data);
 * setItems(items); // Safe - always an array
 */
export function ensureArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  
  console.error('API returned non-array data:', typeof data, data);
  return [];
}

/**
 * Validates API response exists and is the expected type
 * 
 * @example
 * const response = await api.get('/user/1');
 * const user = validateResponse<User>(response.data, 'object');
 * if (user) {
 *   setUser(user);
 * }
 */
export function validateResponse<T>(
  data: unknown,
  expectedType: 'array' | 'object'
): T | null {
  if (expectedType === 'array' && !Array.isArray(data)) {
    console.error('Expected array but got:', typeof data);
    return null;
  }
  
  if (
    expectedType === 'object' &&
    (typeof data !== 'object' || data === null || Array.isArray(data))
  ) {
    console.error('Expected object but got:', typeof data);
    return null;
  }
  
  return data as T;
}

/**
 * Limits an array to a maximum size to prevent memory issues
 * 
 * @example
 * const hugeArray = await fetchAllData();
 * const limitedArray = limitArraySize(hugeArray, 500);
 */
export function limitArraySize<T>(array: T[], maxSize: number): T[] {
  if (!Array.isArray(array)) {
    console.error('limitArraySize: Expected array but got:', typeof array);
    return [];
  }
  
  if (array.length > maxSize) {
    console.warn(`Array truncated from ${array.length} to ${maxSize} items to prevent memory issues`);
    return array.slice(0, maxSize);
  }
  
  return array;
}

