import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { Expense } from "@/types/expense";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setExpenses(
          data.map((e: Expense) => ({
            ...e,
            notes: e.notes ?? [],
          })),
        );
      } catch {
        toast.error("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const addExpense = async (newExpense: Expense) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newExpense.title,
          amount: newExpense.amount,
          category: newExpense.category,
          notes: newExpense.notes?.map((n) => n.content),
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setExpenses((prev) => [
        {
          ...created,
          notes: created.notes ?? [],
        },
        ...prev,
      ]);
      toast.success("Expense added!");
    } catch {
      toast.error("Failed to add expense");
    }
  };

  const editExpense = async (updated: Expense) => {
    try {
      const res = await fetch(`/api/expenses/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updated.title,
          amount: updated.amount,
          category: updated.category,
          notes: updated.notes?.map((n) => n.content) || [],
        }),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === updated.id ? { ...saved, notes: saved.notes ?? [] } : e,
        ),
      );
      toast.success("Expense updated");
    } catch {
      toast.error("Failed to update expense");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Expense deleted");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const updateExpenseCategory = (oldCategory: string, newCategory: string) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.category === oldCategory
          ? { ...expense, category: newCategory }
          : expense,
      ),
    );
  };

  const reassignExpensesToOther = (category: string) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.category === category
          ? { ...expense, category: "other" }
          : expense,
      ),
    );
  };

  return {
    expenses,
    isLoading,
    addExpense,
    editExpense,
    deleteExpense,
    updateExpenseCategory,
    reassignExpensesToOther,
  };
}
