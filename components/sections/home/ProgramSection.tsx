"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const MODULES = [
  {
    num: "01",
    title: "Fundamentos",
    body: "Postura, guardia, desplazamiento y los cuatro golpes básicos del boxeo. La base que lo cambia todo.",
  },
  {
    num: "02",
    title: "Combinaciones",
    body: "De los golpes simples a secuencias fluidas. Aprendes a pensar y moverte dentro del ring.",
  },
  {
    num: "03",
    title: "Defensa",
    body: "Paradas, esquivas y contragolpes. El boxeo real se gana defendiendo bien, no solo atacando.",
  },
  {
    num: "04",
    title: "Acondicionamiento",
    body: "Cardio de ring, saco, pads y sparring controlado. Condición física que no se consigue en otro lado.",
  },
];

export default function ProgramSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = gsap.utils.toArray<HTMLElement>(
        ".prog-header",
        ref.current,
      );
      const cards = gsap.utils.toArray<HTMLElement>(".prog-card", ref.current);

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
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.09,
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
    <section ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="prog-header max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-ko-red" aria-hidden />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
              Programa
            </span>
          </div>
          <h2
            className="font-bold tracking-tight text-neutral-900 mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
          >
            Aprende a boxear
            <br />
            <span className="text-ko-red">de la manera correcta.</span>
          </h2>
          <p className="text-[1.0625rem] text-neutral-500 leading-relaxed max-w-lg">
            Cada clase tiene un objetivo claro. Progresamos juntos, paso a paso,
            sin saltarnos nada. Para principiantes y para quienes ya saben y
            quieren mejorar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {MODULES.map((m) => (
            <div
              key={m.num}
              className="prog-card group border border-neutral-100 rounded-2xl p-6 hover:border-ko-red/20 hover:shadow-md transition-all duration-300"
            >
              <p className="font-mono text-ko-red font-bold text-sm mb-4 tracking-[0.1em]">
                {m.num}
              </p>
              <h3 className="font-bold text-neutral-900 text-lg mb-3 group-hover:text-ko-red transition-colors">
                {m.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {m.body}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/club"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ko-red hover:gap-3 transition-all"
        >
          Conocer más sobre el club
          <FiArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
