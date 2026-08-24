import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2Icon, Check, X } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

type CategoryListProps = {
  categories: string[];
  onDeleteCategory: (category: string) => void;
  onEditCategory: (oldCategory: string, newCategory: string) => void;
};

const CategoryList = ({
  categories,
  onDeleteCategory,
  onEditCategory,
}: CategoryListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setEditedValue(cat);
  };

  const handleSaveEdit = () => {
    if (!editedValue.trim() || !selectedCategory) return;
    onEditCategory(selectedCategory, editedValue.trim());
    setSelectedCategory(null);
    setEditedValue("");
  };

  const handleCancelEdit = () => {
    setSelectedCategory(null);
    setEditedValue("");
  };

  const handleDeleteClick = (cat: string) => {
    setCategoryToDelete(cat);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) onDeleteCategory(categoryToDelete);
    setCategoryToDelete(null);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
    setShowConfirm(false);
  };

  return (
    <div>
      {categories.map((cat) => (
        <div
          key={cat}
          className="flex justify-between items-center border rounded-md p-2 mb-2"
        >
          {selectedCategory === cat ? (
            <>
              <Input
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="max-w-37.5"
              />
              <div className="flex gap-2">
                <Button size="icon" variant="default" onClick={handleSaveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="capitalize">
                {cat === "other" ? "Other (default)" : cat}
              </span>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  disabled={cat === "other"}
                  onClick={() => handleSelectCategory(cat)}
                >
                  <Edit2Icon className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  disabled={cat === "other"}
                  onClick={() => handleDeleteClick(cat)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}

      <ConfirmDialog
        open={showConfirm}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete}"? All expenses in this category will be moved to "Other". This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default CategoryList;
