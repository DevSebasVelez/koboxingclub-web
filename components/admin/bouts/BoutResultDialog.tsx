"use client";

import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { updateBoutResult } from "@/lib/actions/bouts";
import type { BoutResultInput } from "@/lib/validations/bout-result";

interface BoutFighter {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
}

interface BoutResultDialogProps {
  boutId: string;
  eventId: string;
  fighter1: BoutFighter;
  fighter2: BoutFighter;
  scheduledRounds: number;
  currentResult: {
    resultStatus: string;
    winnerFighterId: string | null;
    endMethod: string | null;
    endRound: number | null;
    notes: string | null;
  };
  trigger?: React.ReactNode;
  onSuccess?: (bout: unknown) => void;
}

const RESULT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  NO_CONTEST: "Sin Contestar",
  CANCELLED: "Cancelada",
};

const END_METHOD_LABELS: Record<string, string> = {
  KO: "KO (Nocaut)",
  TKO: "TKO (Nocaut Técnico)",
  DECISION: "Decisión Unánime",
  SPLIT_DECISION: "Decisión Dividida",
  DRAW: "Empate",
  DQ: "Descalificación",
  NO_CONTEST: "Sin Contestar",
};

export default function BoutResultDialog({
  boutId,
  eventId,
  fighter1,
  fighter2,
  scheduledRounds,
  currentResult,
  trigger,
  onSuccess,
}: BoutResultDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues: BoutResultInput = {
    resultStatus:
      (currentResult.resultStatus as BoutResultInput["resultStatus"]) ??
      "PENDING",
    winnerFighterId: currentResult.winnerFighterId ?? "",
    endMethod:
      (currentResult.endMethod as BoutResultInput["endMethod"]) ?? null,
    endRound: currentResult.endRound ?? null,
    notes: currentResult.notes ?? "",
  };

  const [currentStatus, setCurrentStatus] = useState<
    BoutResultInput["resultStatus"]
  >(defaultValues.resultStatus);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BoutResultInput>({ defaultValues });

  const watchedStatus = useWatch({ control, name: "resultStatus" });
  const isCompleted = (watchedStatus ?? currentStatus) === "COMPLETED";

  function handleOpenChange(next: boolean) {
    if (next) {
      reset(defaultValues);
      setCurrentStatus(defaultValues.resultStatus);
    }
    setOpen(next);
  }

  async function onSubmit(data: BoutResultInput) {
    setLoading(true);
    try {
      const result = await updateBoutResult(boutId, eventId, data);
      toast.success("Resultado registrado");
      setOpen(false);
      onSuccess?.(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-neutral-400 hover:text-white hover:bg-neutral-700"
          >
            <ClipboardCheck className="size-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            Resultado de la pelea
          </DialogTitle>
        </DialogHeader>

        {/* Fighter matchup preview */}
        <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800/40 px-4 py-3">
          <div className="flex flex-1 items-center gap-2 justify-end min-w-0">
            <p className="text-sm font-semibold text-white truncate text-right">
              {fighter1.firstName} {fighter1.lastName}
            </p>
            <Avatar size="sm">
              <AvatarImage src={fighter1.photoUrl ?? undefined} />
              <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
                {fighter1.firstName[0]}
                {fighter1.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <span className="text-xs font-bold text-neutral-500">VS</span>
            <span className="text-xs text-neutral-600">{scheduledRounds}R</span>
          </div>
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <Avatar size="sm">
              <AvatarImage src={fighter2.photoUrl ?? undefined} />
              <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
                {fighter2.firstName[0]}
                {fighter2.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-semibold text-white truncate">
              {fighter2.firstName} {fighter2.lastName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Result status */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-neutral-300">
              Estado del resultado <span className="text-red-400">*</span>
            </Label>
            <Controller
              name="resultStatus"
              control={control}
              rules={{ required: "Requerido" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    {Object.entries(RESULT_STATUS_LABELS).map(
                      ([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-white focus:bg-neutral-700"
                        >
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.resultStatus && (
              <p className="text-xs text-red-400">
                {errors.resultStatus.message}
              </p>
            )}
          </div>

          {/* Fields visible only when COMPLETED */}
          {isCompleted && (
            <>
              {/* Winner */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300">Ganador</Label>
                <Controller
                  name="winnerFighterId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) =>
                        field.onChange(val === "_draw" ? "" : val)
                      }
                    >
                      <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                        <SelectValue placeholder="Seleccionar ganador..." />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem
                          value={fighter1.id}
                          className="text-white focus:bg-neutral-700"
                        >
                          {fighter1.firstName} {fighter1.lastName}
                        </SelectItem>
                        <SelectItem
                          value={fighter2.id}
                          className="text-white focus:bg-neutral-700"
                        >
                          {fighter2.firstName} {fighter2.lastName}
                        </SelectItem>
                        <SelectItem
                          value="_draw"
                          className="text-neutral-400 focus:bg-neutral-700"
                        >
                          Empate
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* End method */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300">
                  Método de finalización
                </Label>
                <Controller
                  name="endMethod"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) =>
                        field.onChange(
                          val === "_none"
                            ? null
                            : (val as BoutResultInput["endMethod"]),
                        )
                      }
                    >
                      <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                        <SelectValue placeholder="Seleccionar método..." />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem
                          value="_none"
                          className="text-neutral-400 focus:bg-neutral-700"
                        >
                          Sin especificar
                        </SelectItem>
                        {Object.entries(END_METHOD_LABELS).map(
                          ([value, label]) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="text-white focus:bg-neutral-700"
                            >
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* End round */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300" htmlFor="endRound">
                  Round en que finalizó{" "}
                  <span className="text-neutral-500 text-xs">(opcional)</span>
                </Label>
                <Input
                  id="endRound"
                  type="number"
                  min={1}
                  max={scheduledRounds}
                  placeholder={`1 – ${scheduledRounds}`}
                  {...register("endRound", {
                    setValueAs: (v) =>
                      v === "" || v === null || v === undefined
                        ? null
                        : Number(v),
                  })}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
                />
                {errors.endRound && (
                  <p className="text-xs text-red-400">
                    {errors.endRound.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Notes – always visible */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-neutral-300" htmlFor="notes">
              Notas <span className="text-neutral-500 text-xs">(opcional)</span>
            </Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Detalles adicionales sobre el resultado..."
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
              Guardar resultado
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
