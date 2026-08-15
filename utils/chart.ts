import { getTotalByCategory } from "./expense";
import type { Expense } from "@/types/expense";

export function getChartData(expenses: Expense[], categories: string[]) {
  return categories.map((category) => ({
    category,
    amount: getTotalByCategory(expenses, category),
  }));
}
