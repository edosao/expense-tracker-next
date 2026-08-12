import type { Expense } from "@/types/expense";
import Papa from "papaparse";
import toast from "react-hot-toast";

export function getTotalByCategory(
  expenses: Expense[],
  category: string,
): number {
  return expenses
    .filter((expense) => expense.category === category)
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
}

export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
}

export const fetchExpensesFromLocalStorage = () => {
  try {
    const expenses = retrieveFromLocalStorage("expenses");
    if (!expenses) return [];
    return JSON.parse(expenses).map((e: Expense) => ({
      ...e,
      notes: e.notes ?? [],
    }));
  } catch {
    toast.error("Could not load expenses");
    return [];
  }
};

export const storeInLocalStorage = <T>(keyname: string, expenses: T) => {
  localStorage.setItem(keyname, JSON.stringify(expenses));
};

export const retrieveFromLocalStorage = (keyname: string) => {
  return localStorage.getItem(keyname);
};

export const exportToCSV = (expenses: Expense[]) => {
  const headers = ["title", "amount", "date", "category", "notes"];

  const rows = expenses.map((expense) => [
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
};
