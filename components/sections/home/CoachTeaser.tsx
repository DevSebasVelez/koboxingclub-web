"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function CoachTeaser() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const photo = gsap.utils.toArray<HTMLElement>(".ct-photo", ref.current);
      if (photo.length) {
        gsap.fromTo(
          photo,
          { autoAlpha: 0, x: -28 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              once: true,
            },
          },
        );
      }
      const content = gsap.utils.toArray<HTMLElement>(
        ".ct-content > *",
        ref.current,
      );
      if (!content.length) return;
      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
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
    <section ref={ref} className="bg-black text-white py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="ct-photo order-2 lg:order-1">
            <div className="relative aspect-[4/5] max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-neutral-800">
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center">
                  <span className="text-4xl font-bold text-neutral-500">
                    FP
                  </span>
                </div>
                <span className="text-xs text-neutral-600 tracking-wider uppercase">
                  Foto próximamente
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 bg-linear-to-t from-black to-transparent">
                <p className="font-bold text-white text-lg">
                  Fernando Palomeque
                </p>
                <p className="text-sm text-white/50">
                  Fundador · Entrenador · Boxeador Pro
                </p>
              </div>
              <div className="absolute top-4 left-4 border border-ko-red/40 bg-ko-red/10 px-3 py-1.5 rounded-full">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ko-red">
                  KO Boxing Club
                </span>
              </div>
            </div>
          </div>

          <div className="ct-content order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-ko-red" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                El equipo
              </span>
            </div>

            <h2
              className="font-bold text-white tracking-tight"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}
            >
              Entrenado por alguien
              <br />
              <span className="text-ko-red">que vivió el ring.</span>
            </h2>

            <p className="text-[1.0625rem] text-white/55 leading-relaxed">
              Fernando Palomeque no enseña teoría. Enseña lo que construyó
              entrenando: técnica real, mentalidad de ring y la disciplina que
              transforma cualquier cuerpo y mente.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Entrenador y fundador del club",
                "Formador de todos los niveles",
                "Referente del boxeo en Cuenca",
                "Años de experiencia activa",
              ].map((cred) => (
                <div
                  key={cred}
                  className="flex items-start gap-2 text-sm text-white/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-ko-red mt-1.5 shrink-0" />
                  {cred}
                </div>
              ))}
            </div>

            <Link
              href="/club"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-ko-red text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all hover:bg-ko-red/5 group"
            >
              Conocer al equipo
              <FiArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
