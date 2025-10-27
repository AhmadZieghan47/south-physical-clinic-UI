import { enhancedApi } from "../lib/enhancedApi";
import type { Expense, ExpenseMethod } from "../types/typedefs";
import { getUser } from "../services/authService";

export interface ListExpensesParams {
  categoryId?: string;
  method?: ExpenseMethod;
  vendorName?: string;
  fromPaidAt?: string;
  toPaidAt?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateExpenseData {
  categoryId: string;
  amountJd: string;
  method: ExpenseMethod;
  vendorName?: string | null;
  notes?: string | null;
  paidAt?: string;
}

export interface UpdateExpenseData {
  categoryId?: string;
  amountJd?: string;
  method?: ExpenseMethod;
  vendorName?: string | null;
  notes?: string | null;
  paidAt?: string;
}

export async function listExpenses(params: ListExpensesParams = {}): Promise<Expense[]> {
  const response = await enhancedApi.get("/expenses", {
    params,
    context: { component: "ExpensesAPI", action: "listExpenses" },
  });
  return response.data;
}

export async function getExpense(id: string): Promise<Expense> {
  const response = await enhancedApi.get(`/expenses/${id}`, {
    context: { component: "ExpensesAPI", action: "getExpense", additionalData: { expenseId: id } },
  });
  return response.data;
}

export async function createExpense(data: CreateExpenseData): Promise<Expense> {
  const currentUser = getUser();
  if (!currentUser) throw new Error("User must be logged in to create an expense");
  const payload = { ...data, recordedBy: currentUser.id };
  const response = await enhancedApi.post("/expenses", payload, {
    context: { component: "ExpensesAPI", action: "createExpense", additionalData: { ...data, recordedBy: currentUser.id } },
  });
  return response.data;
}

export async function updateExpense(id: string, data: UpdateExpenseData): Promise<Expense> {
  const response = await enhancedApi.patch(`/expenses/${id}`, data, {
    context: { component: "ExpensesAPI", action: "updateExpense", additionalData: { expenseId: id } },
  });
  return response.data;
}

export async function deleteExpense(id: string): Promise<void> {
  await enhancedApi.delete(`/expenses/${id}`, {
    context: { component: "ExpensesAPI", action: "deleteExpense", additionalData: { expenseId: id } },
  });
}


