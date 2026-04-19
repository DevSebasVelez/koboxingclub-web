"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowRight, FiCalendar, FiMapPin } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

interface EventItem {
  id: string;
  name: string;
  slug: string;
  date: Date;
  venue: string | null;
  city: string | null;
  country: string | null;
  posterUrl: string | null;
  _count: { bouts: number };
}

function EventCard({ event }: { event: EventItem }) {
  const now = new Date();
  const isPast = new Date(event.date) < now;

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group block relative bg-neutral-900 overflow-hidden rounded-2xl"
    >
      <div className="aspect-3/4 relative overflow-hidden">
        {event.posterUrl ? (
          <Image
            src={event.posterUrl}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
            <Image
              src="/images/logos/logo-koboxingpromotions.png"
              alt=""
              width={120}
              height={60}
              className="w-28 opacity-20"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-transparent" />

        <div className="absolute top-3 right-3">
          {isPast ? (
            <span className="inline-block bg-black/70 backdrop-blur-sm border border-white/12 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-[0.15em] uppercase text-white/60">
              Pasado
            </span>
          ) : (
            <span className="inline-block bg-ko-red px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.15em] uppercase text-white">
              Próximo
            </span>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-5">
        <div className="flex items-center gap-3 mb-2 text-[11px] font-medium tracking-widest text-white/55">
          <span className="flex items-center gap-1.5">
            <FiCalendar size={11} />
            {format(new Date(event.date), "d MMM yyyy", { locale: es })}
          </span>
          {event.city && (
            <>
              <span className="w-px h-3 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <FiMapPin size={11} />
                {event.city}
              </span>
            </>
          )}
        </div>

        <h3 className="font-bold text-white leading-tight text-xl mb-3 line-clamp-2">
          {event.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/45">
            {event._count.bouts} combate{event._count.bouts !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5 text-ko-red text-xs font-semibold group-hover:gap-2.5 transition-all">
            Ver cartelera
            <FiArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function EventsGridSection({ events }: { events: EventItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const now = new Date();

  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  useGSAP(
    () => {
      gsap.from(".ev-card", {
        autoAlpha: 0,
        y: 32,
        duration: 0.65,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef },
  );

  if (events.length === 0) {
    return (
      <section className="bg-white py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 text-center">
          <p className="text-neutral-400 text-lg">
            No hay eventos publicados aún.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 space-y-20">
        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-10">
              <span className="h-px w-8 bg-ko-red shrink-0" />
              <h2 className="font-bold text-2xl tracking-tight text-neutral-900">
                Próximos eventos
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event) => (
                <div key={event.id} className="ev-card">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-10">
              <span className="h-px w-8 bg-neutral-300 shrink-0" />
              <h2 className="font-bold text-2xl tracking-tight text-neutral-900">
                Eventos pasados
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event) => (
                <div key={event.id} className="ev-card">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
