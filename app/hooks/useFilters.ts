import { useState } from "react";
import type { Expense } from "@/types/expense";

export function useFilters(expenses: Expense[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const getMonthYearFormat = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const matchesMonth = (exp: Expense) => {
    if (selectedMonth === "all") return true;
    return getMonthYearFormat(new Date(exp.createdAt)) === selectedMonth;
  };

  const matchesSearch = (exp: Expense) =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.notes.some((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const matchesCategory = (exp: Expense) =>
    selectedCategories.length === 0 ||
    selectedCategories.includes(exp.category);

  const filteredExpenses = expenses.filter(
    (exp) => matchesMonth(exp) && matchesSearch(exp) && matchesCategory(exp),
  );

  const summaryExpenses = expenses.filter(
    (exp) => matchesMonth(exp) && matchesCategory(exp),
  );

  const toggleCategory = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category),
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    selectedMonth,
    setSelectedMonth,
    filteredExpenses,
    summaryExpenses,
    toggleCategory,
  };
}
