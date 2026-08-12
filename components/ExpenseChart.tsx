import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CHART_COLORS = [
  "#f97316",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

const getChartColor = (index: number) =>
  CHART_COLORS[index % CHART_COLORS.length];

type ChartData = {
  category: string;
  amount: number;
};

type ExpenseChartProps = {
  chartData: ChartData[];
  selectedMonth: string;
};

export default function ExpenseChart({
  chartData,
  selectedMonth,
}: ExpenseChartProps) {
  if (selectedMonth === "all") {
    return (
      <div className="h-55 flex items-center justify-center rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">
          Select a month to see the chart
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
      >
        <XAxis
          dataKey="category"
          tick={{ fontSize: 10 }}
          tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1, 3)}
        />
        <YAxis
          tick={{ fontSize: 10 }}
          tickFormatter={(val) => `$${val}`}
          width={50}
        />
        <Tooltip
          labelFormatter={(label) => {
            const str = String(label);
            return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
          }}
        />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={entry.category} fill={getChartColor(index)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
