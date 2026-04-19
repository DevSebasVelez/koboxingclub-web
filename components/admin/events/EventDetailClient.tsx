"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  MapPin,
  Star,
  Swords,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import EventDialog from "./EventDialog";
import DeleteDialog from "../shared/DeleteDialog";
import BoutDialog from "../bouts/BoutDialog";
import BoutResultDialog from "../bouts/BoutResultDialog";
import {
  addFighterToEvent,
  removeFighterFromEvent,
  toggleEventStatus,
} from "@/lib/actions/events";
import { deleteBout } from "@/lib/actions/bouts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

interface EventFighterEntry {
  id: string;
  fighterId: string;
  order: number;
  fighter: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    category: Category | null;
  };
}

interface BoutFighter {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  wins: number;
  losses: number;
  draws: number;
  winsKo: number;
}

interface BoutEntry {
  id: string;
  eventId: string;
  fighter1Id: string;
  fighter2Id: string;
  categoryId: string | null;
  order: number;
  isMainEvent: boolean;
  scheduledRounds: number;
  description: string | null;
  resultStatus: "PENDING" | "COMPLETED" | "NO_CONTEST" | "CANCELLED";
  winnerFighterId: string | null;
  endMethod:
    | "KO"
    | "TKO"
    | "DECISION"
    | "SPLIT_DECISION"
    | "DRAW"
    | "DQ"
    | "NO_CONTEST"
    | null;
  endRound: number | null;
  notes: string | null;
  fighter1: BoutFighter;
  fighter2: BoutFighter;
  category: Category | null;
}

interface AllFighter {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  category: Category | null;
}

interface EventData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  date: Date;
  venue: string | null;
  city: string | null;
  country: string | null;
  posterKey: string | null;
  posterUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  fighters: EventFighterEntry[];
}

interface EventDetailClientProps {
  event: EventData;
  allFighters: AllFighter[];
  bouts: BoutEntry[];
  categories: Category[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EventDetailClient({
  event: initialEvent,
  allFighters,
  bouts: initialBouts,
  categories,
}: EventDetailClientProps) {
  const [event, setEvent] = useState(initialEvent);
  const [fighters, setFighters] = useState(initialEvent.fighters);
  const [bouts, setBouts] = useState(initialBouts);

  // ── Fighters in event (for selects) ──────────────────────────────────────
  const eventFighterIds = new Set(fighters.map((ef) => ef.fighterId));
  const availableToAdd = allFighters.filter((f) => !eventFighterIds.has(f.id));
  const eventFightersForBout = fighters.map((ef) => ef.fighter);

  // ── Fighters management ───────────────────────────────────────────────────
  const [addFighterOpen, setAddFighterOpen] = useState(false);
  const [selectedFighterId, setSelectedFighterId] = useState("");
  const [loadingAddFighter, setLoadingAddFighter] = useState(false);
  const [removingFighterId, setRemovingFighterId] = useState<string | null>(
    null,
  );

  async function handleAddFighter() {
    if (!selectedFighterId) return;
    setLoadingAddFighter(true);
    try {
      await addFighterToEvent(event.id, selectedFighterId);
      const added = allFighters.find((f) => f.id === selectedFighterId);
      if (added) {
        setFighters((prev) => [
          ...prev,
          {
            id: `temp-${selectedFighterId}`,
            fighterId: added.id,
            order: prev.length,
            fighter: added,
          },
        ]);
      }
      toast.success("Peleador agregado al evento");
      setSelectedFighterId("");
      setAddFighterOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al agregar");
    } finally {
      setLoadingAddFighter(false);
    }
  }

  async function handleRemoveFighter(fighterId: string) {
    setRemovingFighterId(fighterId);
    try {
      await removeFighterFromEvent(event.id, fighterId);
      setFighters((prev) => prev.filter((ef) => ef.fighterId !== fighterId));
      toast.success("Peleador removido del evento");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al remover");
    } finally {
      setRemovingFighterId(null);
    }
  }

  // ── Bouts management ──────────────────────────────────────────────────────
  async function handleBoutCreated(newBout: unknown) {
    setBouts((prev) =>
      [...prev, newBout as BoutEntry].sort((a, b) => a.order - b.order),
    );
  }

  async function handleBoutUpdated(updatedBout: unknown) {
    setBouts((prev) =>
      prev.map((b) =>
        b.id === (updatedBout as BoutEntry).id ? (updatedBout as BoutEntry) : b,
      ),
    );
  }

  async function handleDeleteBout(boutId: string) {
    await deleteBout(boutId, event.id);
    setBouts((prev) => prev.filter((b) => b.id !== boutId));
    toast.success("Pelea eliminada");
  }

  // ── Status toggle ─────────────────────────────────────────────────────────
  async function handleToggleStatus() {
    try {
      const updated = await toggleEventStatus(event.id);
      setEvent((prev) => ({ ...prev, status: updated.status }));
      toast.success(
        updated.status === "PUBLISHED"
          ? "Evento publicado"
          : "Cambiado a borrador",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/admin/events"
          className="mt-1 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          Eventos
        </Link>
      </div>

      {/* Event info card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <div className="flex gap-4 p-5">
          {event.posterUrl ? (
            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={event.posterUrl}
                alt={event.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
              <CalendarDays className="size-8 text-neutral-600" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">
                  {event.name}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">{event.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={event.status} />
                <EventDialog
                  event={event}
                  onSuccess={() => window.location.reload()}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                    >
                      Editar
                    </Button>
                  }
                />
                <Button
                  size="sm"
                  onClick={handleToggleStatus}
                  className={
                    event.status === "PUBLISHED"
                      ? "bg-neutral-700 hover:bg-neutral-600 text-white border-transparent"
                      : "bg-[#c11737] hover:bg-[#a01230] text-white border-transparent"
                  }
                >
                  {event.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-neutral-500" />
                {format(new Date(event.date), "d 'de' MMMM yyyy, HH:mm", {
                  locale: es,
                })}
              </span>
              {(event.city || event.venue) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-neutral-500" />
                  {[event.venue, event.city, event.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
            </div>

            {event.description && (
              <p className="mt-2 text-sm text-neutral-400 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="fighters">
        <TabsList className="bg-neutral-800 border border-neutral-700">
          <TabsTrigger
            value="fighters"
            className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700 gap-1.5"
          >
            <Users className="size-3.5" />
            Peleadores
            <Badge
              variant="secondary"
              className="bg-neutral-700 text-neutral-300 text-xs px-1.5 py-0 h-4"
            >
              {fighters.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="bouts"
            className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700 gap-1.5"
          >
            <Swords className="size-3.5" />
            Cartelera
            <Badge
              variant="secondary"
              className="bg-neutral-700 text-neutral-300 text-xs px-1.5 py-0 h-4"
            >
              {bouts.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ── Peleadores tab ── */}
        <TabsContent value="fighters" className="mt-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-neutral-300">
                Peleadores inscritos en este evento
              </h2>
              <Dialog open={addFighterOpen} onOpenChange={setAddFighterOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white gap-1.5"
                  >
                    <UserPlus className="size-3.5" />
                    Agregar peleador
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border-neutral-800 sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Agregar peleador al evento
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-2">
                    {availableToAdd.length === 0 ? (
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
                          {availableToAdd.map((f) => (
                            <SelectItem
                              key={f.id}
                              value={f.id}
                              className="text-white focus:bg-neutral-700"
                            >
                              <span className="font-medium">
                                {f.firstName} {f.lastName}
                              </span>
                              {f.category && (
                                <span className="ml-1.5 text-xs text-neutral-400">
                                  · {f.category.name}
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddFighterOpen(false)}
                      className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddFighter}
                      disabled={!selectedFighterId || loadingAddFighter}
                      className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent"
                    >
                      {loadingAddFighter && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      Agregar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {fighters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Users className="size-10 text-neutral-700 mb-3" />
                <p className="text-sm text-neutral-500">
                  No hay peleadores en este evento.
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Usa el botón &quot;Agregar peleador&quot; para inscribir
                  participantes.
                </p>
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {fighters.map(({ fighterId, fighter }) => (
                  <div
                    key={fighterId}
                    className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-800/40 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/fighters/${fighterId}`}
                        className="flex items-center justify-center rounded-md p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors"
                        title="Ver perfil"
                      >
                        <Users className="size-3.5" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={removingFighterId === fighterId}
                        onClick={() => handleRemoveFighter(fighterId)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        {removingFighterId === fighterId ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Cartelera tab ── */}
        <TabsContent value="bouts" className="mt-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-neutral-300">
                Peleas programadas para este evento
              </h2>
              <BoutDialog
                eventId={event.id}
                eventFighters={eventFightersForBout}
                categories={categories}
                onSuccess={handleBoutCreated}
                trigger={
                  <Button
                    size="sm"
                    className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent gap-1.5"
                  >
                    <Swords className="size-3.5" />
                    Nueva pelea
                  </Button>
                }
              />
            </div>

            {bouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Swords className="size-10 text-neutral-700 mb-3" />
                <p className="text-sm text-neutral-500">
                  No hay peleas en la cartelera.
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Agrega peleadores primero, luego crea la cartelera.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {bouts.map((bout, index) => (
                  <BoutCard
                    key={bout.id}
                    bout={bout}
                    number={index + 1}
                    eventFighters={eventFightersForBout}
                    categories={categories}
                    onUpdated={handleBoutUpdated}
                    onDeleted={handleDeleteBout}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── BoutCard ────────────────────────────────────────────────────────────────

const RESULT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  NO_CONTEST: "Sin Contestar",
  CANCELLED: "Cancelada",
};

const END_METHOD_SHORT: Record<string, string> = {
  KO: "KO",
  TKO: "TKO",
  DECISION: "Decisión",
  SPLIT_DECISION: "Dec. Dividida",
  DRAW: "Empate",
  DQ: "Descalificación",
  NO_CONTEST: "Sin Contestar",
};

interface BoutCardProps {
  bout: BoutEntry;
  number: number;
  eventFighters: AllFighter[];
  categories: Category[];
  onUpdated: (bout: unknown) => void;
  onDeleted: (id: string) => Promise<void>;
}

function BoutCard({
  bout,
  number,
  eventFighters,
  categories,
  onUpdated,
  onDeleted,
}: BoutCardProps) {
  const isCompleted = bout.resultStatus === "COMPLETED";
  const hasResult = bout.resultStatus !== "PENDING";

  const winnerName =
    isCompleted && bout.winnerFighterId
      ? bout.winnerFighterId === bout.fighter1Id
        ? `${bout.fighter1.firstName} ${bout.fighter1.lastName}`
        : `${bout.fighter2.firstName} ${bout.fighter2.lastName}`
      : null;

  const resultSummary = isCompleted
    ? [
        winnerName ? `Gana ${winnerName}` : "Empate",
        bout.endMethod ? END_METHOD_SHORT[bout.endMethod] : null,
        bout.endRound ? `R${bout.endRound}` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : hasResult
      ? RESULT_STATUS_LABELS[bout.resultStatus]
      : null;

  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        bout.isMainEvent
          ? "border-[#c11737]/40 bg-[#c11737]/5"
          : "border-neutral-800 bg-neutral-800/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex w-6 shrink-0 items-center justify-center">
          {bout.isMainEvent ? (
            <Star className="size-4 text-[#c11737]" fill="currentColor" />
          ) : (
            <span className="text-xs font-medium text-neutral-600">
              {number}
            </span>
          )}
        </div>

        <div className="flex flex-1 items-center gap-2 min-w-0">
          {/* Fighter 1 */}
          <div className="flex flex-1 items-center gap-2 min-w-0 justify-end">
            <div className="text-right min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  isCompleted && bout.winnerFighterId === bout.fighter1Id
                    ? "text-emerald-400"
                    : isCompleted && bout.winnerFighterId !== null
                      ? "text-neutral-500"
                      : "text-white"
                }`}
              >
                {bout.fighter1.firstName} {bout.fighter1.lastName}
              </p>
              <p className="text-xs text-neutral-500">
                {bout.fighter1.wins}V-{bout.fighter1.losses}D
                {bout.fighter1.winsKo > 0 && (
                  <span className="text-[#c11737] ml-1">
                    ({bout.fighter1.winsKo} KO)
                  </span>
                )}
              </p>
            </div>
            <Avatar size="sm">
              <AvatarImage src={bout.fighter1.photoUrl ?? undefined} />
              <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
                {bout.fighter1.firstName[0]}
                {bout.fighter1.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* VS / result center */}
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <span className="text-xs font-bold text-neutral-500">VS</span>
            <span className="text-xs text-neutral-600">
              {bout.scheduledRounds}R
            </span>
          </div>

          {/* Fighter 2 */}
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <Avatar size="sm">
              <AvatarImage src={bout.fighter2.photoUrl ?? undefined} />
              <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
                {bout.fighter2.firstName[0]}
                {bout.fighter2.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  isCompleted && bout.winnerFighterId === bout.fighter2Id
                    ? "text-emerald-400"
                    : isCompleted && bout.winnerFighterId !== null
                      ? "text-neutral-500"
                      : "text-white"
                }`}
              >
                {bout.fighter2.firstName} {bout.fighter2.lastName}
              </p>
              <p className="text-xs text-neutral-500">
                {bout.fighter2.wins}V-{bout.fighter2.losses}D
                {bout.fighter2.winsKo > 0 && (
                  <span className="text-[#c11737] ml-1">
                    ({bout.fighter2.winsKo} KO)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Meta + actions */}
        <div className="flex shrink-0 items-center gap-2">
          {bout.category && (
            <span className="hidden sm:inline-flex items-center rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {bout.category.name}
            </span>
          )}
          {bout.isMainEvent && (
            <span className="hidden sm:inline-flex items-center rounded-full bg-[#c11737]/20 px-2 py-0.5 text-xs text-[#c11737] font-medium">
              Estelar
            </span>
          )}
          <BoutResultDialog
            boutId={bout.id}
            eventId={bout.eventId}
            fighter1={bout.fighter1}
            fighter2={bout.fighter2}
            scheduledRounds={bout.scheduledRounds}
            currentResult={{
              resultStatus: bout.resultStatus,
              winnerFighterId: bout.winnerFighterId,
              endMethod: bout.endMethod,
              endRound: bout.endRound,
              notes: bout.notes,
            }}
            onSuccess={onUpdated}
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                className={
                  isCompleted
                    ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-700"
                }
                title="Registrar resultado"
              >
                <ClipboardCheck className="size-3.5" />
              </Button>
            }
          />
          <BoutDialog
            eventId={bout.eventId}
            eventFighters={eventFighters}
            categories={categories}
            bout={bout}
            onSuccess={onUpdated}
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-neutral-400 hover:text-white hover:bg-neutral-700"
              >
                <Swords className="size-3.5" />
              </Button>
            }
          />
          <DeleteDialog
            title="¿Eliminar pelea?"
            description="Se eliminará esta pelea de la cartelera."
            onConfirm={() => onDeleted(bout.id)}
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
      </div>

      {(bout.description || resultSummary) && (
        <div className="mt-1.5 ml-9 flex flex-wrap items-center gap-2">
          {bout.description && (
            <p className="text-xs text-neutral-500 italic">
              {bout.description}
            </p>
          )}
          {resultSummary && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isCompleted
                  ? "bg-emerald-400/10 text-emerald-400"
                  : bout.resultStatus === "CANCELLED"
                    ? "bg-neutral-700/50 text-neutral-400"
                    : "bg-amber-400/10 text-amber-400"
              }`}
            >
              <ClipboardCheck className="size-3" />
              {resultSummary}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
