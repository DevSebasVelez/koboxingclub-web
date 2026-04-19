"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ClubStory() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".story-item", ref.current);
      if (!items.length) return;
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
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
    <section ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <div className="story-item sticky top-28 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-ko-red" aria-hidden />
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                  Historia
                </span>
              </div>
              <h2
                className="font-bold tracking-tight text-neutral-900"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
              >
                Desde Cuenca
                <br />
                <span className="text-ko-red">para el mundo.</span>
              </h2>
              <div className="mt-6 border-l-2 border-ko-red pl-5 space-y-3">
                {[
                  { year: "Fundación", desc: "Nace KO Boxing Club en Cuenca" },
                  {
                    year: "Crecimiento",
                    desc: "Primeros peleadores competitivos",
                  },
                  { year: "Promotions", desc: "Se lanza KO Boxing Promotions" },
                  { year: "Hoy", desc: "Referente del boxeo en Ecuador" },
                ].map((t) => (
                  <div key={t.year} className="story-item">
                    <p className="text-xs font-bold text-ko-red tracking-[0.1em] uppercase">
                      {t.year}
                    </p>
                    <p className="text-sm text-neutral-600">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="story-item space-y-4">
              <h3 className="text-xl font-bold text-neutral-900">
                El origen de una visión
              </h3>
              <p className="text-[1.0625rem] text-neutral-600 leading-relaxed">
                KO Boxing Club nació en Cuenca, Ecuador, de la idea de que el
                boxeo bien enseñado puede cambiar vidas. No como hobby
                superficial, sino como disciplina real: con estructura,
                exigencia y el respeto que solo existe en un gimnasio serio.
              </p>
              <p className="text-[1.0625rem] text-neutral-600 leading-relaxed">
                La visión fue crear un espacio donde cualquier persona —sin
                importar su nivel— pudiera aprender boxeo de verdad, de la mano
                de alguien que lo vivió dentro y fuera del ring.
              </p>
            </div>

            <div className="story-item border-t border-neutral-100 pt-10 space-y-4">
              <h3 className="text-xl font-bold text-neutral-900">
                El método KO
              </h3>
              <p className="text-[1.0625rem] text-neutral-600 leading-relaxed">
                No hay atajos. El método del club se construyó combinando
                técnica profesional de ring con la pedagogía necesaria para que
                cada alumno progrese a su ritmo. Desde el primer día aprendes a
                pararte bien, a golpear con intención y a defenderte. Eso no
                cambia, sin importar tu objetivo: competir, mantenerte en forma
                o simplemente desafiarte.
              </p>
            </div>

            <div className="story-item border-t border-neutral-100 pt-10 space-y-4">
              <h3 className="text-xl font-bold text-neutral-900">
                Más que un gimnasio
              </h3>
              <p className="text-[1.0625rem] text-neutral-600 leading-relaxed">
                KO Boxing Club es una comunidad. Los alumnos se ayudan, se
                desafían y crecen juntos. El ambiente es serio pero accesible,
                limpio, sin egos innecesarios. Aquí el respeto es lo primero —
                tanto dentro del ring como fuera.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { n: "Técnica", d: "Sobre la fuerza" },
                  { n: "Disciplina", d: "Constante y progresiva" },
                  { n: "Respeto", d: "En cada clase" },
                ].map((v) => (
                  <div
                    key={v.n}
                    className="bg-neutral-50 rounded-xl p-4 text-center"
                  >
                    <p className="font-bold text-neutral-900 text-sm">{v.n}</p>
                    <p className="text-xs text-neutral-500 mt-1">{v.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
