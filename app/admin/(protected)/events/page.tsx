import { getEvents } from "@/lib/actions/events";
import { getFighters } from "@/lib/actions/fighters";
import EventsClient from "@/components/admin/events/EventsClient";

export default async function EventsPage() {
  const [events, fighters] = await Promise.all([getEvents(), getFighters()]);
  return <EventsClient initialEvents={events} allFighters={fighters} />;
}
