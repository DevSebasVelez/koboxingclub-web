import { getEvents } from "@/lib/actions/events";
import EventsClient from "@/components/admin/events/EventsClient";

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient initialEvents={events} />;
}
