"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function ClubCTA() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".ccta-content > *", {
        autoAlpha: 0,
        y: 22,
        duration: 0.55,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative bg-black text-white py-24 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute left-0 inset-y-0 w-[3px] bg-ko-red"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 50%, #c11737 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 text-center">
        <div className="ccta-content max-w-2xl mx-auto space-y-7">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-ko-red" aria-hidden />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
              Únete al club
            </span>
            <span className="h-px w-8 bg-ko-red" aria-hidden />
          </div>

          <h2
            className="font-bold tracking-tight"
            style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}
          >
            Tu primera clase
            <br />
            <span className="text-ko-red">empieza hoy.</span>
          </h2>

          <p className="text-[1.0625rem] text-white/52 leading-relaxed">
            No necesitas experiencia previa. Solo ganas de aprender, disciplina
            para aparecer y el compromiso de darlo todo dentro del ring.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="https://wa.me/593982667750"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-ko-red hover:bg-ko-red-hover text-white font-semibold px-8 py-4 rounded-lg transition-colors group text-sm"
            >
              Reservar clase por WhatsApp
              <FiArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all text-sm"
            >
              Ver información de contacto
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
