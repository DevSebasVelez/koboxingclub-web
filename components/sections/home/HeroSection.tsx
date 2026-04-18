"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiArrowRight } from "react-icons/fi";

gsap.registerPlugin();

const HEADLINE_LINES = [
  { text: "KO", tone: "accent" as const },
  { text: "BOXING CLUB", tone: "neutral" as const },
];

const PILLARS = [
  {
    kicker: "01",
    title: "Técnica",
    body: "Guardia, pies y golpeo con intención.",
  },
  {
    kicker: "02",
    title: "Condición",
    body: "Ritmo de ring y trabajo constante.",
  },
  { kicker: "03", title: "Club", body: "Ambiente serio, limpio y respetuoso." },
];

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    const pillars = pillarRefs.current.filter(Boolean) as HTMLDivElement[];

    gsap.set(bgRef.current, { scale: 1.08 });
    gsap.set(accentRef.current, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(badgeRef.current, { autoAlpha: 0, y: -18 });
    gsap.set(railRef.current, { autoAlpha: 0, x: 24 });
    gsap.set(lines, { autoAlpha: 0, yPercent: 110 });
    gsap.set(descriptionRef.current, { autoAlpha: 0, y: 18 });
    gsap.set(ctaRef.current, { autoAlpha: 0, y: 16 });
    gsap.set(dividerRef.current, {
      autoAlpha: 0,
      scaleX: 0,
      transformOrigin: "left center",
    });
    gsap.set(pillars, { autoAlpha: 0, y: 14 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(bgRef.current, { scale: 1, duration: 2.1, ease: "power2.out" }, 0)
      .to(
        accentRef.current,
        { scaleY: 1, duration: 0.85, ease: "power3.inOut" },
        0.12,
      )
      .to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.22)
      .to(
        railRef.current,
        { autoAlpha: 1, x: 0, duration: 0.75, ease: "power3.out" },
        0.28,
      )
      .to(
        lines,
        { autoAlpha: 1, yPercent: 0, duration: 0.72, stagger: 0.09 },
        0.34,
      )
      .to(descriptionRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.52)
      .to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.6)
      .to(
        dividerRef.current,
        { autoAlpha: 1, scaleX: 1, duration: 0.55, ease: "power3.inOut" },
        0.68,
      )
      .to(
        pillars,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.07,
          ease: "power2.out",
        },
        0.72,
      );
  });

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/banner/banner.webp"
          alt="Interior del ring y entrenamiento en KO Boxing Club"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_center] md:object-[60%_center]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-linear-to-r from-black via-black/88 to-black/25 md:via-black/78 md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-linear-to-t from-black via-black/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--ko-red) 45%, transparent) 0%, transparent 42%), radial-gradient(circle at 80% 12%, rgba(255,255,255,0.12), transparent 38%)",
        }}
      />

      <div
        ref={accentRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-5 h-full w-[3px] bg-ko-red will-change-transform md:w-1"
      />

      <div
        ref={railRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute right-6 top-1/2 z-5 hidden -translate-y-1/2 select-none md:block lg:right-10"
      >
        <p className="origin-center rotate-90 text-[10px] font-medium tracking-[0.55em] text-white/35 [text-orientation:mixed]">
          DISCIPLINA · TÉCNICA · RITMO
        </p>
      </div>

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 md:px-14 lg:px-20 xl:px-24">
          <div className="max-w-[640px] lg:max-w-[680px]">
            <div
              ref={badgeRef}
              style={{ opacity: 0 }}
              className="mb-9 inline-flex items-center gap-3 border border-white/12 bg-black/35 px-4 py-2 backdrop-blur-md"
            >
              <span className="h-px w-8 bg-ko-red" aria-hidden="true" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-white/65">
                Escuela de boxeo
              </span>
              <span className="h-px w-8 bg-white/15" aria-hidden="true" />
            </div>

            <h1 className="mb-8">
              {HEADLINE_LINES.map((line, i) => (
                <div key={line.text} className="overflow-hidden">
                  <span
                    ref={(el) => {
                      lineRefs.current[i] = el;
                    }}
                    className={`block will-change-transform ${
                      line.tone === "accent"
                        ? "font-semibold leading-[0.92] tracking-[-0.04em] text-ko-red"
                        : "mt-3 font-semibold leading-none tracking-[0.28em] text-white"
                    }`}
                    style={{
                      fontSize:
                        line.tone === "accent"
                          ? "clamp(3.75rem, 12vw, 8.5rem)"
                          : "clamp(1.05rem, 2.4vw, 1.65rem)",
                      opacity: 0,
                    }}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </h1>

            <p
              ref={descriptionRef}
              style={{ opacity: 0 }}
              className="max-w-[460px] text-[1.05rem] leading-relaxed text-white/68 md:text-[1.0625rem]"
            >
              Entrena con método, exigencia y respeto. KO Boxing Club es un
              espacio para aprender boxeo de verdad — sin atajos, con coaching
              claro y energía de club.
            </p>

            <div
              ref={ctaRef}
              style={{ opacity: 0 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2 bg-ko-red px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-[transform,background-color] duration-200 hover:bg-ko-red-hover active:scale-[0.98] rounded-lg"
              >
                Reservar clase
                <FiArrowRight className="size-4" />
              </a>
              <a
                href="#horarios"
                className="inline-flex items-center border border-white/25 bg-transparent rounded-lg px-6 py-3.5 text-sm font-semibold tracking-wide text-white/85 transition-[border-color,color,transform] duration-200 hover:border-white hover:text-white active:scale-[0.98]"
              >
                Ver horarios
              </a>
            </div>

            <div
              ref={dividerRef}
              style={{ opacity: 0 }}
              className="my-12 h-px max-w-xl bg-linear-to-r from-white/35 via-white/12 to-transparent will-change-transform"
            />

            <div className="grid gap-8 sm:grid-cols-3">
              {PILLARS.map((item, i) => (
                <div
                  key={item.kicker}
                  ref={(el) => {
                    pillarRefs.current[i] = el;
                  }}
                  style={{ opacity: 0 }}
                  className="border-t border-white/12 pt-5"
                >
                  <p className="font-mono text-md tracking-[0.28em] text-ko-red">
                    {item.kicker}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {item.body}
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
