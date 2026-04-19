"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";

gsap.registerPlugin();

interface FighterProfileHeroProps {
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  wins: number;
  losses: number;
  draws: number;
  winsKo: number;
  lossesKo: number;
  rounds: number;
  category: { name: string } | null;
  nationality: string | null;
  residence: string | null;
  club: string | null;
  debut: Date | null;
  birthDate: Date | null;
}

export default function FighterProfileHero({
  firstName,
  lastName,
  photoUrl,
  wins,
  losses,
  draws,
  winsKo,
  rounds,
  category,
  nationality,
  residence,
  club,
  debut,
  birthDate,
}: FighterProfileHeroProps) {
  const root = useRef<HTMLElement>(null);

  const koPct = wins > 0 ? Math.round((winsKo / wins) * 100) : 0;

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".fph-back",
        { autoAlpha: 0, x: -12 },
        { autoAlpha: 1, x: 0, duration: 0.4 },
        0,
      )
        .fromTo(
          ".fph-photo",
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 1, scale: 1, duration: 0.75, ease: "power2.out" },
          0.05,
        )
        .fromTo(
          ".fph-tag",
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, duration: 0.45 },
          0.18,
        )
        .fromTo(
          ".fph-name",
          { autoAlpha: 0, yPercent: 80 },
          { autoAlpha: 1, yPercent: 0, duration: 0.65, stagger: 0.06 },
          0.25,
        )
        .fromTo(
          ".fph-record",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          0.44,
        )
        .fromTo(
          ".fph-stat",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07 },
          0.52,
        )
        .fromTo(
          ".fph-meta",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05 },
          0.6,
        );
    },
    { scope: root },
  );

  const stats = [
    { label: "Victorias", value: wins, accent: true },
    { label: "KO / TKO", value: winsKo, accent: true },
    { label: "Derrotas", value: losses },
    { label: "Empates", value: draws },
    ...(rounds > 0 ? [{ label: "Rounds", value: rounds, accent: false }] : []),
    ...(koPct > 0 ? [{ label: "KO%", value: `${koPct}%`, accent: false }] : []),
  ];

  return (
    <section
      ref={root}
      className="relative bg-black text-white overflow-hidden"
    >
      <div
        className="absolute left-0 inset-y-0 w-[3px] bg-ko-red"
        aria-hidden
      />

      {photoUrl && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(32px)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 pt-32 pb-16">
        <Link
          href="/peleadores"
          className="fph-back inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-10"
        >
          <FiArrowLeft size={14} />
          Todos los peleadores
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <div className="fph-tag mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-ko-red" aria-hidden />
              {category ? (
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-ko-red">
                  {category.name}
                </span>
              ) : (
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                  KO Boxing Club
                </span>
              )}
            </div>

            <h1 className="mb-6">
              <div className="overflow-hidden">
                <span
                  className="fph-name block font-bold text-white leading-[0.9]"
                  style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
                >
                  {firstName}
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  className="fph-name block font-bold text-white leading-[0.9] tracking-tight"
                  style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
                >
                  {lastName.toUpperCase()}
                </span>
              </div>
            </h1>

            <div className="fph-record mb-8 flex items-baseline gap-2">
              <span
                className="font-mono font-bold text-white"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              >
                {wins}-{losses}-{draws}
              </span>
              <span className="font-mono text-sm text-white/40">W-L-D</span>
              {winsKo > 0 && (
                <span className="ml-3 font-mono text-sm font-bold text-ko-red bg-ko-red/10 px-2.5 py-1 rounded">
                  {winsKo} KO
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="fph-stat border border-white/10 rounded-xl p-3 text-center"
                >
                  <p
                    className={`font-mono font-bold text-2xl leading-none ${
                      s.accent ? "text-ko-red" : "text-white"
                    }`}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] font-medium tracking-widest text-white/40 mt-1.5 uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {nationality && (
                <div className="fph-meta flex items-center gap-2 text-sm text-white/50">
                  <span className="text-white/30">Nac.</span>
                  <span>{nationality}</span>
                </div>
              )}
              {residence && (
                <div className="fph-meta flex items-center gap-2 text-sm text-white/50">
                  <FiMapPin size={13} className="text-white/30" />
                  <span>{residence}</span>
                </div>
              )}
              {club && club !== "KO Boxing Club" && (
                <div className="fph-meta flex items-center gap-2 text-sm text-white/50">
                  <span className="text-white/30">Club</span>
                  <span>{club}</span>
                </div>
              )}
              {debut && (
                <div className="fph-meta flex items-center gap-2 text-sm text-white/50">
                  <span className="text-white/30">Debut</span>
                  <span>{format(new Date(debut), "yyyy", { locale: es })}</span>
                </div>
              )}
              {birthDate && (
                <div className="fph-meta flex items-center gap-2 text-sm text-white/50">
                  <span className="text-white/30">Nacimiento</span>
                  <span>
                    {format(new Date(birthDate), "d MMM yyyy", { locale: es })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {photoUrl && (
            <div className="order-first lg:order-last flex justify-center lg:justify-end">
              <div className="fph-photo relative w-64 sm:w-80 lg:w-full lg:max-w-xs aspect-3/4 rounded-2xl overflow-hidden">
                <Image
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 320px, 360px"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
