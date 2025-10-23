import { enhancedApi } from "../lib/enhancedApi";
import type { Payment, PaymentMethod } from "../types/typedefs";
import { getUser } from "../services/authService";

// ============================================================================
// PAYMENTS API
// ============================================================================

export interface ListPaymentsParams {
  patientId?: string;
  planId?: string;
  appointmentId?: string;
  method?: PaymentMethod;
  fromPaidAt?: string;
  toPaidAt?: string;
  page?: number;
  pageSize?: number;
}

export interface CreatePaymentData {
  patientId: string;
  planId?: string | null;
  appointmentId?: string | null;
  amountJd: string;
  method: PaymentMethod;
  paidAt?: string;
}

export interface UpdatePaymentData {
  planId?: string | null;
  appointmentId?: string | null;
  amountJd?: string;
  method?: PaymentMethod;
  paidAt?: string;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export async function listPayments(params: ListPaymentsParams = {}): Promise<Payment[]> {
  const response = await enhancedApi.get("/payments", {
    params,
    context: {
      component: "PaymentsAPI",
      action: "listPayments",
    },
  });
  return response.data;
}

export async function getPayment(id: string): Promise<Payment> {
  const response = await enhancedApi.get(`/payments/${id}`, {
    context: {
      component: "PaymentsAPI",
      action: "getPayment",
      additionalData: { paymentId: id },
    },
  });
  return response.data;
}

export async function createPayment(paymentData: CreatePaymentData): Promise<Payment> {
  // Get the current logged-in user
  const currentUser = getUser();
  if (!currentUser) {
    throw new Error("User must be logged in to create a payment");
  }

  // Add the recordedBy field with the current user's ID
  const paymentPayload = {
    ...paymentData,
    recordedBy: currentUser.id,
  };

  const response = await enhancedApi.post("/payments", paymentPayload, {
    context: {
      component: "PaymentsAPI",
      action: "createPayment",
      additionalData: {
        patientId: paymentData.patientId,
        amountJd: paymentData.amountJd,
        method: paymentData.method,
        recordedBy: currentUser.id,
      },
    },
  });
  return response.data;
}

export async function updatePayment(id: string, paymentData: UpdatePaymentData): Promise<Payment> {
  const response = await enhancedApi.patch(`/payments/${id}`, paymentData, {
    context: {
      component: "PaymentsAPI",
      action: "updatePayment",
      additionalData: { paymentId: id },
    },
  });
  return response.data;
}

export async function deletePayment(id: string): Promise<void> {
  await enhancedApi.delete(`/payments/${id}`, {
    context: {
      component: "PaymentsAPI",
      action: "deletePayment",
      additionalData: { paymentId: id },
    },
  });
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export async function getPaymentsForPatient(patientId: string): Promise<Payment[]> {
  return listPayments({ patientId });
}

export async function getPaymentsForPlan(planId: string): Promise<Payment[]> {
  return listPayments({ planId });
}

export async function getPaymentsForAppointment(appointmentId: string): Promise<Payment[]> {
  return listPayments({ appointmentId });
}

export async function getPaymentsByMethod(method: PaymentMethod): Promise<Payment[]> {
  return listPayments({ method });
}

export async function getPaymentsInDateRange(fromDate: string, toDate: string): Promise<Payment[]> {
  return listPayments({ fromPaidAt: fromDate, toPaidAt: toDate });
}
