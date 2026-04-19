import { prisma } from "@/lib/db/prisma";

const FIGHTER_MINI = {
  id: true,
  firstName: true,
  lastName: true,
  slug: true,
  photoUrl: true,
  wins: true,
  losses: true,
  draws: true,
  winsKo: true,
} as const;

export async function getPublishedEvents() {
  return prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { date: "desc" },
    include: {
      _count: { select: { bouts: true } },
    },
  });
}

export async function getPublishedEventBySlug(slug: string) {
  return prisma.event.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      bouts: {
        orderBy: [{ isMainEvent: "desc" }, { order: "asc" }],
        include: {
          fighter1: { select: FIGHTER_MINI },
          fighter2: { select: FIGHTER_MINI },
          category: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function getPublishedFighters(search?: string) {
  return prisma.fighter.findMany({
    where: {
      status: "PUBLISHED",
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { cedula: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
}

export async function getPublishedFighterBySlug(slug: string) {
  return prisma.fighter.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      boutsFighter1: {
        include: {
          event: {
            select: {
              id: true,
              name: true,
              slug: true,
              date: true,
              city: true,
            },
          },
          fighter2: { select: FIGHTER_MINI },
          category: { select: { id: true, name: true } },
        },
        orderBy: { event: { date: "desc" } },
      },
      boutsFighter2: {
        include: {
          event: {
            select: {
              id: true,
              name: true,
              slug: true,
              date: true,
              city: true,
            },
          },
          fighter1: { select: FIGHTER_MINI },
          category: { select: { id: true, name: true } },
        },
        orderBy: { event: { date: "desc" } },
      },
    },
  });
}
