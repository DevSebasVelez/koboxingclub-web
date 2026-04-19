import type { Metadata } from "next";
import { getPublishedEvents } from "@/lib/queries/public";
import EventsHero from "@/components/sections/events/EventsHero";
import EventsGridSection from "@/components/sections/events/EventsGridSection";

export const metadata: Metadata = {
  title: "Cartelera de Eventos | KO Boxing Promotions",
  description:
    "Todos los eventos, veladas y combates de boxeo organizados por KO Boxing Promotions.",
};

export default async function EventosPage() {
  const events = await getPublishedEvents();
  return (
    <>
      <EventsHero />
      <EventsGridSection events={events} />
    </>
  );
}
