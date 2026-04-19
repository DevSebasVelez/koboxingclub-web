"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function ContactCTA() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".ccta-item", ref.current);
      if (!items.length) return;
      gsap.fromTo(
        items,
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
    <section ref={ref} className="bg-white py-24 border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="ccta-item space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-ko-red" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Empieza hoy
              </span>
            </div>
            <h2
              className="font-bold tracking-tight text-neutral-900"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)" }}
            >
              ¿Listo para tu
              <br />
              <span className="text-ko-red">primera clase?</span>
            </h2>
            <p className="text-[1.0625rem] text-neutral-500 leading-relaxed max-w-md">
              No necesitas experiencia previa. Entrena a tu ritmo, aprende la
              técnica real y avanza con estructura desde el primer día.
            </p>
          </div>

          <div className="ccta-item space-y-3">
            <a
              href="https://wa.me/593982667750"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 w-full bg-ko-red hover:bg-ko-red-hover text-white px-7 py-5 rounded-2xl transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <FaWhatsapp size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-base leading-tight">
                  Reservar clase por WhatsApp
                </p>
                <p className="text-sm text-white/70 mt-0.5">
                  +593 98 266 7750 · Respuesta rápida
                </p>
              </div>
              <FiArrowRight
                size={18}
                className="shrink-0 opacity-60 group-hover:translate-x-1 transition-transform"
              />
            </a>

            <a
              href="mailto:koboxingclub593@gmail.com"
              className="group flex items-center gap-5 w-full border border-neutral-200 hover:border-ko-red/30 hover:shadow-sm bg-white text-neutral-900 px-7 py-5 rounded-2xl transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-50 group-hover:bg-ko-red/8 flex items-center justify-center shrink-0 transition-colors">
                <FiMail
                  size={18}
                  className="text-neutral-400 group-hover:text-ko-red transition-colors"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base leading-tight group-hover:text-ko-red transition-colors">
                  Envíanos un correo
                </p>
                <p className="text-sm text-neutral-400 mt-0.5">
                  koboxingclub593@gmail.com
                </p>
              </div>
              <FiArrowRight
                size={18}
                className="shrink-0 text-neutral-300 group-hover:text-ko-red group-hover:translate-x-1 transition-all"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
