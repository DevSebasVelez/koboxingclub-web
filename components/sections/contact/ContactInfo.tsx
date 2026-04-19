"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  FiPhone,
  FiMail,
  FiInstagram,
  FiFacebook,
  FiArrowRight,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const CHANNELS = [
  {
    icon: FiPhone,
    label: "WhatsApp",
    headline: "+593 98 266 7750",
    desc: "La forma más rápida de contactarnos. Respondemos en horario de clases.",
    cta: "Escribir por WhatsApp",
    href: "https://wa.me/593982667750",
    accent: true,
  },
  {
    icon: FiMail,
    label: "Email",
    headline: "koboxingclub593@gmail.com",
    desc: "Para consultas más detalladas o información sobre entrenamientos.",
    cta: "Enviar correo",
    href: "mailto:koboxingclub593@gmail.com",
  },
  {
    icon: FiInstagram,
    label: "Instagram",
    headline: "@koboxingclub593",
    desc: "Seguimos subiendo contenido del día a día en el gimnasio y de nuestros eventos.",
    cta: "Ver en Instagram",
    href: "https://www.instagram.com/koboxingclub593/",
  },
  {
    icon: FiFacebook,
    label: "Facebook",
    headline: "koboxingclub593",
    desc: "Actualizaciones de eventos, resultados y noticias del club.",
    cta: "Ver en Facebook",
    href: "https://www.facebook.com/koboxingclub593/",
  },
];

export default function ContactInfo() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".ci-card", ref.current);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 28 },
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
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={`ci-card group rounded-2xl p-7 border transition-all duration-300 ${
                c.accent
                  ? "border-ko-red/25 bg-ko-red/3 hover:bg-ko-red/6"
                  : "border-neutral-100 bg-white hover:border-ko-red/20 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    c.accent
                      ? "bg-ko-red/12"
                      : "bg-neutral-50 group-hover:bg-ko-red/8"
                  } transition-colors`}
                >
                  <c.icon
                    size={20}
                    className={
                      c.accent
                        ? "text-ko-red"
                        : "text-neutral-500 group-hover:text-ko-red transition-colors"
                    }
                  />
                </div>
                {c.accent && (
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-ko-red bg-ko-red/10 px-2.5 py-1 rounded-full">
                    Recomendado
                  </span>
                )}
              </div>

              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-1">
                {c.label}
              </p>
              <p
                className={`font-bold text-lg mb-3 ${
                  c.accent
                    ? "text-ko-red"
                    : "text-neutral-900 group-hover:text-ko-red"
                } transition-colors`}
              >
                {c.headline}
              </p>
              <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                {c.desc}
              </p>

              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold ${
                  c.accent
                    ? "text-ko-red"
                    : "text-neutral-400 group-hover:text-ko-red"
                } transition-colors`}
              >
                {c.cta}
                <FiArrowRight
                  size={12}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
