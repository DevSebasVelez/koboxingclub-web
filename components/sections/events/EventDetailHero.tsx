"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiArrowLeft, FiCalendar, FiMapPin } from "react-icons/fi";

gsap.registerPlugin();

interface EventDetailHeroProps {
  name: string;
  date: Date;
  venue: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  posterUrl: string | null;
  boutCount: number;
}

export default function EventDetailHero({
  name,
  date,
  venue,
  city,
  country,
  description,
  posterUrl,
  boutCount,
}: EventDetailHeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".edh-back",
        { autoAlpha: 0, x: -12 },
        { autoAlpha: 1, x: 0, duration: 0.4 },
        0,
      )
        .fromTo(
          ".edh-meta",
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, duration: 0.45 },
          0.1,
        )
        .fromTo(
          ".edh-title",
          { autoAlpha: 0, yPercent: 80 },
          { autoAlpha: 1, yPercent: 0, duration: 0.65 },
          0.18,
        )
        .fromTo(
          ".edh-info",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
          0.36,
        )
        .fromTo(
          ".edh-desc",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.45 },
          0.5,
        );
    },
    { scope: root },
  );

  const location = [venue, city, country].filter(Boolean).join(" · ");

  return (
    <section
      ref={root}
      className="relative bg-black text-white min-h-[62vh] flex items-end overflow-hidden"
    >
      {posterUrl && (
        <div className="absolute inset-0">
          <Image
            src={posterUrl}
            alt={name}
            fill
            className="object-cover object-top opacity-30"
            priority
            sizes="100vw"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/40" />
      <div
        aria-hidden
        className="absolute left-0 inset-y-0 w-[3px] bg-ko-red"
      />

      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 pt-32 pb-16">
        <Link
          href="/eventos"
          className="edh-back inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
        >
          <FiArrowLeft size={14} />
          Todos los eventos
        </Link>

        <div className="edh-meta flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-ko-red" aria-hidden />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
            KO Boxing Promotions
          </span>
        </div>

        <div className="overflow-hidden mb-4">
          <h1
            className="edh-title font-bold leading-[0.92] tracking-tight text-white will-change-transform"
            style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}
          >
            {name}
          </h1>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          <span className="edh-info flex items-center gap-2 text-sm text-white/60">
            <FiCalendar size={14} className="text-ko-red" />
            {format(new Date(date), "EEEE d 'de' MMMM 'de' yyyy, HH:mm", {
              locale: es,
            })}
          </span>
          {location && (
            <span className="edh-info flex items-center gap-2 text-sm text-white/60">
              <FiMapPin size={14} className="text-ko-red" />
              {location}
            </span>
          )}
          <span className="edh-info flex items-center gap-2 text-sm text-white/60">
            <span className="text-ko-red font-bold text-base">{boutCount}</span>
            combate{boutCount !== 1 ? "s" : ""}
          </span>
        </div>

        {description && (
          <p className="edh-desc max-w-xl text-[0.9375rem] text-white/50 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
