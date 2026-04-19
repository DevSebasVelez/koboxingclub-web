"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteDialogProps {
  title?: string;
  description?: string;
  onConfirm: () => Promise<void>;
  trigger?: React.ReactNode;
}

export default function DeleteDialog({
  title = "¿Eliminar elemento?",
  description = "Esta acción no se puede deshacer.",
  onConfirm,
  trigger,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-neutral-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white border-transparent"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
