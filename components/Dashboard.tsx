import type { Expense } from "@/types/expense";
import StatsStrip from "./StatsStrip";
import SummaryPanel from "./SummaryPanel";
import Expenses from "./Expenses";

type DashboardProps = {
  filteredExpenses: Expense[];
  summaryExpenses: Expense[];
  expenses: Expense[];
  categories: string[];
  selectedMonth: string;
  selectedCategories: string[];
  searchQuery: string;
  chartData: { category: string; amount: number }[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  onToggleCategory: (category: string, checked: boolean) => void;
  onSelectedMonth: (month: string) => void;
  setSearchQuery: (query: string) => void;
};

export default function Dashboard({
  filteredExpenses,
  summaryExpenses,
  expenses,
  categories,
  selectedMonth,
  selectedCategories,
  searchQuery,
  chartData,
  onDeleteExpense,
  onEditExpense,
  onToggleCategory,
  onSelectedMonth,
  setSearchQuery,
}: DashboardProps) {
  return (
    <div className="space-y-6">
      <StatsStrip
        summaryExpenses={summaryExpenses}
        categories={categories}
        selectedMonth={selectedMonth}
      />

      <SummaryPanel
        summaryExpenses={summaryExpenses}
        categories={categories}
        selectedMonth={selectedMonth}
        chartData={chartData}
      />

      <Expenses
        expenses={expenses}
        onDeleteExpense={onDeleteExpense}
        onEditExpense={onEditExpense}
        onToggleCategory={onToggleCategory}
        categories={categories}
        selectedCategories={selectedCategories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredExpenses={filteredExpenses}
        selectedMonth={selectedMonth}
        onSelectedMonth={onSelectedMonth}
      />
    </div>
  );
}
