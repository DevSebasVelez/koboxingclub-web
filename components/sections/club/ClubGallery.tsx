"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  "/images/gallery/image-1.webp",
  "/images/gallery/image-2.jpg",
  "/images/gallery/image-3.jpg",
  "/images/gallery/image-4.jpg",
  "/images/gallery/image-5.jpg",
  "/images/gallery/image-6.jpg",
  "/images/gallery/image-7.jpg",
  "/images/gallery/image-8.jpg",
  "/images/gallery/image-9.jpg",
  "/images/gallery/image-10.jpg",
  "/images/gallery/image-11.jpg",
  "/images/gallery/image-12.jpg",
  "/images/gallery/image-13.jpg",
  "/images/gallery/image-14.jpg",
  "/images/gallery/image-15.jpg",
  "/images/gallery/image-16.jpg",
];

export default function ClubGallery() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = gsap.utils.toArray<HTMLElement>(".cg-title", ref.current);
      if (title.length) {
        gsap.fromTo(
          title,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              once: true,
            },
          },
        );
      }

      const items = gsap.utils.toArray<HTMLElement>(".cg-item", ref.current);
      if (!items.length) return;
      gsap.fromTo(
        items,
        { autoAlpha: 0, scale: 0.97 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.04,
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
      className="bg-neutral-50 py-20 border-t border-neutral-100"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="cg-title flex items-center gap-4 mb-10">
          <span className="h-px w-8 bg-ko-red shrink-0" aria-hidden />
          <h2 className="font-bold text-2xl tracking-tight text-neutral-900">
            El gimnasio en imágenes
          </h2>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 *:mb-3">
          {IMAGES.map((src, i) => (
            <div
              key={i}
              className="cg-item break-inside-avoid relative rounded-xl overflow-hidden group bg-neutral-200"
            >
              <Image
                src={src}
                alt={`KO Boxing Club — foto ${i + 1}`}
                width={600}
                height={800}
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
