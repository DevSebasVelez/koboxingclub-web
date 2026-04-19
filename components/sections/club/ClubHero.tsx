"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin();

export default function ClubHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".ch-tag",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        0,
      )
        .fromTo(
          ".ch-line",
          { autoAlpha: 0, yPercent: 100 },
          { autoAlpha: 1, yPercent: 0, duration: 0.65, stagger: 0.08 },
          0.12,
        )
        .fromTo(
          ".ch-sub",
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
      className="relative bg-black text-white pt-40 pb-28 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute left-0 inset-y-0 w-[3px] bg-ko-red"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <p className="origin-center rotate-90 text-[10px] font-medium tracking-[0.55em] text-white/18">
          CUENCA · ECUADOR
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="ch-tag mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-ko-red" aria-hidden />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-white/50">
            Cuenca, Ecuador
          </span>
        </div>

        <h1 className="mb-6">
          <div className="overflow-hidden">
            <span
              className="ch-line block font-bold leading-[0.9] tracking-[-0.03em] text-white"
              style={{ fontSize: "clamp(3.5rem, 10vw, 7.5rem)" }}
            >
              EL CLUB
            </span>
          </div>
          <div className="overflow-hidden mt-2">
            <span
              className="ch-line block font-semibold leading-none tracking-[0.26em] text-ko-red"
              style={{ fontSize: "clamp(0.85rem, 2vw, 1.35rem)" }}
            >
              NUESTRA HISTORIA
            </span>
          </div>
        </h1>

        <p className="ch-sub max-w-lg text-[1.0625rem] text-white/52 leading-relaxed">
          Un gimnasio construido con propósito. Técnica, disciplina y un
          ambiente que forma boxeadores y personas.
        </p>
      </div>
    </section>
  );
}
