"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "100%", label: "Técnica real de ring" },
  { value: "1v1", label: "Atención personalizada" },
  { value: "Todos", label: "Niveles bienvenidos" },
  { value: "Cuenca", label: "Ecuador" },
];

export default function StatsStrip() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".stat-item", ref.current);
      if (!items.length) return;
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-neutral-950 border-y border-white/6 py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/8">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item text-center lg:px-10">
              <p
                className="font-mono font-bold text-ko-red leading-none mb-2"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
              >
                {s.value}
              </p>
              <p className="text-xs font-medium tracking-widest uppercase text-white/40">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
