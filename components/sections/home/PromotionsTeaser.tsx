"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function PromotionsTeaser() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const content = gsap.utils.toArray<HTMLElement>(
        ".promo-content > *",
        ref.current,
      );
      if (content.length) {
        gsap.fromTo(
          content,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
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
      const logo = gsap.utils.toArray<HTMLElement>(".promo-logo", ref.current);
      if (!logo.length) return;
      gsap.fromTo(
        logo,
        { autoAlpha: 0, scale: 0.88 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
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
      className="relative bg-black text-white py-24 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #c11737 0px, #c11737 1px, transparent 0px, transparent 50%)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute left-0 inset-y-0 w-[3px] bg-ko-red"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="promo-content space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-ko-red" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                KO Boxing Promotions
              </span>
            </div>

            <h2
              className="font-bold tracking-tight"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}
            >
              Los mejores combates
              <br />
              <span className="text-ko-red">del Ecuador.</span>
            </h2>

            <p className="text-[1.0625rem] text-white/55 leading-relaxed max-w-md">
              KO Boxing Promotions es la división que lleva el boxeo profesional
              al público. Veladas, combates y carteleras organizadas con el
              mismo nivel de exigencia que en el gimnasio.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 bg-ko-red hover:bg-ko-red-hover text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors group"
              >
                Ver cartelera
                <FiArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                href="/peleadores"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all"
              >
                Nuestros peleadores
              </Link>
            </div>
          </div>

          <div className="promo-logo flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 bg-ko-red/8 rounded-full blur-3xl" />
              <div className="relative bg-white rounded-2xl px-10 py-8 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <Image
                  src="/images/logos/logo-koboxingpromotions.png"
                  alt="KO Boxing Promotions"
                  width={320}
                  height={200}
                  className="w-52 lg:w-64 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
