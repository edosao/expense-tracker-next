import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, X, Check } from "lucide-react";
import type { INote } from "@/types/expense";
import ConfirmDialog from "./ConfirmDialog";

type NoteProps = {
  note: INote;
  onEditNote: (noteId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
};

export default function Note({ note, onEditNote, onDeleteNote }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    onEditNote(note.id, content.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1">
      {isEditing ? (
        <>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-7 text-sm"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={handleSave}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={handleCancel}
          >
            <X className="h-3 w-3" />
          </Button>
        </>
      ) : (
        <>
          <p className="flex-1 text-sm text-muted-foreground">{note.content}</p>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={() => setShowConfirm(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </>
      )}

      <ConfirmDialog
        open={showConfirm}
        title="Delete Note"
        description={`Are you sure you want to delete this note? This action cannot be undone.`}
        onConfirm={() => {
          onDeleteNote(note.id);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
