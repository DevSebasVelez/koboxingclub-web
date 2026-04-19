"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {
  FiPhone,
  FiMail,
  FiInstagram,
  FiFacebook,
  FiArrowRight,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_ITEMS = [
  {
    icon: FiPhone,
    label: "WhatsApp",
    value: "+593 98 266 7750",
    href: "https://wa.me/593982667750",
  },
  {
    icon: FiMail,
    label: "Email",
    value: "koboxingclub593@gmail.com",
    href: "mailto:koboxingclub593@gmail.com",
  },
  {
    icon: FiInstagram,
    label: "Instagram",
    value: "@koboxingclub593",
    href: "https://www.instagram.com/koboxingclub593/",
  },
  {
    icon: FiFacebook,
    label: "Facebook",
    value: "koboxingclub593",
    href: "https://www.facebook.com/koboxingclub593/",
  },
];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = gsap.utils.toArray<HTMLElement>(
        ".cta-header",
        ref.current,
      );
      const cards = gsap.utils.toArray<HTMLElement>(".cta-card", ref.current);

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
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
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
    <section
      id="contacto"
      ref={ref}
      className="bg-white py-24 border-t border-neutral-100"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="cta-header grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14 items-end">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-ko-red" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Contacto
              </span>
            </div>
            <h2
              className="font-bold tracking-tight text-neutral-900"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}
            >
              ¿Listo para empezar?
              <br />
              <span className="text-ko-red">Escríbenos hoy.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <a
              href="https://wa.me/593982667750"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-ko-red hover:bg-ko-red-hover text-white text-sm font-semibold px-7 py-3.5 rounded-lg transition-colors group"
            >
              Reservar clase por WhatsApp
              <FiArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center border border-neutral-200 hover:border-ko-red text-neutral-700 hover:text-ko-red text-sm font-semibold px-6 py-3.5 rounded-lg transition-all"
            >
              Ver más info
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="cta-card group border border-neutral-100 rounded-2xl p-6 hover:border-ko-red/25 hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-50 group-hover:bg-ko-red/8 flex items-center justify-center mb-4 transition-colors">
                <item.icon
                  size={18}
                  className="text-neutral-500 group-hover:text-ko-red transition-colors"
                />
              </div>
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-1">
                {item.label}
              </p>
              <p className="text-sm font-medium text-neutral-900 group-hover:text-ko-red transition-colors line-clamp-1">
                {item.value}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
