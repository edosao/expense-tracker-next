type TabsProps = {
  activeTab: "expenses" | "categories";
  setActiveTab: (tab: "expenses" | "categories") => void;
};

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex gap-4 px-6 border-b border-gray-400">
      <button
        onClick={() => setActiveTab("expenses")}
        className={`px-4 py-2 text-sm font-medium transition ${
          activeTab === "expenses"
            ? "border-b-2 border-primary"
            : "text-muted-foreground"
        }`}
      >
        Expenses
      </button>

      <button
        onClick={() => setActiveTab("categories")}
        className={`px-4 py-2 text-sm font-medium transition ${
          activeTab === "categories"
            ? "border-b-2 border-primary"
            : "text-muted-foreground"
        }`}
      >
        Categories
      </button>
    </div>
  );
}
