"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import CategoryManager from "../components/CategoryManager";
import AddExpenseDialog from "../components/AddExpenseDialog";
import FAB from "../components/FAB";
import Dashboard from "../components/Dashboard";
import type { ActiveTab, Expense } from "../types/expense";
import { getTotalByCategory } from "../utils/expense";
import toast from "react-hot-toast";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("expenses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, expensesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/expenses"),
        ]);

        const categoriesData = await categoriesRes.json();
        const expensesData = await expensesRes.json();

        const names = categoriesData.map((c: { name: string }) => c.name);

        if (!names.includes("other")) {
          await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "other" }),
          });
          names.push("other");
        }

        setCategories(names);
        setExpenses(
          expensesData.map((e: Expense) => ({ ...e, notes: e.notes ?? [] })),
        );
      } catch {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddExpense = async (newExpense: Expense) => {
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

      if (!res.ok) throw new Error("Failed to save");

      const created = await res.json();
      setExpenses((prev) => [
        { ...created, notes: created.notes ?? [] },
        ...prev,
      ]);
      toast.success("Expense added!");
    } catch {
      toast.error("Failed to add expense. Please check your connection.");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Expense deleted");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const handleEditExpense = async (updated: Expense) => {
    try {
      const res = await fetch(`/api/expenses/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updated.title,
          amount: updated.amount,
          category: updated.category,
        }),
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === updated.id ? { ...saved, notes: updated.notes } : e,
        ),
      );
      toast.success("Expense updated");
    } catch {
      toast.error("Failed to update expense");
    }
  };

  const handleAddCategory = async (category: string) => {
    if (categories.includes(category.toLowerCase())) return false;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: category.toLowerCase() }),
      });

      if (!res.ok) throw new Error();

      setCategories((prev) => [...prev, category.toLowerCase()]);
      toast.success("Category added");
      return true;
    } catch {
      toast.error("Failed to add category");
      return false;
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (category === "other") return;

    try {
      const res = await fetch(`/api/categories?name=${category}`);

      if (!res.ok) {
        toast.error("Failed to find category");
        return;
      }

      const data = await res.json();
      const categoryId = data.id;

      const deleteRes = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!deleteRes.ok) throw new Error();

      setCategories((prev) => prev.filter((c) => c !== category));
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.category === category
            ? { ...expense, category: "other" }
            : expense,
        ),
      );
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleEditCategory = async (
    oldCategory: string,
    newCategory: string,
  ) => {
    if (oldCategory === "other") return;

    const formattedCategory = newCategory.trim().toLowerCase();
    if (!formattedCategory || formattedCategory === "other") return;

    if (categories.includes(formattedCategory)) {
      toast.error("Category already exists");
      return;
    }

    try {
      const res = await fetch(`/api/categories?name=${oldCategory}`);

      if (!res.ok) {
        toast.error("Failed to find category");
        return;
      }

      const data = await res.json();
      const categoryId = data.id;

      const updateRes = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formattedCategory }),
      });

      if (!updateRes.ok) {
        toast.error("Failed to update category");
        return;
      }

      setCategories((prev) =>
        prev.map((c) => (c === oldCategory ? formattedCategory : c)),
      );

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.category === oldCategory
            ? { ...expense, category: formattedCategory }
            : expense,
        ),
      );

      setSelectedCategories((prev) =>
        prev.map((c) => (c === oldCategory ? formattedCategory : c)),
      );

      toast.success("Category updated");
    } catch {
      toast.error("Network error — please check your connection");
    }
  };

  const toggleCategory = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category),
    );
  };

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

  const chartData = categories.map((category) => ({
    category,
    amount: getTotalByCategory(summaryExpenses, category),
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "expenses" && (
        <>
          <div className="max-w-5xl mx-auto px-4 py-6">
            <Dashboard
              filteredExpenses={filteredExpenses}
              summaryExpenses={summaryExpenses}
              expenses={expenses}
              categories={categories}
              selectedMonth={selectedMonth}
              selectedCategories={selectedCategories}
              searchQuery={searchQuery}
              chartData={chartData}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
              onToggleCategory={toggleCategory}
              onSelectedMonth={setSelectedMonth}
              setSearchQuery={setSearchQuery}
            />
          </div>

          <FAB onClick={() => setShowAddExpense(true)} />

          <AddExpenseDialog
            open={showAddExpense}
            onClose={() => setShowAddExpense(false)}
            onAddExpense={handleAddExpense}
            categories={categories}
          />
        </>
      )}

      {activeTab === "categories" && (
        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onEditCategory={handleEditCategory}
        />
      )}
    </div>
  );
}
