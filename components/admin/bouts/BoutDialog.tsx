"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Swords } from "lucide-react";
import { createBout, updateBout } from "@/lib/actions/bouts";
import type { BoutInput } from "@/lib/validations/bout";

interface Fighter {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  category: { id: string; name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

interface Bout {
  id: string;
  fighter1Id: string;
  fighter2Id: string;
  categoryId: string | null;
  isMainEvent: boolean;
  scheduledRounds: number;
  description: string | null;
}

interface BoutDialogProps {
  eventId: string;
  eventFighters: Fighter[];
  categories: Category[];
  bout?: Bout;
  trigger?: React.ReactNode;
  onSuccess?: (bout: unknown) => void;
}

const ROUND_OPTIONS = [3, 4, 6, 8, 10, 12];

export default function BoutDialog({
  eventId,
  eventFighters,
  categories,
  bout,
  trigger,
  onSuccess,
}: BoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedF1, setSelectedF1] = useState(bout?.fighter1Id ?? "");
  const [selectedF2, setSelectedF2] = useState(bout?.fighter2Id ?? "");

  const defaultValues: BoutInput = {
    eventId,
    fighter1Id: bout?.fighter1Id ?? "",
    fighter2Id: bout?.fighter2Id ?? "",
    categoryId: bout?.categoryId ?? "",
    isMainEvent: bout?.isMainEvent ?? false,
    scheduledRounds: bout?.scheduledRounds ?? 3,
    description: bout?.description ?? "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BoutInput>({ defaultValues });

  function handleOpenChange(next: boolean) {
    if (next) {
      reset(defaultValues);
      setSelectedF1(bout?.fighter1Id ?? "");
      setSelectedF2(bout?.fighter2Id ?? "");
    }
    setOpen(next);
  }

  async function onSubmit(data: BoutInput) {
    if (data.fighter1Id === data.fighter2Id) {
      toast.error("Los peleadores deben ser diferentes");
      return;
    }
    setLoading(true);
    try {
      let result;
      if (bout) {
        result = await updateBout(bout.id, data);
        toast.success("Pelea actualizada");
      } else {
        result = await createBout(data);
        toast.success("Pelea agregada a la cartelera");
      }
      setOpen(false);
      onSuccess?.(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  const availableFighter2 = eventFighters.filter((f) => f.id !== selectedF1);
  const availableFighter1 = eventFighters.filter((f) => f.id !== selectedF2);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent">
            <Swords className="size-4" />
            Nueva Pelea
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            {bout ? "Editar Pelea" : "Nueva Pelea"}
          </DialogTitle>
        </DialogHeader>

        {eventFighters.length < 2 ? (
          <div className="py-6 text-center">
            <Swords className="size-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">
              Necesitas al menos 2 peleadores en el evento para crear una pelea.
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Agrega peleadores en la pestaña &quot;Peleadores&quot; primero.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300">
                  Peleador 1 <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="fighter1Id"
                  control={control}
                  rules={{ required: "Requerido" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedF1(val);
                      }}
                    >
                      <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700 max-h-52">
                        {availableFighter1.map((f) => (
                          <SelectItem
                            key={f.id}
                            value={f.id}
                            className="text-white focus:bg-neutral-700"
                          >
                            {f.firstName} {f.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.fighter1Id && (
                  <p className="text-xs text-red-400">
                    {errors.fighter1Id.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center pb-1">
                <span className="text-neutral-500 font-bold text-sm">VS</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300">
                  Peleador 2 <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="fighter2Id"
                  control={control}
                  rules={{ required: "Requerido" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedF2(val);
                      }}
                    >
                      <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700 max-h-52">
                        {availableFighter2.map((f) => (
                          <SelectItem
                            key={f.id}
                            value={f.id}
                            className="text-white focus:bg-neutral-700"
                          >
                            {f.firstName} {f.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.fighter2Id && (
                  <p className="text-xs text-red-400">
                    {errors.fighter2Id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300">Categoría / Peso</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) =>
                        field.onChange(val === "_none" ? "" : val)
                      }
                    >
                      <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                        <SelectValue placeholder="Sin categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem
                          value="_none"
                          className="text-neutral-400 focus:bg-neutral-700"
                        >
                          Sin categoría
                        </SelectItem>
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id}
                            className="text-white focus:bg-neutral-700"
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300" htmlFor="scheduledRounds">
                  Rounds programados
                </Label>
                <Controller
                  name="scheduledRounds"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        {ROUND_OPTIONS.map((r) => (
                          <SelectItem
                            key={r}
                            value={String(r)}
                            className="text-white focus:bg-neutral-700"
                          >
                            {r} rounds
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-800/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Pelea Estelar</p>
                <p className="text-xs text-neutral-400">
                  Marcar como la pelea principal del evento
                </p>
              </div>
              <Controller
                name="isMainEvent"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#c11737]"
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-300" htmlFor="description">
                Descripción / Subtítulo
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Ej: Final del Torneo Nacional, Combate Amateur..."
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737] min-h-16 resize-none"
              />
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
                {bout ? "Actualizar" : "Agregar pelea"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
