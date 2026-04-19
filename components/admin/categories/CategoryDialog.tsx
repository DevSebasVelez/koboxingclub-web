"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import type { CategoryInput } from "@/lib/validations/category";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategoryDialogProps {
  category?: Category;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function CategoryDialog({
  category,
  trigger,
  onSuccess,
}: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? "",
        description: category?.description ?? "",
      });
    }
  }, [open, category, reset]);

  async function onSubmit(data: CategoryInput) {
    setLoading(true);
    try {
      if (category) {
        await updateCategory(category.id, data);
        toast.success("Categoría actualizada");
      } else {
        await createCategory(data);
        toast.success("Categoría creada");
      }
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent">
            {category ? "Editar" : "Nueva Categoría"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-neutral-300" htmlFor="name">
              Nombre <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", { required: "El nombre es requerido" })}
              placeholder="ej. Peso Pluma"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-neutral-300" htmlFor="description">
              Descripción
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descripción opcional..."
              rows={3}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737] resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {category ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
