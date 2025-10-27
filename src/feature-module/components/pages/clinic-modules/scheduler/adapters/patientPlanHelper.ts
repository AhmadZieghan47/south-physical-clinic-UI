/**
 * Patient-to-Plan Helper
 * 
 * Provides utilities to lookup active treatment plans for patients.
 * Required because scheduler works with patientId but backend appointments require planId.
 */

import { createModuleApi } from "@/lib/enhancedApi";
import type { BigIntStr } from "@/types/typedefs";

const plansApi = createModuleApi("PlansModule", {
  context: { component: "PatientPlanHelper" },
  retryable: true,
  maxRetries: 2,
});

interface TreatmentPlan {
  id: BigIntStr;
  patientId: BigIntStr;
  planType: string;
  planStatus: string;
  remainingSessions: number;
  totalSessions: number | null;
}

/**
 * Get the active (ONGOING) treatment plan for a patient
 * 
 * @param patientId Patient ID
 * @returns Plan ID if found
 * @throws Error if no active plan found
 */
export async function getActivePlanForPatient(
  patientId: BigIntStr
): Promise<BigIntStr> {
  try {
    const response = await plansApi.get<{
      data: TreatmentPlan[];
      total: number;
    }>("/plans", {
      params: {
        patientId,
        planStatus: "ONGOING",
        pageSize: 1,
      },
      context: {
        action: "get_active_plan_for_patient",
        additionalData: { patientId },
      },
    });

    const plans = response.data.data;

    if (!plans || plans.length === 0) {
      throw new Error(
        `No active treatment plan found for patient ${patientId}. Please create a plan first.`
      );
    }

    return plans[0].id;
  } catch (error) {
    console.error("Failed to get active plan for patient:", error);
    throw error;
  }
}

/**
 * Cache for patient → planId lookups
 * Reduces redundant API calls when creating multiple appointments
 */
class PatientPlanCache {
  private cache = new Map<BigIntStr, BigIntStr>();
  private cacheExpiry = new Map<BigIntStr, number>();
  private TTL = 5 * 60 * 1000; // 5 minutes

  async getOrFetch(patientId: BigIntStr): Promise<BigIntStr> {
    const now = Date.now();
    const expiry = this.cacheExpiry.get(patientId);

    // Return cached value if fresh
    if (expiry && expiry > now) {
      const cachedPlanId = this.cache.get(patientId);
      if (cachedPlanId) {
        return cachedPlanId;
      }
    }

    // Fetch fresh data
    const planId = await getActivePlanForPatient(patientId);

    // Update cache
    this.cache.set(patientId, planId);
    this.cacheExpiry.set(patientId, now + this.TTL);

    return planId;
  }

  invalidate(patientId: BigIntStr): void {
    this.cache.delete(patientId);
    this.cacheExpiry.delete(patientId);
  }

  clear(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Export singleton cache instance
export const patientPlanCache = new PatientPlanCache();

/**
 * Get active plan for patient with caching
 * Recommended for use in scheduler to reduce API calls
 */
export async function getCachedActivePlanForPatient(
  patientId: BigIntStr
): Promise<BigIntStr> {
  return patientPlanCache.getOrFetch(patientId);
}

