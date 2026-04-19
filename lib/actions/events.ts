"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { eventSchema, type EventInput } from "@/lib/validations/event";
import { slugify } from "@/lib/utils/slugify";
import { auth } from "@/lib/auth";
import { deleteFromR2 } from "@/lib/storage/r2";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

export async function getEvents() {
  return prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      _count: { select: { fighters: true } },
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      fighters: {
        orderBy: { order: "asc" },
        include: { fighter: { include: { category: true } } },
      },
    },
  });
}

export async function createEvent(input: EventInput) {
  await requireAuth();
  const data = eventSchema.parse(input);
  const baseSlug = slugify(data.name);

  let slug = baseSlug;
  let counter = 1;
  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const event = await prisma.event.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      date: new Date(data.date),
      venue: data.venue || null,
      city: data.city || null,
      country: data.country || "Colombia",
      posterUrl: data.posterUrl || null,
      posterKey: data.posterKey || null,
      status: data.status,
    },
  });
  revalidatePath("/admin/events");
  return event;
}

export async function updateEvent(id: string, input: EventInput) {
  await requireAuth();
  const data = eventSchema.parse(input);

  const event = await prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || null,
      date: new Date(data.date),
      venue: data.venue || null,
      city: data.city || null,
      country: data.country || "Colombia",
      posterUrl: data.posterUrl || null,
      posterKey: data.posterKey || null,
      status: data.status,
    },
  });
  revalidatePath("/admin/events");
  return event;
}

export async function toggleEventStatus(id: string) {
  await requireAuth();
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new Error("Evento no encontrado");
  const updated = await prisma.event.update({
    where: { id },
    data: { status: event.status === "DRAFT" ? "PUBLISHED" : "DRAFT" },
  });
  revalidatePath("/admin/events");
  return updated;
}

export async function deleteEvent(id: string) {
  await requireAuth();
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new Error("Evento no encontrado");
  if (event.posterKey) {
    try {
      await deleteFromR2(event.posterKey);
    } catch {
      // ignore storage errors
    }
  }
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
}

export async function addFighterToEvent(eventId: string, fighterId: string) {
  await requireAuth();
  const existing = await prisma.eventFighter.findUnique({
    where: { eventId_fighterId: { eventId, fighterId } },
  });
  if (existing) throw new Error("El peleador ya está en este evento");

  const maxOrder = await prisma.eventFighter.aggregate({
    where: { eventId },
    _max: { order: true },
  });

  await prisma.eventFighter.create({
    data: { eventId, fighterId, order: (maxOrder._max.order ?? -1) + 1 },
  });
  revalidatePath("/admin/events");
}

export async function removeFighterFromEvent(
  eventId: string,
  fighterId: string,
) {
  await requireAuth();
  await prisma.eventFighter.delete({
    where: { eventId_fighterId: { eventId, fighterId } },
  });
  revalidatePath("/admin/events");
}
