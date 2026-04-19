"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin();

export default function ContactHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".coh-tag",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        0,
      )
        .fromTo(
          ".coh-line",
          { autoAlpha: 0, yPercent: 100 },
          { autoAlpha: 1, yPercent: 0, duration: 0.65, stagger: 0.08 },
          0.12,
        )
        .fromTo(
          ".coh-sub",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0.4,
        );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative bg-black text-white pt-40 pb-24 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute left-0 inset-y-0 w-[3px] bg-ko-red"
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="coh-tag mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-ko-red" aria-hidden />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-white/50">
            KO Boxing Club
          </span>
        </div>

        <h1 className="mb-6">
          <div className="overflow-hidden">
            <span
              className="coh-line block font-bold leading-[0.9] tracking-[-0.03em] text-white"
              style={{ fontSize: "clamp(3.5rem, 10vw, 7.5rem)" }}
            >
              CONTACTO
            </span>
          </div>
          <div className="overflow-hidden mt-2">
            <span
              className="coh-line block font-semibold leading-none tracking-[0.26em] text-ko-red"
              style={{ fontSize: "clamp(0.85rem, 2vw, 1.35rem)" }}
            >
              CUENCA, ECUADOR
            </span>
          </div>
        </h1>

        <p className="coh-sub max-w-md text-[1.0625rem] text-white/52 leading-relaxed">
          Escríbenos para reservar una clase, hacer preguntas o visitar el
          gimnasio. Respondemos por WhatsApp.
        </p>
      </div>
    </section>
  );
}
