import type { Expense } from "@/types/expense";
import { getTotalByCategory, getTotalExpenses } from "@/utils/expense";
import { TrendingUp, Wallet, Tag } from "lucide-react";

type StatsStripProps = {
  summaryExpenses?: Expense[];
  categories: string[];
  selectedMonth: string;
};

export default function StatsStrip({
  summaryExpenses = [],
  categories,
  selectedMonth,
}: StatsStripProps) {
  const total = getTotalExpenses(summaryExpenses);

  const topCategory = categories.reduce(
    (top, cat) => {
      const amount = getTotalByCategory(summaryExpenses, cat);
      return amount > top.amount ? { name: cat, amount } : top;
    },
    { name: "-", amount: 0 },
  );

  const label = selectedMonth === "all" ? "All Time" : selectedMonth;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 flex items-center gap-4 rounded-lg border border-gray-400 bg-card text-card-foreground shadow-sm">
        <div className="rounded-full bg-primary/10 p-2">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="text-xl font-bold">${total.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>

      <div className="p-4 flex items-center gap-4 rounded-lg border border-gray-400 bg-card text-card-foreground shadow-sm">
        <div className="rounded-full bg-primary/10 p-2">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Transactions</p>
          <p className="text-xl font-bold">{summaryExpenses.length}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>

      <div className="p-4 flex items-center gap-4 rounded-lg border border-gray-400 bg-card text-card-foreground shadow-sm">
        <div className="rounded-full bg-primary/10 p-2">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Top Category</p>
          <p className="text-xl font-bold capitalize">
            {topCategory.amount > 0 ? topCategory.name : "-"}
          </p>
          <p className="text-xs text-muted-foreground">
            {topCategory.amount > 0
              ? `$${topCategory.amount.toFixed(2)}`
              : "No data"}
          </p>
        </div>
      </div>
    </div>
  );
}
