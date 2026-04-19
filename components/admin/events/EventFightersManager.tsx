"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import {
  addFighterToEvent,
  removeFighterFromEvent,
} from "@/lib/actions/events";

interface Category {
  id: string;
  name: string;
}

interface Fighter {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  category: Category | null;
}

interface EventFighterEntry {
  fighterId: string;
  fighter: Fighter;
}

interface EventFightersManagerProps {
  eventId: string;
  eventFighters: EventFighterEntry[];
  allFighters: Fighter[];
  onUpdate?: () => void;
}

export default function EventFightersManager({
  eventId,
  eventFighters,
  allFighters,
  onUpdate,
}: EventFightersManagerProps) {
  const [fighters, setFighters] = useState(eventFighters);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedFighterId, setSelectedFighterId] = useState<string>("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const existingIds = new Set(fighters.map((f) => f.fighterId));
  const availableFighters = allFighters.filter((f) => !existingIds.has(f.id));

  async function handleAdd() {
    if (!selectedFighterId) return;
    const fighterId = selectedFighterId;
    setLoadingAdd(true);
    try {
      await addFighterToEvent(eventId, fighterId);
      const added = allFighters.find((f) => f.id === fighterId);
      if (added) {
        setFighters((prev) => [
          ...prev,
          { fighterId: added.id, fighter: added },
        ]);
      }
      toast.success("Peleador agregado al evento");
      setSelectedFighterId("");
      setAddOpen(false);
      onUpdate?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al agregar");
    } finally {
      setLoadingAdd(false);
    }
  }

  async function handleRemove(fighterId: string) {
    setRemovingId(fighterId);
    try {
      await removeFighterFromEvent(eventId, fighterId);
      setFighters((prev) => prev.filter((f) => f.fighterId !== fighterId));
      toast.success("Peleador removido del evento");
      onUpdate?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al remover");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-300">
          Peleadores en este evento ({fighters.length})
        </h3>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white gap-1"
            >
              <UserPlus className="size-3.5" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-900 border-neutral-800 sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-white">
                Agregar peleador al evento
              </DialogTitle>
            </DialogHeader>
            <div className="py-2">
              {availableFighters.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  Todos los peleadores ya están en este evento.
                </p>
              ) : (
                <Select
                  value={selectedFighterId}
                  onValueChange={setSelectedFighterId}
                >
                  <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                    <SelectValue placeholder="Seleccionar peleador..." />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700 max-h-60">
                    {availableFighters.map((f) => (
                      <SelectItem
                        key={f.id}
                        value={f.id}
                        className="text-white focus:bg-neutral-700"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {f.firstName} {f.lastName}
                          </span>
                          {f.category && (
                            <span className="text-xs text-neutral-400">
                              · {f.category.name}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddOpen(false)}
                className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!selectedFighterId || loadingAdd}
                className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent"
              >
                {loadingAdd && <Loader2 className="size-4 animate-spin" />}
                <Plus className="size-4" />
                Agregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {fighters.length === 0 ? (
        <p className="text-sm text-neutral-500 italic py-2">
          No hay peleadores en este evento.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {fighters.map(({ fighterId, fighter }) => (
            <div
              key={fighterId}
              className="flex items-center justify-between rounded-lg bg-neutral-800/60 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarImage src={fighter.photoUrl ?? undefined} />
                  <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
                    {fighter.firstName[0]}
                    {fighter.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">
                    {fighter.firstName} {fighter.lastName}
                  </p>
                  {fighter.category && (
                    <p className="text-xs text-neutral-400">
                      {fighter.category.name}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={removingId === fighterId}
                onClick={() => handleRemove(fighterId)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                {removingId === fighterId ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
