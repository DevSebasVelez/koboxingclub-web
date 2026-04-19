"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { fighterSchema, type FighterInput } from "@/lib/validations/fighter";
import { slugify } from "@/lib/utils/slugify";
import { auth } from "@/lib/auth";
import { deleteFromR2 } from "@/lib/storage/r2";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

export async function getFighters() {
  return prisma.fighter.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { events: true } },
    },
  });
}

export async function getFighterById(id: string) {
  return prisma.fighter.findUnique({
    where: { id },
    include: {
      category: true,
      events: { include: { event: true } },
    },
  });
}

export async function getFighterProfile(id: string) {
  return prisma.fighter.findUnique({
    where: { id },
    include: {
      category: true,
      events: {
        include: { event: true },
        orderBy: { event: { date: "desc" } },
      },
      boutsFighter1: {
        include: {
          event: true,
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
        },
        orderBy: { event: { date: "asc" } },
      },
      boutsFighter2: {
        include: {
          event: true,
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
          category: { select: { id: true, name: true } },
        },
        orderBy: { event: { date: "asc" } },
      },
    },
  });
}

function buildSlug(firstName: string, lastName: string) {
  return slugify(`${firstName} ${lastName}`);
}

export async function createFighter(input: FighterInput) {
  await requireAuth();
  const data = fighterSchema.parse(input);
  const baseSlug = buildSlug(data.firstName, data.lastName);

  let slug = baseSlug;
  let counter = 1;
  while (await prisma.fighter.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const fighter = await prisma.fighter.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      slug,
      photoUrl: data.photoUrl || null,
      photoKey: data.photoKey || null,
      wins: data.wins,
      losses: data.losses,
      draws: data.draws,
      winsKo: data.winsKo,
      lossesKo: data.lossesKo,
      rounds: data.rounds,
      debut: data.debut ? new Date(data.debut) : null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      cedula: data.cedula || null,
      nationality: data.nationality || null,
      residence: data.residence || null,
      club: data.club || null,
      categoryId: data.categoryId || null,
      status: data.status,
    },
  });
  revalidatePath("/admin/fighters");
  revalidatePath("/peleadores", "layout");
  return fighter;
}

export async function updateFighter(id: string, input: FighterInput) {
  await requireAuth();
  const data = fighterSchema.parse(input);

  const fighter = await prisma.fighter.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      photoUrl: data.photoUrl || null,
      photoKey: data.photoKey || null,
      wins: data.wins,
      losses: data.losses,
      draws: data.draws,
      winsKo: data.winsKo,
      lossesKo: data.lossesKo,
      rounds: data.rounds,
      debut: data.debut ? new Date(data.debut) : null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      cedula: data.cedula || null,
      nationality: data.nationality || null,
      residence: data.residence || null,
      club: data.club || null,
      categoryId: data.categoryId || null,
      status: data.status,
    },
  });
  revalidatePath("/admin/fighters");
  revalidatePath("/peleadores", "layout");
  return fighter;
}

export async function toggleFighterStatus(id: string) {
  await requireAuth();
  const fighter = await prisma.fighter.findUnique({ where: { id } });
  if (!fighter) throw new Error("Peleador no encontrado");
  const updated = await prisma.fighter.update({
    where: { id },
    data: { status: fighter.status === "DRAFT" ? "PUBLISHED" : "DRAFT" },
  });
  revalidatePath("/admin/fighters");
  revalidatePath("/peleadores", "layout");
  return updated;
}

export async function deleteFighter(id: string) {
  await requireAuth();
  const fighter = await prisma.fighter.findUnique({ where: { id } });
  if (!fighter) throw new Error("Peleador no encontrado");
  if (fighter.photoKey) {
    try {
      await deleteFromR2(fighter.photoKey);
    } catch {
      // ignore storage errors
    }
  }
  await prisma.fighter.delete({ where: { id } });
  revalidatePath("/admin/fighters");
  revalidatePath("/peleadores", "layout");
}
