import type { Metadata } from "next";
import HeroSection from "@/components/sections/home/HeroSection";
import StatsStrip from "@/components/sections/home/StatsStrip";
import ProgramSection from "@/components/sections/home/ProgramSection";
import GalleryTeaser from "@/components/sections/home/GalleryTeaser";
import CoachTeaser from "@/components/sections/home/CoachTeaser";
import ScheduleSection from "@/components/sections/home/ScheduleSection";
import PromotionsTeaser from "@/components/sections/home/PromotionsTeaser";
import VideoSection from "@/components/sections/home/VideoSection";
import ContactSection from "@/components/sections/home/ContactSection";

export const metadata: Metadata = {
  title: {
    absolute: "KO Boxing Club — Boxeo en Cuenca, Ecuador",
  },
  description:
    "Entrena boxeo real con Fernando Palomeque en Cuenca, Ecuador. Técnica de ring para todos los niveles. KO Boxing Club & KO Boxing Promotions.",
  openGraph: {
    title: "KO Boxing Club — Boxeo en Cuenca, Ecuador",
    description:
      "Entrena boxeo real con Fernando Palomeque en Cuenca, Ecuador. Técnica de ring para todos los niveles.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <ProgramSection />
      <GalleryTeaser />
      <CoachTeaser />
      <ScheduleSection />
      <PromotionsTeaser />
      <VideoSection />
      <ContactSection />
    </>
  );
}
