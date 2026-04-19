"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import StatusBadge from "../shared/StatusBadge";
import EventDialog from "./EventDialog";
import EventFightersManager from "./EventFightersManager";
import DeleteDialog from "../shared/DeleteDialog";
import { deleteEvent, toggleEventStatus } from "@/lib/actions/events";

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
  order: number;
  fighter: Fighter;
}

interface Event {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  date: Date;
  venue: string | null;
  city: string | null;
  country: string | null;
  posterUrl: string | null;
  posterKey: string | null;
  status: "DRAFT" | "PUBLISHED";
  _count: { fighters: number };
}

interface EventsClientProps {
  initialEvents: Event[];
  allFighters: Fighter[];
}

// Extended event with loaded fighters
interface EventWithFighters extends Event {
  fighters?: EventFighterEntry[];
}

export default function EventsClient({
  initialEvents,
  allFighters,
}: EventsClientProps) {
  const [events, setEvents] = useState<EventWithFighters[]>(initialEvents);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingFighters, setLoadingFighters] = useState<string | null>(null);

  async function handleDelete(id: string) {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Evento eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
      throw err;
    }
  }

  async function handleToggleStatus(id: string) {
    try {
      const updated = await toggleEventStatus(id);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: updated.status } : e)),
      );
      toast.success(
        updated.status === "PUBLISHED"
          ? "Evento publicado"
          : "Cambiado a borrador",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  async function handleExpandFighters(eventId: string) {
    if (expandedId === eventId) {
      setExpandedId(null);
      return;
    }

    const ev = events.find((e) => e.id === eventId);
    if (ev?.fighters) {
      setExpandedId(eventId);
      return;
    }

    setLoadingFighters(eventId);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/fighters`);
      if (res.ok) {
        const data = await res.json();
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId ? { ...e, fighters: data.fighters } : e,
          ),
        );
      }
    } catch {
      // If API isn't available, just expand with empty fighters
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, fighters: [] } : e)),
      );
    } finally {
      setLoadingFighters(null);
    }
    setExpandedId(eventId);
  }

  function handleSuccess() {
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="size-6" />
            Eventos
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            {events.length} evento{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <EventDialog
          onSuccess={handleSuccess}
          trigger={
            <Button className="bg-[#c11737] hover:bg-[#a01230] text-white border-transparent">
              Nuevo Evento
            </Button>
          }
        />
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-400 font-medium w-16">
                Póster
              </TableHead>
              <TableHead className="text-neutral-400 font-medium">
                Nombre
              </TableHead>
              <TableHead className="text-neutral-400 font-medium">
                Fecha
              </TableHead>
              <TableHead className="text-neutral-400 font-medium">
                Ciudad
              </TableHead>
              <TableHead className="text-neutral-400 font-medium text-center">
                Estado
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
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-neutral-500 py-12"
                >
                  No hay eventos. Crea el primero.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <React.Fragment key={event.id}>
                  <TableRow className="border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                    <TableCell>
                      {event.posterUrl ? (
                        <div className="relative h-10 w-8 overflow-hidden rounded">
                          <Image
                            src={event.posterUrl}
                            alt={event.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-8 rounded bg-neutral-800 flex items-center justify-center">
                          <CalendarDays className="size-4 text-neutral-600" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{event.name}</p>
                        <p className="text-xs text-neutral-500">{event.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-400 text-sm">
                      {format(new Date(event.date), "d MMM yyyy, HH:mm", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell className="text-neutral-400">
                      {event.city ? (
                        `${event.city}${event.country ? `, ${event.country}` : ""}`
                      ) : (
                        <span className="text-neutral-600 italic">
                          Sin ciudad
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={event.status} />
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                        {event._count.fighters}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleExpandFighters(event.id)}
                          disabled={loadingFighters === event.id}
                          className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                          title="Gestionar peleadores"
                        >
                          <Users className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleToggleStatus(event.id)}
                          className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                          title={
                            event.status === "PUBLISHED"
                              ? "Despublicar"
                              : "Publicar"
                          }
                        >
                          {event.status === "PUBLISHED" ? (
                            <ToggleRight className="size-4 text-green-400" />
                          ) : (
                            <ToggleLeft className="size-4" />
                          )}
                        </Button>
                        <EventDialog
                          event={event}
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
                          title="¿Eliminar evento?"
                          description={`Se eliminará "${event.name}" y todos sus peleadores asociados.`}
                          onConfirm={() => handleDelete(event.id)}
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
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleExpandFighters(event.id)}
                          className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                        >
                          {expandedId === event.id ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === event.id && (
                    <TableRow className="border-neutral-800 bg-neutral-950/50">
                      <TableCell colSpan={7} className="px-6 py-4">
                        <EventFightersManager
                          eventId={event.id}
                          eventFighters={event.fighters ?? []}
                          allFighters={allFighters}
                          onUpdate={handleSuccess}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
