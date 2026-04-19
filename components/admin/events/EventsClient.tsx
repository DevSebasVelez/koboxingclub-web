"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  CalendarDays,
  ExternalLink,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
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
import DeleteDialog from "../shared/DeleteDialog";
import { deleteEvent, toggleEventStatus } from "@/lib/actions/events";

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
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [events, setEvents] = useState(initialEvents);

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
                <TableRow
                  key={event.id}
                  className="border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                >
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
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                    >
                      {event._count.fighters}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
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
                      <Link href={`/admin/events/${event.id}`}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                          title="Ver detalle del evento"
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                      </Link>
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
