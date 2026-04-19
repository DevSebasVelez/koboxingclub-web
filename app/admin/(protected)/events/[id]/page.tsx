import { notFound } from "next/navigation";
import { getEventById } from "@/lib/actions/events";
import { getFighters } from "@/lib/actions/fighters";
import { getBoutsByEvent } from "@/lib/actions/bouts";
import { getCategories } from "@/lib/actions/categories";
import EventDetailClient from "@/components/admin/events/EventDetailClient";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [event, allFighters, bouts, categories] = await Promise.all([
    getEventById(id),
    getFighters(),
    getBoutsByEvent(id),
    getCategories(),
  ]);

  if (!event) notFound();

  return (
    <EventDetailClient
      event={event}
      allFighters={allFighters}
      bouts={bouts}
      categories={categories}
    />
  );
}
