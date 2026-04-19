import type { Metadata } from "next";
import ClubHero from "@/components/sections/club/ClubHero";
import ClubStory from "@/components/sections/club/ClubStory";
import FernandoSection from "@/components/sections/club/FernandoSection";
import ClubCTA from "@/components/sections/club/ClubCTA";

export const metadata: Metadata = {
  title: "El Club | KO Boxing Club — Cuenca, Ecuador",
  description:
    "Conoce la historia de KO Boxing Club, a Fernando Palomeque y el método que ha formado boxeadores reales en Cuenca, Ecuador.",
};

export default function ClubPage() {
  return (
    <>
      <ClubHero />
      <ClubStory />
      <FernandoSection />
      <ClubCTA />
    </>
  );
}
