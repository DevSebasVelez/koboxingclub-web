"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Users, ToggleLeft, ToggleRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "../shared/StatusBadge";
import FighterDialog from "./FighterDialog";
import DeleteDialog from "../shared/DeleteDialog";
import { deleteFighter, toggleFighterStatus } from "@/lib/actions/fighters";

interface Category {
  id: string;
  name: string;
}

interface Fighter {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  photoUrl: string | null;
  photoKey: string | null;
  wins: number;
  losses: number;
  draws: number;
  winsKo: number;
  lossesKo: number;
  rounds: number;
  debut: Date | null;
  birthDate: Date | null;
  cedula: string | null;
  nationality: string | null;
  residence: string | null;
  club: string | null;
  categoryId: string | null;
  status: "DRAFT" | "PUBLISHED";
  category: Category | null;
  _count: { events: number };
}

interface FightersClientProps {
  initialFighters: Fighter[];
  categories: Category[];
}

export default function FightersClient({
  initialFighters,
  categories,
}: FightersClientProps) {
  const [fighters, setFighters] = useState(initialFighters);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return fighters;
    const q = search.toLowerCase();
    return fighters.filter(
      (f) =>
        f.firstName.toLowerCase().includes(q) ||
        f.lastName.toLowerCase().includes(q),
    );
  }, [fighters, search]);

  async function handleDelete(id: string) {
    try {
      await deleteFighter(id);
      setFighters((prev) => prev.filter((f) => f.id !== id));
      toast.success("Peleador eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
      throw err;
    }
  }

  async function handleToggleStatus(id: string) {
    try {
      const updated = await toggleFighterStatus(id);
      setFighters((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: updated.status } : f)),
      );
      toast.success(
        updated.status === "PUBLISHED" ? "Publicado" : "Cambiado a borrador",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  function handleSuccess() {
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="size-6" />
            Peleadores
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            {fighters.length} peleador{fighters.length !== 1 ? "es" : ""}
          </p>
        </div>
        <FighterDialog
          categories={categories}
          onSuccess={handleSuccess}
          trigger={
            <Button className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent">
              Nuevo Peleador
            </Button>
          }
        />
      </div>

      <Input
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
      />

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-400 font-medium">
                Peleador
              </TableHead>
              <TableHead className="text-neutral-400 font-medium">
                Categoría
              </TableHead>
              <TableHead className="text-neutral-400 font-medium text-center">
                Récord
              </TableHead>
              <TableHead className="text-neutral-400 font-medium text-center">
                Estado
              </TableHead>
              <TableHead className="text-neutral-400 font-medium text-center">
                Eventos
              </TableHead>
              <TableHead className="text-neutral-400 font-medium text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-neutral-500 py-12"
                >
                  {search
                    ? "Sin resultados para esa búsqueda."
                    : "No hay peleadores. Crea el primero."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((fighter) => (
                <TableRow
                  key={fighter.id}
                  className="border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="default">
                        <AvatarImage
                          src={fighter.photoUrl ?? undefined}
                          alt={`${fighter.firstName} ${fighter.lastName}`}
                        />
                        <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
                          {fighter.firstName[0]}
                          {fighter.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">
                          {fighter.firstName} {fighter.lastName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {fighter.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-400">
                    {fighter.category?.name ?? (
                      <span className="text-neutral-600 italic">
                        Sin categoría
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-mono text-white">
                      {fighter.wins}V-{fighter.losses}D-{fighter.draws}E
                    </span>
                    {fighter.winsKo > 0 && (
                      <span className="ml-1 text-xs text-[#c11737]">
                        ({fighter.winsKo} KO)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={fighter.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                      {fighter._count.events}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleToggleStatus(fighter.id)}
                        className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                        title={
                          fighter.status === "PUBLISHED"
                            ? "Despublicar"
                            : "Publicar"
                        }
                      >
                        {fighter.status === "PUBLISHED" ? (
                          <ToggleRight className="size-4 text-green-400" />
                        ) : (
                          <ToggleLeft className="size-4" />
                        )}
                      </Button>
                      <FighterDialog
                        fighter={fighter}
                        categories={categories}
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
                        title="¿Eliminar peleador?"
                        description={`Se eliminará a "${fighter.firstName} ${fighter.lastName}" permanentemente.`}
                        onConfirm={() => handleDelete(fighter.id)}
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
