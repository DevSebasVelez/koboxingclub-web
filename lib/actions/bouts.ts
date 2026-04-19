"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { boutSchema, type BoutInput } from "@/lib/validations/bout";
import { auth } from "@/lib/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

const boutInclude = {
  fighter1: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photoUrl: true,
      wins: true,
      losses: true,
      draws: true,
      winsKo: true,
    },
  },
  fighter2: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photoUrl: true,
      wins: true,
      losses: true,
      draws: true,
      winsKo: true,
    },
  },
  category: { select: { id: true, name: true } },
} as const;

export async function getBoutsByEvent(eventId: string) {
  return prisma.bout.findMany({
    where: { eventId },
    orderBy: { order: "asc" },
    include: boutInclude,
  });
}

export async function createBout(input: BoutInput) {
  await requireAuth();
  const data = boutSchema.parse(input);

  if (data.fighter1Id === data.fighter2Id) {
    throw new Error("Un peleador no puede pelear contra sí mismo");
  }

  const maxOrder = await prisma.bout.aggregate({
    where: { eventId: data.eventId },
    _max: { order: true },
  });

  const bout = await prisma.bout.create({
    data: {
      eventId: data.eventId,
      fighter1Id: data.fighter1Id,
      fighter2Id: data.fighter2Id,
      categoryId: data.categoryId || null,
      order: (maxOrder._max.order ?? -1) + 1,
      isMainEvent: data.isMainEvent,
      scheduledRounds: data.scheduledRounds,
      description: data.description || null,
    },
    include: boutInclude,
  });

  revalidatePath(`/admin/events/${data.eventId}`);
  return bout;
}

export async function updateBout(id: string, input: BoutInput) {
  await requireAuth();
  const data = boutSchema.parse(input);

  if (data.fighter1Id === data.fighter2Id) {
    throw new Error("Un peleador no puede pelear contra sí mismo");
  }

  const bout = await prisma.bout.update({
    where: { id },
    data: {
      fighter1Id: data.fighter1Id,
      fighter2Id: data.fighter2Id,
      categoryId: data.categoryId || null,
      isMainEvent: data.isMainEvent,
      scheduledRounds: data.scheduledRounds,
      description: data.description || null,
    },
    include: boutInclude,
  });

  revalidatePath(`/admin/events/${data.eventId}`);
  return bout;
}

export async function deleteBout(id: string, eventId: string) {
  await requireAuth();
  await prisma.bout.delete({ where: { id } });
  revalidatePath(`/admin/events/${eventId}`);
}
