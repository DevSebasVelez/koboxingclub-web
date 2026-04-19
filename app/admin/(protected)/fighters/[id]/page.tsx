import { notFound } from "next/navigation";
import { getFighterProfile } from "@/lib/actions/fighters";
import { getCategories } from "@/lib/actions/categories";
import FighterProfileClient from "@/components/admin/fighters/FighterProfileClient";

export default async function FighterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [fighter, categories] = await Promise.all([
    getFighterProfile(id),
    getCategories(),
  ]);

  if (!fighter) notFound();

  return <FighterProfileClient fighter={fighter} categories={categories} />;
}
