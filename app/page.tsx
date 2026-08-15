"use client";

import { useState } from "react";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import CategoryManager from "../components/CategoryManager";
import AddExpenseDialog from "../components/AddExpenseDialog";
import FAB from "../components/FAB";
import Dashboard from "../components/Dashboard";
import type { ActiveTab } from "../types/expense";
import { useExpenses } from "./hooks/useExpenses";
import { useCategories } from "./hooks/useCategories";
import { useFilters } from "./hooks/useFilters";
import { getTotalByCategory } from "../utils/expense";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("expenses");
  const [showAddExpense, setShowAddExpense] = useState(false);

  const {
    expenses,
    isLoading,
    addExpense,
    editExpense,
    deleteExpense,
    updateExpenseCategory,
    reassignExpensesToOther,
  } = useExpenses();

  const { categories, addCategory, editCategory, deleteCategory } =
    useCategories(updateExpenseCategory, reassignExpensesToOther);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    selectedMonth,
    setSelectedMonth,
    filteredExpenses,
    summaryExpenses,
    toggleCategory,
  } = useFilters(expenses);

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
              onDeleteExpense={deleteExpense}
              onEditExpense={editExpense}
              onToggleCategory={toggleCategory}
              onSelectedMonth={setSelectedMonth}
              setSearchQuery={setSearchQuery}
            />
          </div>

          <FAB onClick={() => setShowAddExpense(true)} />

          <AddExpenseDialog
            open={showAddExpense}
            onClose={() => setShowAddExpense(false)}
            onAddExpense={addExpense}
            categories={categories}
          />
        </>
      )}

      {activeTab === "categories" && (
        <CategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onEditCategory={editCategory}
        />
      )}
    </div>
  );
}
