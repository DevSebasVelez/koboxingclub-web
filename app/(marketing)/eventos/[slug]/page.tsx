import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedEventBySlug } from "@/lib/queries/public";
import EventDetailHero from "@/components/sections/events/EventDetailHero";
import CartellaSection from "@/components/sections/events/CartellaSection";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) return { title: "Evento no encontrado" };
  return {
    title: `${event.name} | KO Boxing Promotions`,
    description:
      event.description ?? `Cartelera de combates del evento ${event.name}.`,
  };
}

export default async function EventoPage({ params }: Props) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <EventDetailHero
        name={event.name}
        date={event.date}
        venue={event.venue}
        city={event.city}
        country={event.country}
        description={event.description}
        posterUrl={event.posterUrl}
        boutCount={event.bouts.length}
      />
      <CartellaSection bouts={event.bouts} />
    </>
  );
}
