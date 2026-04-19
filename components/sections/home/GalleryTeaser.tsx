"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  { src: "/images/gallery/image-1.webp", alt: "KO Boxing Club entrenamiento" },
  { src: "/images/gallery/image-2.jpg", alt: "KO Boxing Club técnica" },
  { src: "/images/gallery/image-3.jpg", alt: "KO Boxing Club ring" },
  { src: "/images/gallery/image-4.jpg", alt: "KO Boxing Club sparring" },
  { src: "/images/gallery/image-5.jpg", alt: "KO Boxing Club boxeo" },
];

export default function GalleryTeaser() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = gsap.utils.toArray<HTMLElement>(
        ".gt-header > *",
        ref.current,
      );
      if (header.length) {
        gsap.fromTo(
          header,
          { autoAlpha: 0, y: 20 },
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

      const imgs = gsap.utils.toArray<HTMLElement>(".gt-img", ref.current);
      if (!imgs.length) return;
      gsap.fromTo(
        imgs,
        { autoAlpha: 0, scale: 0.96 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
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
    <section ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="gt-header flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-ko-red shrink-0" aria-hidden />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                El gimnasio
              </span>
            </div>
            <h2
              className="font-bold tracking-tight text-neutral-900"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              Donde se forja
              <br />
              <span className="text-ko-red">el boxeador.</span>
            </h2>
          </div>
          <Link
            href="/club"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-ko-red transition-colors group shrink-0"
          >
            Ver más
            <FiArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Desktop: editorial grid — portrait left + 2×2 right */}
        <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-3 h-[560px]">
          <div className="gt-img row-span-2 relative rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src={GALLERY_IMAGES[0].src}
              alt={GALLERY_IMAGES[0].alt}
              fill
              className="object-cover object-top transition-transform duration-700 hover:scale-105"
              sizes="33vw"
            />
          </div>
          {GALLERY_IMAGES.slice(1).map((img, i) => (
            <div
              key={i}
              className="gt-img relative rounded-2xl overflow-hidden bg-neutral-100"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
                sizes="33vw"
              />
            </div>
          ))}
        </div>

        {/* Mobile/tablet: 2-col grid, first image full-width */}
        <div className="lg:hidden grid grid-cols-2 gap-3">
          <div className="gt-img col-span-2 relative aspect-video rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src={GALLERY_IMAGES[0].src}
              alt={GALLERY_IMAGES[0].alt}
              fill
              className="object-cover object-top"
              sizes="100vw"
            />
          </div>
          {GALLERY_IMAGES.slice(1).map((img, i) => (
            <div
              key={i}
              className="gt-img relative aspect-square rounded-xl overflow-hidden bg-neutral-100"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top"
                sizes="50vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/club"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-ko-red transition-colors group"
          >
            Ver más fotos
            <FiArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
