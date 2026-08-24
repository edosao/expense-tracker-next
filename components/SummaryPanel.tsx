import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Expense } from "@/types/expense";
import { BarChart3, Utensils, Car, Receipt, Clapperboard } from "lucide-react";
import { getTotalByCategory } from "@/utils/expense";
import BudgetDialog from "./BudgetDialog";
import ExpenseChart from "./ExpenseChart";

const categoryIcons: Record<string, React.ReactNode> = {
  food: <Utensils className="h-4 w-4" />,
  transport: <Car className="h-4 w-4" />,
  bills: <Receipt className="h-4 w-4" />,
  entertainment: <Clapperboard className="h-4 w-4" />,
};

type SummaryPanelProps = {
  summaryExpenses: Expense[];
  categories: string[];
  selectedMonth: string;
  chartData: { category: string; amount: number }[];
};

export default function SummaryPanel({
  summaryExpenses,
  categories,
  selectedMonth,
  chartData,
}: SummaryPanelProps) {
  const currentMonth =
    selectedMonth === "all"
      ? new Date().toISOString().slice(0, 7)
      : selectedMonth;

  const [showBudgetDialog, setShowBudgetDialog] = useState(false);

  const [allMonthBudgets, setAllMonthBudgets] = useState<
    Record<string, Record<string, number> | null>
  >({});

  useEffect(() => {
    const stored = localStorage.getItem("monthlyBudgets");
    if (stored) setAllMonthBudgets(JSON.parse(stored));
  }, []);

  const budgets = allMonthBudgets[currentMonth] ?? null;

  const handleSaveBudget = (
    month: string,
    category: string,
    amount: number,
  ) => {
    const updated = {
      ...allMonthBudgets,
      [month]: {
        ...(allMonthBudgets[month] ?? {}),
        [category]: amount,
      },
    };
    setAllMonthBudgets(updated);
    localStorage.setItem("monthlyBudgets", JSON.stringify(updated));
  };

  const allCategoryTotals = categories.reduce(
    (acc, category) => {
      acc[category] = getTotalByCategory(summaryExpenses, category);
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      <Card className="p-6 border border-gray-300">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Summary</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground ">
              {selectedMonth !== "all" ? currentMonth : "All Time"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBudgetDialog(true)}
            >
              Set Budget
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Category list */}
          <div className="flex-1 space-y-2">
            {Object.entries(allCategoryTotals).map(([category, amount]) => {
              const categoryBudget = budgets?.[category] ?? null;
              const isOverBudget =
                selectedMonth !== "all" &&
                categoryBudget !== null &&
                amount > categoryBudget;

              return (
                <div key={category} className="px-3 py-2 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {categoryIcons[category] ?? (
                        <BarChart3 className="h-4 w-4" />
                      )}
                      <span className="capitalize">{category}</span>
                      {isOverBudget && (
                        <span className="text-xs text-destructive">over</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-medium ${amount === 0 ? "text-muted-foreground" : isOverBudget ? "text-destructive" : ""}`}
                      >
                        ${amount.toFixed(2)}
                      </span>
                      {categoryBudget !== null && selectedMonth !== "all" && (
                        <p className="text-xs text-muted-foreground">
                          / ${categoryBudget.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {categoryBudget !== null && selectedMonth !== "all" && (
                    <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isOverBudget ? "bg-destructive" : "bg-primary"}`}
                        style={{
                          width: `${Math.min((amount / (categoryBudget || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="flex-1 min-w-0">
            <ExpenseChart chartData={chartData} selectedMonth={selectedMonth} />
          </div>
        </div>
      </Card>

      <BudgetDialog
        categories={categories}
        open={showBudgetDialog}
        onClose={() => setShowBudgetDialog(false)}
        onSaveBudget={handleSaveBudget}
      />
    </>
  );
}
