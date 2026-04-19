"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import ImageUpload from "../shared/ImageUpload";
import { DateTimePicker } from "../shared/DateTimePicker";
import { createEvent, updateEvent } from "@/lib/actions/events";
import type { EventInput } from "@/lib/validations/event";

interface Event {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  venue: string | null;
  city: string | null;
  country: string | null;
  posterUrl: string | null;
  posterKey: string | null;
  status: "DRAFT" | "PUBLISHED";
}

interface EventDialogProps {
  event?: Event;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

function toDatetimeLocal(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventDialog({
  event,
  trigger,
  onSuccess,
}: EventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues: EventInput = {
    name: event?.name ?? "",
    description: event?.description ?? "",
    date: toDatetimeLocal(event?.date),
    venue: event?.venue ?? "",
    city: event?.city ?? "",
    country: event?.country ?? "Colombia",
    posterUrl: event?.posterUrl ?? "",
    posterKey: event?.posterKey ?? "",
    status: event?.status ?? "DRAFT",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<EventInput>({ defaultValues });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(data: EventInput) {
    setLoading(true);
    try {
      if (event) {
        await updateEvent(event.id, data);
        toast.success("Evento actualizado");
      } else {
        await createEvent(data);
        toast.success("Evento creado");
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
            {event ? "Editar" : "Nuevo Evento"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {event ? "Editar Evento" : "Nuevo Evento"}
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
              placeholder="KO Night Vol. 1"
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
              placeholder="Descripción del evento..."
              rows={3}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737] resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-neutral-300">
              Fecha y hora <span className="text-red-400">*</span>
            </Label>
            <Controller
              name="date"
              control={control}
              rules={{ required: "La fecha es requerida" }}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Seleccionar fecha y hora"
                />
              )}
            />
            {errors.date && (
              <p className="text-xs text-red-400">{errors.date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-300" htmlFor="venue">
                Lugar / Venue
              </Label>
              <Input
                id="venue"
                {...register("venue")}
                placeholder="Coliseo El Campín"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-300" htmlFor="city">
                Ciudad
              </Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="Bogotá"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-300" htmlFor="country">
                País
              </Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="Colombia"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-neutral-300">Estado</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-[#c11737]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-700">
                      <SelectItem
                        value="DRAFT"
                        className="text-white focus:bg-neutral-700"
                      >
                        Borrador
                      </SelectItem>
                      <SelectItem
                        value="PUBLISHED"
                        className="text-white focus:bg-neutral-700"
                      >
                        Publicado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-neutral-300">Póster</Label>
            <ImageUpload
              currentUrl={event?.posterUrl ?? undefined}
              folder="events"
              onUpload={(key, url) => {
                setValue("posterKey", key);
                setValue("posterUrl", url);
              }}
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
              {event ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
