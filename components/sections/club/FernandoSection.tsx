"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiAward, FiStar, FiShield, FiUsers } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const CREDENTIALS = [
  { icon: FiAward, label: "Entrenador principal y fundador de KO Boxing Club" },
  {
    icon: FiShield,
    label: "Especialista en técnica y acondicionamiento de boxeo",
  },
  { icon: FiStar, label: "Referente del boxeo en Cuenca, Ecuador" },
  { icon: FiUsers, label: "Formando boxeadores de todos los niveles" },
];

export default function FernandoSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const photo = gsap.utils.toArray<HTMLElement>(".fp-photo", ref.current);
      if (photo.length) {
        gsap.fromTo(
          photo,
          { autoAlpha: 0, x: 32 },
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
        ".fp-content > *",
        ref.current,
      );
      if (content.length) {
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
      }
      const creds = gsap.utils.toArray<HTMLElement>(".fp-cred", ref.current);
      if (!creds.length) return;
      gsap.fromTo(
        creds,
        { autoAlpha: 0, x: -16 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.08,
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
    <section
      ref={ref}
      className="bg-neutral-950 text-white py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="fp-content space-y-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-ko-red" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                El fundador
              </span>
            </div>

            <div>
              <h2
                className="font-bold tracking-tight text-white"
                style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
              >
                Fernando
              </h2>
              <h2
                className="font-bold tracking-tight text-ko-red"
                style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
              >
                Palomeque
              </h2>
            </div>

            <blockquote className="border-l-2 border-ko-red pl-6">
              <p className="text-[1.125rem] text-white/75 leading-relaxed italic">
                &quot;El boxeo no te enseña solo a pelear. Te enseña a
                respetarte, a mantenerte de pie cuando todo se pone difícil, y a
                entender que el resultado depende únicamente de lo que haces con
                el tiempo que tienes.&quot;
              </p>
              <footer className="mt-3 text-xs text-white/35 not-italic tracking-wider">
                — Fernando Palomeque
              </footer>
            </blockquote>

            <div className="space-y-4">
              <p className="text-[1.0625rem] text-white/60 leading-relaxed">
                Fernando Palomeque llegó al boxeo desde muy joven. La disciplina
                del ring le dio mucho más que habilidades: le dio claridad,
                propósito y la capacidad de transformar adversidad en fortaleza.
                Su camino en el deporte le permitió entender el boxeo desde
                adentro, desde la exigencia real del entrenamiento diario.
              </p>
              <p className="text-[1.0625rem] text-white/60 leading-relaxed">
                Con KO Boxing Club, Fernando tomó todo ese aprendizaje y lo
                convirtió en método: enseña lo que funciona en el ring, sin
                relleno, sin poses. Su objetivo no es solo formar peleadores
                —aunque lo hace con excelencia— sino formar personas con
                carácter, disciplina y confianza real.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {CREDENTIALS.map((c) => (
                <div
                  key={c.label}
                  className="fp-cred flex items-start gap-3 bg-white/4 border border-white/8 rounded-xl p-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-ko-red/15 flex items-center justify-center shrink-0">
                    <c.icon size={15} className="text-ko-red" />
                  </div>
                  <p className="text-sm text-white/65 leading-snug">
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="fp-photo order-first lg:order-last">
            <div className="relative aspect-3/4 max-w-xs mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-neutral-800 border border-white/8">
              <Image
                src="/images/gallery/image-2.jpg"
                alt="Fernando Palomeque — KO Boxing Club"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 320px, 50vw"
                priority
              />

              <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-px w-6 bg-ko-red" />
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-ko-red">
                    KO Boxing Club
                  </span>
                </div>
                <p className="font-bold text-white text-lg leading-tight">
                  Fundador &amp; Entrenador Principal
                </p>
                <p className="text-sm text-white/50 mt-0.5">Cuenca, Ecuador</p>
              </div>

              <div className="absolute top-4 right-4 bg-ko-red px-3 py-1.5 rounded-full">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white">
                  KO Boxing Club
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "KO", l: "Fundador" },
                { v: "Cuenca", l: "Ecuador" },
                { v: "10+", l: "Años" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-white/4 border border-white/8 rounded-xl p-3 text-center"
                >
                  <p className="font-mono font-bold text-ko-red text-lg leading-none">
                    {s.v}
                  </p>
                  <p className="text-[10px] text-white/35 mt-1 uppercase tracking-wider">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
