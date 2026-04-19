"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { slugify } from "@/lib/utils/slugify";
import { auth } from "@/lib/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { fighters: true } } },
  });
}

export async function createCategory(input: CategoryInput) {
  await requireAuth();
  const data = categorySchema.parse(input);
  const slug = slugify(data.name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw new Error("Ya existe una categoría con ese nombre");

  const category = await prisma.category.create({
    data: { name: data.name, slug, description: data.description || null },
  });
  revalidatePath("/admin/categories");
  return category;
}

export async function updateCategory(id: string, input: CategoryInput) {
  await requireAuth();
  const data = categorySchema.parse(input);
  const slug = slugify(data.name);

  const existing = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) throw new Error("Ya existe una categoría con ese nombre");

  const category = await prisma.category.update({
    where: { id },
    data: { name: data.name, slug, description: data.description || null },
  });
  revalidatePath("/admin/categories");
  return category;
}

export async function deleteCategory(id: string) {
  await requireAuth();
  const fighters = await prisma.fighter.count({ where: { categoryId: id } });
  if (fighters > 0) throw new Error("No se puede eliminar: tiene peleadores asignados");
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
