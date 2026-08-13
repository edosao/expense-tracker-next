import { useState } from "react";
import { motion } from "framer-motion";
import Expense from "./Expense";
import type { Expense as ExpenseType } from "@/types/expense";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, ArrowUpDown, Download } from "lucide-react";
import { exportToCSV } from "@/utils/expense";

type ExpensesProps = {
  expenses: ExpenseType[];
  categories: string[];
  selectedCategories: string[];
  searchQuery: string;
  selectedMonth: string;
  filteredExpenses: ExpenseType[];
  setSearchQuery: (query: string) => void;
  onSelectedMonth: (month: string) => void;
  onToggleCategory?: (category: string, checked: boolean) => void;
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: ExpenseType) => void;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function Expenses({
  expenses,
  categories,
  searchQuery,
  selectedCategories,
  selectedMonth,
  onSelectedMonth,
  onDeleteExpense,
  onEditExpense,
  onToggleCategory,
  filteredExpenses,
  setSearchQuery,
}: ExpensesProps) {
  const [sortBy, setSortBy] = useState<string>("Newest");

  const handleDeleteExpense = (id: string) => {
    onDeleteExpense(id);
  };

  const handleEditExpense = (updated: ExpenseType) => {
    onEditExpense(updated);
  };

  const sortOptions = ["Newest", "Oldest", "Highest-amount", "Lowest-amount"];

  const sortByNewest = () =>
    [...filteredExpenses].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const sortByOldest = () =>
    [...filteredExpenses].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  const sortByHighestAmount = () =>
    [...filteredExpenses].sort((a, b) => b.amount - a.amount);
  const sortByLowestAmount = () =>
    [...filteredExpenses].sort((a, b) => a.amount - b.amount);

  const handleSorting = (option: string) => setSortBy(option);

  const getSortedExpenses = () => {
    switch (sortBy) {
      case "Newest":
        return sortByNewest();
      case "Oldest":
        return sortByOldest();
      case "Highest-amount":
        return sortByHighestAmount();
      case "Lowest-amount":
        return sortByLowestAmount();
      default:
        return filteredExpenses;
    }
  };

  const sortedExpenses = getSortedExpenses();

  return (
    <div className="space-y-4">
      <div className="space-y-3 border-b border-muted pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">💰 Expenses</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-10"
              title="Export to CSV"
              onClick={() => exportToCSV(filteredExpenses)}
              disabled={filteredExpenses.length === 0}
            >
              <Download className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-10">
                <ArrowUpDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {sortOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={sortBy === option}
                    onCheckedChange={() => handleSorting(option)}
                  >
                    <span>{option}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-10">
                <SlidersHorizontal className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) =>
                      onToggleCategory?.(category, checked)
                    }
                  >
                    <span className="capitalize">{category}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Input
          type="text"
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0">Month:</span>
          <Input
            type="month"
            value={selectedMonth === "all" ? "" : selectedMonth}
            onChange={(e) => onSelectedMonth(e.target.value || "all")}
            className="w-45"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectedMonth("all")}
          >
            All
          </Button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-4 text-center text-muted-foreground">
            No expenses added yet.
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {sortedExpenses.map((expenseItem) => (
            <Expense
              key={expenseItem.id}
              expense={expenseItem}
              onDeleteExpense={handleDeleteExpense}
              onSaveExpense={handleEditExpense}
              categories={categories}
            />
          ))}
        </div>
      )}
    </div>
  );
}
