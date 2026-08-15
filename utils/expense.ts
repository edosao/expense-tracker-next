import type { Expense } from "@/types/expense";
import type { INote } from "@/types/expense";
import Papa from "papaparse";
import toast from "react-hot-toast";

export function getTotalByCategory(
  expenses: Expense[],
  category: string,
): number {
  return expenses
    .filter((expense) => expense.category === category)
    .reduce((sum, expense) => sum + expense.amount, 0);
}

export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export const exportToCSV = async () => {
  try {
    const res = await fetch("/api/expenses");
    if (!res.ok) throw new Error("Failed to fetch expenses");

    const expenses = await res.json();

    if (expenses.length === 0) {
      throw new Error("No expenses to export");
    }

    const headers = ["title", "amount", "date", "category", "notes"];

    const rows = expenses.map((expense: Expense) => [
      expense.title,
      Number(expense.amount),
      new Date(expense.createdAt).toISOString().split("T")[0],
      expense.category,
      expense.notes?.[0]?.content || "",
    ]);

    const csv = Papa.unparse({ fields: headers, data: rows });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];

    link.href = url;
    link.setAttribute("download", `expenses-${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast?.success("CSV exported successfully!");
  } catch {
    throw new Error("Failed to export expenses");
  }
};
