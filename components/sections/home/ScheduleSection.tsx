"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const SCHEDULE = [
  {
    days: "Lun · Mié · Vie",
    sessions: [
      { time: "6:00am – 8:00am", label: "Técnica" },
      { time: "5:30pm – 7:30pm", label: "Técnica + Sparring" },
    ],
  },
  {
    days: "Mar · Jue",
    sessions: [
      { time: "6:00am – 8:00am", label: "Acondicionamiento" },
      { time: "5:30pm – 7:30pm", label: "Combinaciones" },
    ],
  },
  {
    days: "Sábado",
    sessions: [{ time: "8:00am – 11:00am", label: "Clase general + Sparring" }],
  },
  {
    days: "Domingo",
    sessions: [{ time: "Cerrado", label: "Descanso" }],
    closed: true,
  },
];

export default function ScheduleSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = gsap.utils.toArray<HTMLElement>(
        ".sch-header",
        ref.current,
      );
      const cards = gsap.utils.toArray<HTMLElement>(".sch-card", ref.current);

      if (header.length) {
        gsap.fromTo(
          header,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              once: true,
            },
          },
        );
      }
      if (cards.length) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <section
      id="horarios"
      ref={ref}
      className="bg-neutral-50 py-24 border-t border-neutral-100"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="sch-header flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-ko-red" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Horarios
              </span>
            </div>
            <h2
              className="font-bold tracking-tight text-neutral-900"
              style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)" }}
            >
              Clases todos los días.
              <br />
              <span className="text-ko-red">Sin excusas.</span>
            </h2>
          </div>
          <Link
            href="/#contacto"
            className="shrink-0 inline-flex items-center bg-ko-red hover:bg-ko-red-hover text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Reservar mi lugar
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCHEDULE.map((day) => (
            <div
              key={day.days}
              className={`sch-card rounded-2xl p-6 ${
                day.closed
                  ? "bg-neutral-100 border border-neutral-200"
                  : "bg-white border border-neutral-100 hover:border-ko-red/20 hover:shadow-md transition-all duration-300"
              }`}
            >
              <p
                className={`font-mono text-xs font-bold tracking-widest uppercase mb-5 ${
                  day.closed ? "text-neutral-400" : "text-ko-red"
                }`}
              >
                {day.days}
              </p>
              <div className="space-y-3">
                {day.sessions.map((s) => (
                  <div key={s.time}>
                    <p
                      className={`font-semibold text-base ${
                        day.closed ? "text-neutral-400" : "text-neutral-900"
                      }`}
                    >
                      {s.time}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-neutral-400 text-center">
          * Los horarios pueden variar. Confirma disponibilidad por WhatsApp.
        </p>
      </div>
    </section>
  );
}
