import type { Metadata } from "next";
import { getPublishedFighters } from "@/lib/queries/public";
import FightersHero from "@/components/sections/fighters/FightersHero";
import FightersGridSection from "@/components/sections/fighters/FightersGridSection";

export const metadata: Metadata = {
  title: "Peleadores | KO Boxing Club",
  description:
    "Directorio de peleadores del KO Boxing Club. Busca por nombre o número de cédula.",
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
