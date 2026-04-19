"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const PLATFORMS = [
  {
    Icon: FaInstagram,
    name: "Instagram",
    handle: "@koboxingclub593",
    desc: "El día a día del gimnasio: técnica, entrenamientos, sparrings y la comunidad que se forma dentro del ring.",
    href: "https://www.instagram.com/koboxingclub593/",
  },
  {
    Icon: FaFacebook,
    name: "Facebook",
    handle: "koboxingclub593",
    desc: "Noticias del club, resultados de eventos, convocatorias y todo lo relacionado con la comunidad KO.",
    href: "https://www.facebook.com/koboxingclub593/",
  },
  {
    Icon: FaWhatsapp,
    name: "WhatsApp",
    handle: "+593 98 266 7750",
    desc: "La forma más directa de contactarnos. Reserva una clase, consulta horarios o haz cualquier pregunta.",
    href: "https://wa.me/593982667750",
    highlight: true,
  },
];

export default function ContactSocial() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = gsap.utils.toArray<HTMLElement>(".cs-header", ref.current);
      const rows = gsap.utils.toArray<HTMLElement>(".cs-row", ref.current);
      if (header.length) {
        gsap.fromTo(
          header,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              once: true,
            },
          },
        );
      }
      if (rows.length) {
        gsap.fromTo(
          rows,
          { autoAlpha: 0, x: -20 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
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
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-neutral-950 py-24 border-t border-white/6">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="cs-header lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-ko-red" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                Redes sociales
              </span>
            </div>
            <h2
              className="font-bold tracking-tight text-white"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}
            >
              Síguenos y
              <br />
              <span className="text-ko-red">forma parte.</span>
            </h2>
            <p className="text-[0.9375rem] text-white/45 leading-relaxed">
              Compartimos el proceso, los entrenamientos y la evolución del
              club. Únete a la comunidad KO.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-white/6">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-row group flex items-start gap-5 sm:gap-7 py-8 first:pt-0 last:pb-0"
              >
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-250 ${
                    p.highlight
                      ? "bg-ko-red/15 group-hover:bg-ko-red/30"
                      : "bg-white/5 group-hover:bg-ko-red/12"
                  }`}
                >
                  <p.Icon
                    size={24}
                    className={`transition-colors duration-250 ${
                      p.highlight
                        ? "text-ko-red"
                        : "text-white/40 group-hover:text-ko-red"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <p className="font-bold text-white text-lg leading-tight group-hover:text-ko-red transition-colors duration-200">
                        {p.name}
                      </p>
                      <p className="font-mono text-xs text-white/30 mt-0.5">
                        {p.handle}
                      </p>
                    </div>
                    <FiArrowUpRight
                      size={18}
                      className="shrink-0 mt-1 text-white/18 group-hover:text-ko-red group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200"
                    />
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed mt-3">
                    {p.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
