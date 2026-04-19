"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiStar } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const END_METHOD_LABEL: Record<string, string> = {
  KO: "KO",
  TKO: "TKO",
  DECISION: "DEC",
  SPLIT_DECISION: "DEC SP",
  DRAW: "EMPATE",
  DQ: "DQ",
  NO_CONTEST: "NC",
};

interface FighterMini {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  photoUrl: string | null;
  wins: number;
  losses: number;
  draws: number;
  winsKo: number;
}

interface Bout {
  id: string;
  isMainEvent: boolean;
  scheduledRounds: number;
  resultStatus: string;
  winnerFighterId: string | null;
  endMethod: string | null;
  endRound: number | null;
  fighter1: FighterMini;
  fighter2: FighterMini;
  category: { id: string; name: string } | null;
}

function FighterSide({
  fighter,
  isWinner,
  isLoser,
  side,
}: {
  fighter: FighterMini;
  isWinner: boolean;
  isLoser: boolean;
  side: "left" | "right";
}) {
  const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`;
  const isRight = side === "right";

  return (
    <Link
      href={`/peleadores/${fighter.slug}`}
      className={`group flex-1 flex flex-col items-center sm:items-start gap-3 ${
        isRight ? "sm:flex-row-reverse sm:text-right" : "sm:flex-row"
      } min-w-0`}
    >
      <div className="relative shrink-0">
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
            isWinner
              ? "border-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.15)]"
              : isLoser
                ? "border-neutral-200 opacity-50"
                : "border-neutral-100"
          }`}
        >
          {fighter.photoUrl ? (
            <Image
              src={fighter.photoUrl}
              alt={`${fighter.firstName} ${fighter.lastName}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
              <span className="text-xl font-bold text-neutral-400">
                {fighter.firstName[0]}
              </span>
            </div>
          )}
        </div>
        {isWinner && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div
        className={`min-w-0 text-center ${isRight ? "sm:text-right" : "sm:text-left"}`}
      >
        <p
          className={`font-bold text-base sm:text-lg leading-tight transition-colors group-hover:text-ko-red ${
            isLoser ? "text-neutral-400" : "text-neutral-900"
          }`}
        >
          {fighter.firstName}{" "}
          <span className="tracking-tight">
            {fighter.lastName.toUpperCase()}
          </span>
        </p>
        <p
          className={`font-mono text-sm mt-1 ${isLoser ? "text-neutral-400" : "text-neutral-500"}`}
        >
          {record}
          {fighter.winsKo > 0 && (
            <span className={isLoser ? "text-neutral-400" : "text-neutral-700"}>
              {" · "}
              {fighter.winsKo} KO
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

function BoutCard({ bout, index }: { bout: Bout; index: number }) {
  const isCompleted = bout.resultStatus === "COMPLETED";
  const hasWinner = isCompleted && bout.winnerFighterId;
  const isDraw =
    isCompleted &&
    !bout.winnerFighterId &&
    bout.endMethod !== "NO_CONTEST" &&
    bout.endMethod !== "DQ";

  const f1IsWinner = hasWinner && bout.winnerFighterId === bout.fighter1.id;
  const f2IsWinner = hasWinner && bout.winnerFighterId === bout.fighter2.id;

  const resultLabel = isCompleted
    ? [
        bout.endMethod ? END_METHOD_LABEL[bout.endMethod] : null,
        bout.endRound ? `R${bout.endRound}` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        bout.isMainEvent
          ? "border-ko-red/30 bg-white shadow-lg"
          : "border-neutral-100 bg-white"
      }`}
    >
      {bout.isMainEvent && (
        <div className="bg-ko-red px-5 py-2.5 flex items-center gap-2">
          <FiStar size={13} className="text-white" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">
            Pelea estelar
          </span>
        </div>
      )}

      {!bout.isMainEvent && (
        <div className="border-b border-neutral-100 px-5 py-2 flex items-center justify-between">
          <span className="text-xs font-mono text-neutral-400 tracking-widest">
            #{index + 1}
          </span>
          {bout.category && (
            <span className="text-xs font-medium text-neutral-500">
              {bout.category.name}
            </span>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6">
        {bout.isMainEvent && bout.category && (
          <p className="text-center text-xs font-medium text-ko-red/70 mb-4 tracking-widest uppercase">
            {bout.category.name}
          </p>
        )}

        <div className="flex items-center gap-3 sm:gap-6">
          <FighterSide
            fighter={bout.fighter1}
            isWinner={!!f1IsWinner}
            isLoser={!!f2IsWinner}
            side="left"
          />

          <div className="shrink-0 flex flex-col items-center gap-1 min-w-[48px]">
            <span className="text-[11px] font-bold tracking-[0.12em] text-neutral-300">
              VS
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              {bout.scheduledRounds}R
            </span>
          </div>

          <FighterSide
            fighter={bout.fighter2}
            isWinner={!!f2IsWinner}
            isLoser={!!f1IsWinner}
            side="right"
          />
        </div>

        {isCompleted && (resultLabel || isDraw) && (
          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-center gap-2">
            {isDraw ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200">
                EMPATE · {resultLabel}
              </span>
            ) : resultLabel ? (
              <span className="inline-flex items-center gap-1.5 bg-neutral-50 text-neutral-600 text-xs font-bold px-3 py-1.5 rounded-full border border-neutral-200">
                {resultLabel}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartellaSection({ bouts }: { bouts: Bout[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".bout-card", {
        autoAlpha: 0,
        y: 28,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef },
  );

  if (bouts.length === 0) {
    return (
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 text-center">
          <p className="text-neutral-400">
            Los combates de este evento serán anunciados próximamente.
          </p>
        </div>
      </section>
    );
  }

  const mainEvent = bouts.find((b) => b.isMainEvent);
  const undercard = bouts.filter((b) => !b.isMainEvent);

  return (
    <section ref={sectionRef} className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 space-y-4">
        {mainEvent && (
          <div className="bout-card">
            <BoutCard bout={mainEvent} index={0} />
          </div>
        )}

        {undercard.length > 0 && (
          <>
            {mainEvent && (
              <div className="flex items-center gap-4 py-4">
                <span className="flex-1 h-px bg-neutral-200" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-400">
                  Cartelera
                </span>
                <span className="flex-1 h-px bg-neutral-200" />
              </div>
            )}
            {undercard.map((bout, i) => (
              <div key={bout.id} className="bout-card">
                <BoutCard bout={bout} index={i} />
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
