"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { boutSchema, type BoutInput } from "@/lib/validations/bout";
import {
  boutResultSchema,
  type BoutResultInput,
} from "@/lib/validations/bout-result";
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

export async function updateBoutResult(
  id: string,
  eventId: string,
  input: BoutResultInput,
) {
  await requireAuth();
  const data = boutResultSchema.parse(input);

  const newWinnerId =
    data.resultStatus === "COMPLETED" && data.winnerFighterId
      ? data.winnerFighterId
      : null;
  const newEndMethod =
    data.resultStatus === "COMPLETED" ? (data.endMethod ?? null) : null;

  const bout = await prisma.$transaction(async (tx) => {
    const current = await tx.bout.findUniqueOrThrow({ where: { id } });

    // Reverse stats from previous completed result
    if (current.resultStatus === "COMPLETED") {
      const prevIsKo =
        current.endMethod === "KO" || current.endMethod === "TKO";
      if (current.winnerFighterId) {
        const prevLoserId =
          current.winnerFighterId === current.fighter1Id
            ? current.fighter2Id
            : current.fighter1Id;
        await tx.fighter.update({
          where: { id: current.winnerFighterId },
          data: {
            wins: { decrement: 1 },
            ...(prevIsKo ? { winsKo: { decrement: 1 } } : {}),
          },
        });
        await tx.fighter.update({
          where: { id: prevLoserId },
          data: {
            losses: { decrement: 1 },
            ...(prevIsKo ? { lossesKo: { decrement: 1 } } : {}),
          },
        });
      } else {
        await tx.fighter.updateMany({
          where: { id: { in: [current.fighter1Id, current.fighter2Id] } },
          data: { draws: { decrement: 1 } },
        });
      }
    }

    // Apply stats for new completed result
    if (data.resultStatus === "COMPLETED") {
      const newIsKo = newEndMethod === "KO" || newEndMethod === "TKO";
      if (newWinnerId) {
        const newLoserId =
          newWinnerId === current.fighter1Id
            ? current.fighter2Id
            : current.fighter1Id;
        await tx.fighter.update({
          where: { id: newWinnerId },
          data: {
            wins: { increment: 1 },
            ...(newIsKo ? { winsKo: { increment: 1 } } : {}),
          },
        });
        await tx.fighter.update({
          where: { id: newLoserId },
          data: {
            losses: { increment: 1 },
            ...(newIsKo ? { lossesKo: { increment: 1 } } : {}),
          },
        });
      } else {
        await tx.fighter.updateMany({
          where: { id: { in: [current.fighter1Id, current.fighter2Id] } },
          data: { draws: { increment: 1 } },
        });
      }
    }

    return tx.bout.update({
      where: { id },
      data: {
        resultStatus: data.resultStatus,
        winnerFighterId: newWinnerId,
        endMethod: newEndMethod,
        endRound:
          data.resultStatus === "COMPLETED" ? (data.endRound ?? null) : null,
        notes: data.notes || null,
      },
      include: boutInclude,
    });
  });

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/admin/fighters");
  return bout;
}
