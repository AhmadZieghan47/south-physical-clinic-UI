import { enhancedApi } from "../lib/enhancedApi";
import type { ExpenseCategory } from "../types/typedefs";

export async function listExpenseCategories(_onlyActive = true): Promise<ExpenseCategory[]> {
  const response = await enhancedApi.get("/expenses/categories", {
    context: { component: "ExpenseCategoriesAPI", action: "listExpenseCategories" },
  });
  return response.data;
}


