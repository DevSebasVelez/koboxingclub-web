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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ImageUpload from "../shared/ImageUpload";
import { DatePicker } from "../shared/DatePicker";
import { createFighter, updateFighter } from "@/lib/actions/fighters";
import type { FighterInput } from "@/lib/validations/fighter";

interface Category {
  id: string;
  name: string;
}

interface Fighter {
  id: string;
  firstName: string;
  lastName: string;
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
}

interface FighterDialogProps {
  fighter?: Fighter;
  categories: Category[];
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

function toDateString(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default function FighterDialog({
  fighter,
  categories,
  trigger,
  onSuccess,
}: FighterDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues: FighterInput = {
    firstName: fighter?.firstName ?? "",
    lastName: fighter?.lastName ?? "",
    photoUrl: fighter?.photoUrl ?? "",
    photoKey: fighter?.photoKey ?? "",
    wins: fighter?.wins ?? 0,
    losses: fighter?.losses ?? 0,
    draws: fighter?.draws ?? 0,
    winsKo: fighter?.winsKo ?? 0,
    lossesKo: fighter?.lossesKo ?? 0,
    rounds: fighter?.rounds ?? 0,
    debut: toDateString(fighter?.debut),
    birthDate: toDateString(fighter?.birthDate),
    cedula: fighter?.cedula ?? "",
    nationality: fighter?.nationality ?? "",
    residence: fighter?.residence ?? "",
    club: fighter?.club ?? "",
    categoryId: fighter?.categoryId ?? "",
    status: fighter?.status ?? "DRAFT",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FighterInput>({ defaultValues });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(data: FighterInput) {
    setLoading(true);
    try {
      if (fighter) {
        await updateFighter(fighter.id, data);
        toast.success("Peleador actualizado");
      } else {
        await createFighter(data);
        toast.success("Peleador creado");
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
            {fighter ? "Editar" : "Nuevo Peleador"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {fighter ? "Editar Peleador" : "Nuevo Peleador"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Tabs defaultValue="perfil">
            <TabsList className="bg-neutral-800 border-neutral-700">
              <TabsTrigger
                value="perfil"
                className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger
                value="record"
                className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700"
              >
                Récord
              </TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="firstName">
                    Nombre <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName", { required: "Requerido" })}
                    placeholder="Juan"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="lastName">
                    Apellido <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName", { required: "Requerido" })}
                    placeholder="Pérez"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300">Foto</Label>
                <ImageUpload
                  currentUrl={fighter?.photoUrl ?? undefined}
                  folder="fighters"
                  onUpload={(key, url) => {
                    setValue("photoKey", key);
                    setValue("photoUrl", url);
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300">
                    Fecha de nacimiento
                  </Label>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Seleccionar fecha"
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="cedula">
                    Cédula
                  </Label>
                  <Input
                    id="cedula"
                    {...register("cedula")}
                    placeholder="123456789"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="nationality">
                    Nacionalidad
                  </Label>
                  <Input
                    id="nationality"
                    {...register("nationality")}
                    placeholder="Colombiano"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="residence">
                    Residencia
                  </Label>
                  <Input
                    id="residence"
                    {...register("residence")}
                    placeholder="Bogotá, Colombia"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="club">
                    Club
                  </Label>
                  <Input
                    id="club"
                    {...register("club")}
                    placeholder="KO Boxing Club"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:border-[#c11737]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300">Categoría</Label>
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
            </TabsContent>

            <TabsContent value="record" className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="wins">
                    Victorias
                  </Label>
                  <Input
                    id="wins"
                    type="number"
                    min="0"
                    {...register("wins")}
                    className="bg-neutral-800 border-neutral-700 text-white focus-visible:border-[#c11737]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="losses">
                    Derrotas
                  </Label>
                  <Input
                    id="losses"
                    type="number"
                    min="0"
                    {...register("losses")}
                    className="bg-neutral-800 border-neutral-700 text-white focus-visible:border-[#c11737]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="draws">
                    Empates
                  </Label>
                  <Input
                    id="draws"
                    type="number"
                    min="0"
                    {...register("draws")}
                    className="bg-neutral-800 border-neutral-700 text-white focus-visible:border-[#c11737]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="winsKo">
                    Victorias KO
                  </Label>
                  <Input
                    id="winsKo"
                    type="number"
                    min="0"
                    {...register("winsKo")}
                    className="bg-neutral-800 border-neutral-700 text-white focus-visible:border-[#c11737]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="lossesKo">
                    Derrotas KO
                  </Label>
                  <Input
                    id="lossesKo"
                    type="number"
                    min="0"
                    {...register("lossesKo")}
                    className="bg-neutral-800 border-neutral-700 text-white focus-visible:border-[#c11737]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-neutral-300" htmlFor="rounds">
                    Rounds
                  </Label>
                  <Input
                    id="rounds"
                    type="number"
                    min="0"
                    {...register("rounds")}
                    className="bg-neutral-800 border-neutral-700 text-white focus-visible:border-[#c11737]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-neutral-300">Debut profesional</Label>
                <Controller
                  name="debut"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Seleccionar fecha"
                    />
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>

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
              {fighter ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
