"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin();

export default function EventsHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".eh-tag",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        0,
      )
        .fromTo(
          ".eh-line",
          { autoAlpha: 0, yPercent: 100 },
          { autoAlpha: 1, yPercent: 0, duration: 0.65, stagger: 0.08 },
          0.12,
        )
        .fromTo(
          ".eh-sub",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0.38,
        );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative bg-black text-white pt-40 pb-28 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute left-0 inset-y-0 w-[3px] bg-ko-red"
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="eh-tag mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-ko-red" aria-hidden />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-white/50">
            KO Boxing Promotions
          </span>
        </div>

        <h1 className="mb-6">
          <div className="overflow-hidden">
            <span
              className="eh-line block font-bold leading-[0.9] tracking-[-0.03em] text-white will-change-transform"
              style={{ fontSize: "clamp(3.5rem, 10vw, 7.5rem)" }}
            >
              CARTELERA
            </span>
          </div>
          <div className="overflow-hidden mt-2">
            <span
              className="eh-line block font-semibold leading-none tracking-[0.26em] text-ko-red"
              style={{ fontSize: "clamp(0.85rem, 2vw, 1.35rem)" }}
            >
              DE EVENTOS
            </span>
          </div>
        </h1>

        <p className="eh-sub max-w-md text-[1.0625rem] text-white/52 leading-relaxed">
          Combates, veladas y exhibiciones organizados por KO Boxing Promotions.
        </p>
      </div>
    </section>
  );
}
