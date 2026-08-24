import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BudgetDialogProps = {
  categories: string[];
  open: boolean;
  onClose: () => void;
  onSaveBudget: (month: string, category: string, amount: number) => void;
};

export default function BudgetDialog({
  categories,
  open,
  onClose,
  onSaveBudget,
}: BudgetDialogProps) {
  const [budgetEntry, setBudgetEntry] = useState<{
    month: string;
    category: string | null;
    amount: number;
  }>({
    month: "",
    category: null,
    amount: 0,
  });

  const isComplete =
    budgetEntry.month !== "" &&
    budgetEntry.category !== null &&
    budgetEntry.amount > 0;

  const handleSave = () => {
    if (!isComplete) return;
    onSaveBudget(budgetEntry.month, budgetEntry.category!, budgetEntry.amount);
    setBudgetEntry({ month: "", category: null, amount: 0 });
    onClose();
  };

  const handleClose = () => {
    setBudgetEntry({ month: "", category: null, amount: 0 });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Set Budget Limit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Month</label>
            <Input
              type="month"
              value={budgetEntry.month}
              onChange={(e) =>
                setBudgetEntry((prev) => ({ ...prev, month: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Category</label>
            <Select
              value={budgetEntry.category ?? ""}
              onValueChange={(value) =>
                setBudgetEntry((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="capitalize">{cat}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Budget Amount
            </label>
            <Input
              type="number"
              min="0"
              placeholder="0.00"
              value={budgetEntry.amount || ""}
              onChange={(e) =>
                setBudgetEntry((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={!isComplete} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
