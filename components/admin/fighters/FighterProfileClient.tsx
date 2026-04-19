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
  MapPin,
  Shield,
  Star,
  Swords,
  TrendingUp,
  Trophy,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "../shared/StatusBadge";
import FighterDialog from "./FighterDialog";
import { ImageViewer } from "../shared/ImageViewer";
import { toggleFighterStatus } from "@/lib/actions/fighters";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

interface EventEntry {
  id: string;
  event: {
    id: string;
    name: string;
    slug: string;
    date: Date;
    city: string | null;
    country: string | null;
    posterUrl: string | null;
    status: "DRAFT" | "PUBLISHED";
  };
}

interface OpponentFighter {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  wins: number;
  losses: number;
  draws: number;
  winsKo: number;
}

interface BoutAsFighter1 {
  id: string;
  eventId: string;
  isMainEvent: boolean;
  scheduledRounds: number;
  description: string | null;
  category: Category | null;
  event: {
    id: string;
    name: string;
    date: Date;
    city: string | null;
    status: "DRAFT" | "PUBLISHED";
  };
  fighter2: OpponentFighter;
}

interface BoutAsFighter2 {
  id: string;
  eventId: string;
  isMainEvent: boolean;
  scheduledRounds: number;
  description: string | null;
  category: Category | null;
  event: {
    id: string;
    name: string;
    date: Date;
    city: string | null;
    status: "DRAFT" | "PUBLISHED";
  };
  fighter1: OpponentFighter;
}

interface FighterData {
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
  events: EventEntry[];
  boutsFighter1: BoutAsFighter1[];
  boutsFighter2: BoutAsFighter2[];
}

interface FighterProfileClientProps {
  fighter: FighterData;
  categories: Category[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type NormalizedBout = {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  eventCity: string | null;
  eventStatus: "DRAFT" | "PUBLISHED";
  opponent: OpponentFighter;
  isMainEvent: boolean;
  scheduledRounds: number;
  description: string | null;
  category: Category | null;
};

function normalizeBouts(
  boutsFighter1: BoutAsFighter1[],
  boutsFighter2: BoutAsFighter2[],
): NormalizedBout[] {
  const fromF1: NormalizedBout[] = boutsFighter1.map((b) => ({
    id: b.id,
    eventId: b.eventId,
    eventName: b.event.name,
    eventDate: b.event.date,
    eventCity: b.event.city,
    eventStatus: b.event.status,
    opponent: b.fighter2,
    isMainEvent: b.isMainEvent,
    scheduledRounds: b.scheduledRounds,
    description: b.description,
    category: b.category,
  }));

  const fromF2: NormalizedBout[] = boutsFighter2.map((b) => ({
    id: b.id,
    eventId: b.eventId,
    eventName: b.event.name,
    eventDate: b.event.date,
    eventCity: b.event.city,
    eventStatus: b.event.status,
    opponent: b.fighter1,
    isMainEvent: b.isMainEvent,
    scheduledRounds: b.scheduledRounds,
    description: b.description,
    category: b.category,
  }));

  return [...fromF1, ...fromF2].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FighterProfileClient({
  fighter: initialFighter,
  categories,
}: FighterProfileClientProps) {
  const [fighter, setFighter] = useState(initialFighter);

  const allBouts = normalizeBouts(fighter.boutsFighter1, fighter.boutsFighter2);

  const upcomingBouts = allBouts.filter(
    (b) => new Date(b.eventDate) >= new Date(),
  );

  async function handleToggleStatus() {
    try {
      const updated = await toggleFighterStatus(fighter.id);
      setFighter((prev) => ({ ...prev, status: updated.status }));
      toast.success(
        updated.status === "PUBLISHED" ? "Publicado" : "Cambiado a borrador",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/fighters"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="size-4" />
        Peleadores
      </Link>

      {/* Profile card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <div className="flex gap-5 p-5">
          {/* Photo */}
          <div className="relative shrink-0">
            {fighter.photoUrl ? (
              <ImageViewer
                src={fighter.photoUrl}
                alt={`${fighter.firstName} ${fighter.lastName}`}
                rounded="rounded-xl"
                trigger={
                  <div className="relative h-28 w-24 overflow-hidden rounded-xl">
                    <Image
                      src={fighter.photoUrl}
                      alt={`${fighter.firstName} ${fighter.lastName}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                }
              />
            ) : (
              <div className="flex h-28 w-24 items-center justify-center rounded-xl bg-neutral-800">
                <User className="size-10 text-neutral-600" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">
                  {fighter.firstName} {fighter.lastName}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {fighter.slug}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={fighter.status} />
                <FighterDialog
                  fighter={fighter}
                  categories={categories}
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
                    fighter.status === "PUBLISHED"
                      ? "bg-neutral-700 hover:bg-neutral-600 text-white border-transparent"
                      : "bg-[#c11737] hover:bg-[#a01230] text-white border-transparent"
                  }
                >
                  {fighter.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                </Button>
              </div>
            </div>

            {/* Record */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1.5">
                <Trophy className="size-3.5 text-green-400" />
                <span className="text-sm font-bold text-white">
                  {fighter.wins}V
                </span>
                {fighter.winsKo > 0 && (
                  <span className="text-xs text-[#c11737]">
                    ({fighter.winsKo} KO)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1.5">
                <Shield className="size-3.5 text-red-400" />
                <span className="text-sm font-bold text-white">
                  {fighter.losses}D
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1.5">
                <TrendingUp className="size-3.5 text-neutral-400" />
                <span className="text-sm font-bold text-white">
                  {fighter.draws}E
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
              {fighter.category && (
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#c11737]" />
                  {fighter.category.name}
                </span>
              )}
              {fighter.nationality && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-neutral-500" />
                  {fighter.nationality}
                </span>
              )}
              {fighter.club && (
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Club:</span> {fighter.club}
                </span>
              )}
              {fighter.debut && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-neutral-500" />
                  Debut:{" "}
                  {format(new Date(fighter.debut), "d MMM yyyy", {
                    locale: es,
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats + Tabs */}
      <Tabs defaultValue="events">
        <TabsList className="bg-neutral-800 border border-neutral-700">
          <TabsTrigger
            value="events"
            className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700 gap-1.5"
          >
            <CalendarDays className="size-3.5" />
            Eventos ({fighter.events.length})
          </TabsTrigger>
          <TabsTrigger
            value="bouts"
            className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700 gap-1.5"
          >
            <Swords className="size-3.5" />
            Peleas ({allBouts.length})
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700 gap-1.5"
          >
            <TrendingUp className="size-3.5" />
            Datos
          </TabsTrigger>
        </TabsList>

        {/* ── Eventos tab ── */}
        <TabsContent value="events" className="mt-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
            {fighter.events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="size-10 text-neutral-700 mb-3" />
                <p className="text-sm text-neutral-500">
                  No está inscrito en ningún evento.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {fighter.events.map(({ id, event }) => (
                  <div
                    key={id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-800/40 transition-colors"
                  >
                    {event.posterUrl ? (
                      <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded">
                        <Image
                          src={event.posterUrl}
                          alt={event.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded bg-neutral-800">
                        <CalendarDays className="size-4 text-neutral-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {event.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {format(new Date(event.date), "d MMM yyyy", {
                          locale: es,
                        })}
                        {event.city && ` · ${event.city}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={event.status} />
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-xs text-neutral-500 hover:text-white transition-colors"
                      >
                        Ver →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Peleas tab ── */}
        <TabsContent value="bouts" className="mt-4 space-y-3">
          {upcomingBouts.length > 0 && (
            <div className="rounded-xl border border-[#c11737]/30 bg-[#c11737]/5 p-4">
              <p className="text-xs font-medium text-[#c11737] uppercase tracking-wider mb-2">
                Próximas peleas
              </p>
              <div className="flex flex-col gap-2">
                {upcomingBouts.map((bout) => (
                  <BoutRow key={bout.id} bout={bout} />
                ))}
              </div>
            </div>
          )}

          {allBouts.length === 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Swords className="size-10 text-neutral-700 mb-3" />
                <p className="text-sm text-neutral-500">
                  No tiene peleas programadas.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              <div className="divide-y divide-neutral-800">
                {allBouts.map((bout) => (
                  <div key={bout.id} className="px-5 py-3">
                    <BoutRow bout={bout} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Datos tab ── */}
        <TabsContent value="stats" className="mt-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <DataField label="Nombre" value={fighter.firstName} />
              <DataField label="Apellido" value={fighter.lastName} />
              {fighter.cedula && (
                <DataField label="Cédula" value={fighter.cedula} />
              )}
              {fighter.birthDate && (
                <DataField
                  label="Fecha de nacimiento"
                  value={format(new Date(fighter.birthDate), "d MMM yyyy", {
                    locale: es,
                  })}
                />
              )}
              {fighter.nationality && (
                <DataField label="Nacionalidad" value={fighter.nationality} />
              )}
              {fighter.residence && (
                <DataField label="Residencia" value={fighter.residence} />
              )}
              {fighter.club && <DataField label="Club" value={fighter.club} />}
              {fighter.debut && (
                <DataField
                  label="Debut profesional"
                  value={format(new Date(fighter.debut), "d MMM yyyy", {
                    locale: es,
                  })}
                />
              )}
              {fighter.category && (
                <DataField label="Categoría" value={fighter.category.name} />
              )}
              <DataField
                label="Récord"
                value={`${fighter.wins}V - ${fighter.losses}D - ${fighter.draws}E`}
              />
              <DataField
                label="KOs"
                value={`${fighter.winsKo} victorias / ${fighter.lossesKo} derrotas`}
              />
              <DataField
                label="Rounds totales"
                value={String(fighter.rounds)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BoutRow({ bout }: { bout: NormalizedBout }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex shrink-0 items-center justify-center w-5">
        {bout.isMainEvent ? (
          <Star className="size-3.5 text-[#c11737]" fill="currentColor" />
        ) : (
          <Swords className="size-3.5 text-neutral-600" />
        )}
      </div>
      <Avatar size="sm">
        <AvatarImage src={bout.opponent.photoUrl ?? undefined} />
        <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
          {bout.opponent.firstName[0]}
          {bout.opponent.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">
          vs. {bout.opponent.firstName} {bout.opponent.lastName}
        </p>
        <p className="text-xs text-neutral-500">
          {bout.eventName} ·{" "}
          {format(new Date(bout.eventDate), "d MMM yyyy", { locale: es })}
          {bout.eventCity && ` · ${bout.eventCity}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {bout.category && (
          <span className="hidden sm:inline-flex rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
            {bout.category.name}
          </span>
        )}
        <span className="text-xs text-neutral-500">
          {bout.scheduledRounds}R
        </span>
        <Link
          href={`/admin/events/${bout.eventId}`}
          className="text-xs text-neutral-500 hover:text-white transition-colors"
        >
          Ver →
        </Link>
      </div>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm text-white mt-0.5">{value}</p>
    </div>
  );
}
