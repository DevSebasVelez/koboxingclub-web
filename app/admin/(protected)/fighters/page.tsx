import { getFighters } from "@/lib/actions/fighters";
import { getCategories } from "@/lib/actions/categories";
import FightersClient from "@/components/admin/fighters/FightersClient";

export default async function FightersPage() {
  const [fighters, categories] = await Promise.all([
    getFighters(),
    getCategories(),
  ]);
  return <FightersClient initialFighters={fighters} categories={categories} />;
}
