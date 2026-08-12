import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Tag, Plus } from "lucide-react";
import type { Expense, INote } from "@/types/expense";
import { useState } from "react";
import Note from "./Note";
import ConfirmDialog from "./ConfirmDialog";
import toast from "react-hot-toast";

type ExpenseProps = {
  expense: Expense;
  categories: string[];
  onDeleteExpense: (id: string) => void;
  onSaveExpense: (expense: Expense) => void;
};

export default function Expense({
  expense,
  onDeleteExpense,
  onSaveExpense,
  categories,
}: ExpenseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Expense>(expense);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (!draft.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!draft.category) {
      toast.error("Category is required");
      return;
    }
    if (!draft.amount || draft.amount <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    onSaveExpense(draft);
    setIsEditing(false);
    toast.success("Expense updated!");
  };

  const handleCancel = () => {
    setDraft(expense);
    setNewNoteContent("");
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: INote = {
      id: crypto.randomUUID(),
      content: newNoteContent.trim(),
      expense_id: expense.id,
    };

    setDraft({ ...draft, notes: [...draft.notes, newNote] });
    setNewNoteContent("");
  };

  const handleEditNote = (noteId: string, content: string) => {
    setDraft({
      ...draft,
      notes: draft.notes.map((n) => (n.id === noteId ? { ...n, content } : n)),
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setDraft({ ...draft, notes: draft.notes.filter((n) => n.id !== noteId) });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.25 }}
      >
        <Card
          className={`p-4 ${isEditing ? "ring-2 ring-primary bg-muted" : ""}`}
        >
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <Input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />

              <Input
                type="number"
                value={draft.amount || ""}
                onChange={(e) =>
                  setDraft({ ...draft, amount: Number(e.target.value) })
                }
              />

              <Select
                value={draft.category}
                onValueChange={(value) => {
                  if (value) setDraft({ ...draft, category: value });
                }}
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

              <div className="space-y-2">
                <p className="text-sm font-medium">Notes</p>

                {draft.notes.map((note) => (
                  <Note
                    key={note.id}
                    note={note}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                  />
                ))}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a note..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                    className="h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={handleAddNote}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button size="sm" onClick={handleSave} className="w-full">
                    Save
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {expense.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {expense.category} •{" "}
                  {new Date(expense.createdAt).toLocaleDateString()}
                </p>

                {expense.notes.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {expense.notes.map((note) => (
                      <span
                        key={note.id}
                        className="items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {note.content}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  ${expense.amount.toFixed(2)}
                </span>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDraft(expense);
                      setIsEditing(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setShowConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete Expense"
        description={`Are you sure you want to delete "${expense.title}"? This action cannot be undone.`}
        onConfirm={() => {
          onDeleteExpense(expense.id);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
