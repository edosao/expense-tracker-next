import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import CategoryList from "./CategoryList";

type CategoryManagerProps = {
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onEditCategory: (oldCategory: string, newCategory: string) => void;
};

export default function CategoryManager({
  categories,
  onAddCategory,
  onDeleteCategory,
  onEditCategory,
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const trimmed = newCategory.trim().toLowerCase();
    if (!trimmed) return;

    if (categories.includes(trimmed)) {
      setError("Category already exists");
      return;
    }

    onAddCategory(trimmed);
    setError("");
    setNewCategory("");
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-md p-6 space-y-5">
        <h2 className="text-lg font-semibold">Manage Categories</h2>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="space-y-2">
          <CategoryList
            categories={categories}
            onDeleteCategory={onDeleteCategory}
            onEditCategory={onEditCategory}
          />
        </div>
      </Card>
    </div>
  );
}
