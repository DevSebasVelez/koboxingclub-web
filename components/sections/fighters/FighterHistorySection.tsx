"use client";

import { useRef } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const END_METHOD_SHORT: Record<string, string> = {
  KO: "KO",
  TKO: "TKO",
  DECISION: "DEC",
  SPLIT_DECISION: "SP DEC",
  DRAW: "EMP",
  DQ: "DQ",
  NO_CONTEST: "NC",
};

type BoutResult = "WIN" | "LOSS" | "DRAW" | "NC" | "PENDING";

interface NormalizedBout {
  id: string;
  result: BoutResult;
  opponentName: string;
  opponentSlug: string;
  eventName: string;
  eventSlug: string;
  eventDate: Date;
  eventCity: string | null;
  category: string | null;
  endMethod: string | null;
  endRound: number | null;
  resultStatus: string;
  scheduledRounds: number;
  isMainEvent: boolean;
}

function ResultBadge({ result }: { result: BoutResult }) {
  const config: Record<BoutResult, { label: string; cls: string }> = {
    WIN: {
      label: "W",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    LOSS: { label: "L", cls: "bg-red-50 text-red-600 border-red-200" },
    DRAW: { label: "D", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    NC: {
      label: "NC",
      cls: "bg-neutral-100 text-neutral-500 border-neutral-200",
    },
    PENDING: {
      label: "–",
      cls: "bg-neutral-50 text-neutral-400 border-neutral-200",
    },
  };
  const c = config[result];
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full border font-bold text-xs ${c.cls}`}
    >
      {c.label}
    </span>
  );
}

export default function FighterHistorySection({
  bouts,
}: {
  bouts: NormalizedBout[];
  fighterName: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = gsap.utils.toArray<HTMLElement>(
        ".hist-title",
        sectionRef.current,
      );
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
              trigger: sectionRef.current,
              start: "top bottom",
              once: true,
            },
          },
        );
      }
      const rows = gsap.utils.toArray<HTMLElement>(
        ".hist-row",
        sectionRef.current,
      );
      if (!rows.length) return;
      gsap.fromTo(
        rows,
        { autoAlpha: 0, x: -16 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  if (bouts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="bg-neutral-50 py-16 border-t border-neutral-100"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="hist-title flex items-center gap-4 mb-10">
          <span className="h-px w-8 bg-ko-red shrink-0" />
          <h2 className="font-bold text-2xl tracking-tight text-neutral-900">
            Historial de combates
          </h2>
          <span className="ml-auto font-mono text-sm text-neutral-400">
            {bouts.length} pelea{bouts.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1.5 min-w-[600px]">
            <thead>
              <tr>
                {[
                  "Res.",
                  "Oponente",
                  "Evento",
                  "Fecha",
                  "Categoría",
                  "Método",
                  "Rnd",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bouts.map((bout) => (
                <tr key={bout.id} className="hist-row group">
                  <td className="px-3 py-3 bg-white rounded-l-xl">
                    <ResultBadge result={bout.result} />
                  </td>
                  <td className="px-3 py-3 bg-white font-semibold text-neutral-900">
                    <Link
                      href={`/peleadores/${bout.opponentSlug}`}
                      className="hover:text-ko-red transition-colors"
                    >
                      {bout.opponentName}
                    </Link>
                  </td>
                  <td className="px-3 py-3 bg-white text-neutral-600 max-w-[160px]">
                    <Link
                      href={`/eventos/${bout.eventSlug}`}
                      className="hover:text-ko-red transition-colors line-clamp-1 block"
                    >
                      {bout.isMainEvent && (
                        <span className="inline-block mr-1.5 text-[9px] font-bold uppercase tracking-widest text-ko-red bg-ko-red/8 px-1.5 py-0.5 rounded">
                          Main
                        </span>
                      )}
                      {bout.eventName}
                    </Link>
                  </td>
                  <td className="px-3 py-3 bg-white text-neutral-500 whitespace-nowrap">
                    {format(new Date(bout.eventDate), "d MMM yyyy", {
                      locale: es,
                    })}
                  </td>
                  <td className="px-3 py-3 bg-white text-neutral-500">
                    {bout.category ?? (
                      <span className="text-neutral-300">–</span>
                    )}
                  </td>
                  <td className="px-3 py-3 bg-white">
                    {bout.resultStatus === "COMPLETED" && bout.endMethod ? (
                      <span
                        className={`font-mono text-xs font-bold ${
                          bout.result === "WIN"
                            ? "text-emerald-600"
                            : bout.result === "LOSS"
                              ? "text-red-500"
                              : "text-neutral-500"
                        }`}
                      >
                        {END_METHOD_SHORT[bout.endMethod] ?? bout.endMethod}
                      </span>
                    ) : (
                      <span className="text-neutral-300">–</span>
                    )}
                  </td>
                  <td className="px-3 py-3 bg-white rounded-r-xl text-neutral-500 font-mono text-xs">
                    {bout.resultStatus === "COMPLETED" && bout.endRound
                      ? `R${bout.endRound}`
                      : `${bout.scheduledRounds}R`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
