import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedFighterBySlug } from "@/lib/queries/public";
import FighterProfileHero from "@/components/sections/fighters/FighterProfileHero";
import FighterHistorySection from "@/components/sections/fighters/FighterHistorySection";

type BoutResult = "WIN" | "LOSS" | "DRAW" | "NC" | "PENDING";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = await getPublishedFighterBySlug(slug);
  if (!f) return { title: "Peleador no encontrado" };
  const record = `${f.wins}-${f.losses}-${f.draws}`;
  return {
    title: `${f.firstName} ${f.lastName} (${record}) | KO Boxing Club`,
    description: `Perfil de ${f.firstName} ${f.lastName} — ${record}, ${f.winsKo} victorias por KO.`,
  };
}

function normalizeBouts(
  fighter: NonNullable<Awaited<ReturnType<typeof getPublishedFighterBySlug>>>,
) {
  type NB = {
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
  };

  const asF1 = fighter.boutsFighter1.map((b): NB => {
    const opp = b.fighter2;
    let result: BoutResult = "PENDING";
    if (b.resultStatus === "COMPLETED") {
      if (b.winnerFighterId === fighter.id) result = "WIN";
      else if (b.winnerFighterId === opp.id) result = "LOSS";
      else result = "DRAW";
    } else if (
      b.resultStatus === "NO_CONTEST" ||
      b.resultStatus === "CANCELLED"
    ) {
      result = "NC";
    }
    return {
      id: b.id,
      result,
      opponentName: `${opp.firstName} ${opp.lastName}`,
      opponentSlug: opp.slug,
      eventName: b.event.name,
      eventSlug: b.event.slug,
      eventDate: b.event.date,
      eventCity: b.event.city,
      category: b.category?.name ?? null,
      endMethod: b.endMethod,
      endRound: b.endRound,
      resultStatus: b.resultStatus,
      scheduledRounds: b.scheduledRounds,
      isMainEvent: b.isMainEvent,
    };
  });

  const asF2 = fighter.boutsFighter2.map((b): NB => {
    const opp = b.fighter1;
    let result: BoutResult = "PENDING";
    if (b.resultStatus === "COMPLETED") {
      if (b.winnerFighterId === fighter.id) result = "WIN";
      else if (b.winnerFighterId === opp.id) result = "LOSS";
      else result = "DRAW";
    } else if (
      b.resultStatus === "NO_CONTEST" ||
      b.resultStatus === "CANCELLED"
    ) {
      result = "NC";
    }
    return {
      id: b.id,
      result,
      opponentName: `${opp.firstName} ${opp.lastName}`,
      opponentSlug: opp.slug,
      eventName: b.event.name,
      eventSlug: b.event.slug,
      eventDate: b.event.date,
      eventCity: b.event.city,
      category: b.category?.name ?? null,
      endMethod: b.endMethod,
      endRound: b.endRound,
      resultStatus: b.resultStatus,
      scheduledRounds: b.scheduledRounds,
      isMainEvent: b.isMainEvent,
    };
  });

  return [...asF1, ...asF2].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
  );
}

export default async function PeleadorPage({ params }: Props) {
  const { slug } = await params;
  const fighter = await getPublishedFighterBySlug(slug);
  if (!fighter) notFound();

  const bouts = normalizeBouts(fighter);

  return (
    <>
      <FighterProfileHero
        firstName={fighter.firstName}
        lastName={fighter.lastName}
        photoUrl={fighter.photoUrl}
        wins={fighter.wins}
        losses={fighter.losses}
        draws={fighter.draws}
        winsKo={fighter.winsKo}
        lossesKo={fighter.lossesKo}
        rounds={fighter.rounds}
        category={fighter.category}
        nationality={fighter.nationality}
        residence={fighter.residence}
        club={fighter.club}
        debut={fighter.debut}
        birthDate={fighter.birthDate}
      />
      <FighterHistorySection
        bouts={bouts}
        fighterName={`${fighter.firstName} ${fighter.lastName}`}
      />
    </>
  );
}
