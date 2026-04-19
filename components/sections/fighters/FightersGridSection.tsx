"use client";

import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiSearch, FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

interface FighterItem {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  photoUrl: string | null;
  wins: number;
  losses: number;
  draws: number;
  winsKo: number;
  cedula: string | null;
  nationality: string | null;
  category: { id: string; name: string; slug: string } | null;
}

function FighterCard({ fighter }: { fighter: FighterItem }) {
  const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`;
  const koPct =
    fighter.wins > 0 ? Math.round((fighter.winsKo / fighter.wins) * 100) : 0;

  return (
    <Link
      href={`/peleadores/${fighter.slug}`}
      className="group block bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:border-ko-red/25 hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-3/4 relative bg-neutral-50 overflow-hidden">
        {fighter.photoUrl ? (
          <Image
            src={fighter.photoUrl}
            alt={`${fighter.firstName} ${fighter.lastName}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <span className="text-4xl font-bold text-neutral-300">
              {fighter.firstName[0]}
              {fighter.lastName[0]}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />

        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between">
          <span className="font-mono text-xl font-bold text-white leading-none">
            {record}
          </span>
          {koPct > 0 && (
            <span className="font-mono text-xs font-bold text-ko-red bg-black/60 px-2 py-1 rounded">
              {koPct}% KO
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-3.5">
        <p className="font-bold text-neutral-900 leading-tight group-hover:text-ko-red transition-colors">
          {fighter.firstName}{" "}
          <span className="tracking-tight">
            {fighter.lastName.toUpperCase()}
          </span>
        </p>
        <div className="flex items-center justify-between mt-1.5">
          {fighter.category ? (
            <span className="text-xs text-neutral-500">
              {fighter.category.name}
            </span>
          ) : (
            <span className="text-xs text-neutral-300 italic">
              Sin categoría
            </span>
          )}
          <FiArrowRight
            size={13}
            className="text-neutral-300 group-hover:text-ko-red transition-colors"
          />
        </div>
      </div>
    </Link>
  );
}

export default function FightersGridSection({
  fighters,
}: {
  fighters: FighterItem[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return fighters;
    return fighters.filter(
      (f) =>
        f.firstName.toLowerCase().includes(q) ||
        f.lastName.toLowerCase().includes(q) ||
        (f.cedula && f.cedula.includes(q)),
    );
  }, [fighters, query]);

  useGSAP(
    () => {
      gsap.from(".fighters-search-bar", {
        autoAlpha: 0,
        y: 20,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });
      gsap.from(".fighter-card", {
        autoAlpha: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: ".fighter-card", start: "top 90%" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="fighters-search-bar relative max-w-md mb-12">
          <FiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o cédula…"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 text-sm focus:outline-none focus:border-ko-red focus:ring-2 focus:ring-ko-red/15 transition-all"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-neutral-400 text-lg">
              {query
                ? `Sin resultados para "${query}"`
                : "No hay peleadores publicados aún."}
            </p>
          </div>
        ) : (
          <>
            {query && (
              <p className="text-sm text-neutral-500 mb-6">
                {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}{" "}
                para{" "}
                <strong className="text-neutral-800">
                  &quot;{query}&quot;
                </strong>
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {filtered.map((fighter) => (
                <div key={fighter.id} className="fighter-card">
                  <FighterCard fighter={fighter} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
