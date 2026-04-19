import type { Metadata } from "next";
import ClubHero from "@/components/sections/club/ClubHero";
import ClubStory from "@/components/sections/club/ClubStory";
import ClubGallery from "@/components/sections/club/ClubGallery";
import FernandoSection from "@/components/sections/club/FernandoSection";
import ClubCTA from "@/components/sections/club/ClubCTA";

export const metadata: Metadata = {
  title: "El Club",
  description:
    "Conoce la historia de KO Boxing Club, a Fernando Palomeque y el método que ha formado boxeadores reales en Cuenca, Ecuador.",
  openGraph: {
    title: "El Club | KO Boxing Club",
    description:
      "Conoce a Fernando Palomeque y el método que ha formado boxeadores reales en Cuenca, Ecuador.",
    url: "/club",
    images: [
      {
        url: "/images/gallery/image-2.jpg",
        width: 1080,
        height: 1080,
        alt: "Fernando Palomeque — KO Boxing Club",
      },
    ],
  },
};

export default function ClubPage() {
  return (
    <>
      <ClubHero />
      <ClubStory />
      <ClubGallery />
      <FernandoSection />
      <ClubCTA />
    </>
  );
}
