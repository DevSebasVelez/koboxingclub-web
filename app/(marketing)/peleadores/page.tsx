import type { Metadata } from "next";
import { getPublishedFighters } from "@/lib/queries/public";
import FightersHero from "@/components/sections/fighters/FightersHero";
import FightersGridSection from "@/components/sections/fighters/FightersGridSection";

export const metadata: Metadata = {
  title: "Peleadores",
  description:
    "Directorio de peleadores de KO Boxing Club. Récords, historial de combates y categorías. Busca por nombre o cédula.",
  openGraph: {
    title: "Peleadores | KO Boxing Club",
    description:
      "Directorio de peleadores de KO Boxing Club con récords e historial de combates.",
    url: "/peleadores",
  },
};

export default async function PeleadoresPage() {
  const fighters = await getPublishedFighters();
  return (
    <>
      <FightersHero />
      <FightersGridSection fighters={fighters} />
    </>
  );
}
