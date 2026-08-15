import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useCategories(
  updateExpenseCategory: (oldCategory: string, newCategory: string) => void,
  reassignExpensesToOther: (category: string) => void,
) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const names = data.map((c: { name: string }) => c.name);
        if (!names.includes("other")) {
          await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "other" }),
          });
          names.push("other");
        }
        setCategories(names);
      } catch {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async (category: string) => {
    if (categories.includes(category.toLowerCase())) return false;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: category.toLowerCase() }),
      });
      if (!res.ok) throw new Error();
      setCategories((prev) => [...prev, category.toLowerCase()]);
      toast.success("Category added");
      return true;
    } catch {
      toast.error("Failed to add category");
      return false;
    }
  };

  const editCategory = async (oldCategory: string, newCategory: string) => {
    if (oldCategory === "other") return;
    const formattedCategory = newCategory.trim().toLowerCase();
    if (!formattedCategory || formattedCategory === "other") return;
    if (categories.includes(formattedCategory)) {
      toast.error("Category already exists");
      return;
    }
    try {
      const res = await fetch(`/api/categories?name=${oldCategory}`);
      if (!res.ok) {
        toast.error("Failed to find category");
        return;
      }
      const data = await res.json();
      const updateRes = await fetch(`/api/categories/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formattedCategory }),
      });
      if (!updateRes.ok) {
        toast.error("Failed to update category");
        return;
      }
      setCategories((prev) =>
        prev.map((c) => (c === oldCategory ? formattedCategory : c)),
      );
      toast.success("Category updated");

      updateExpenseCategory(oldCategory, formattedCategory);
    } catch {
      toast.error("Network error — please check your connection");
    }
  };

  const deleteCategory = async (category: string) => {
    if (category === "other") return;
    try {
      const res = await fetch(`/api/categories?name=${category}`);
      if (!res.ok) {
        toast.error("Failed to find category");
        return;
      }

      const data = await res.json();
      const deleteRes = await fetch(`/api/categories/${data.id}`, {
        method: "DELETE",
      });

      if (!deleteRes.ok) throw new Error();
      setCategories((prev) => prev.filter((c) => c !== category));
      reassignExpensesToOther(category);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return { categories, addCategory, editCategory, deleteCategory };
}
