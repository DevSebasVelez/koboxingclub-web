"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Tag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CategoryDialog from "./CategoryDialog";
import DeleteDialog from "../shared/DeleteDialog";
import { deleteCategory } from "@/lib/actions/categories";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { fighters: number };
}

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({
  initialCategories,
}: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories);

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoría eliminada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
      throw err;
    }
  }

  function handleSuccess() {
    // Trigger page refresh to get updated data
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="size-6" />
            Categorías
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            {categories.length} categoría{categories.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CategoryDialog
          onSuccess={handleSuccess}
          trigger={
            <Button className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent">
              Nueva Categoría
            </Button>
          }
        />
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-400 font-medium">
                Nombre
              </TableHead>
              <TableHead className="text-neutral-400 font-medium">
                Descripción
              </TableHead>
              <TableHead className="text-neutral-400 font-medium text-center">
                Peleadores
              </TableHead>
              <TableHead className="text-neutral-400 font-medium text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-neutral-500 py-12"
                >
                  No hay categorías. Crea la primera.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                >
                  <TableCell className="font-medium text-white">
                    {category.name}
                    <span className="ml-2 text-xs text-neutral-500">
                      {category.slug}
                    </span>
                  </TableCell>
                  <TableCell className="text-neutral-400 max-w-xs truncate">
                    {category.description || (
                      <span className="text-neutral-600 italic">
                        Sin descripción
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                      {category._count.fighters}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <CategoryDialog
                        category={category}
                        onSuccess={handleSuccess}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                          >
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <DeleteDialog
                        title="¿Eliminar categoría?"
                        description={`Se eliminará "${category.name}". Los peleadores asignados no serán eliminados.`}
                        onConfirm={() => handleDelete(category.id)}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
