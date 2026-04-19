import HeroSection from "@/components/sections/home/HeroSection";
import StatsStrip from "@/components/sections/home/StatsStrip";
import ProgramSection from "@/components/sections/home/ProgramSection";
import GalleryTeaser from "@/components/sections/home/GalleryTeaser";
import CoachTeaser from "@/components/sections/home/CoachTeaser";
import ScheduleSection from "@/components/sections/home/ScheduleSection";
import PromotionsTeaser from "@/components/sections/home/PromotionsTeaser";
import VideoSection from "@/components/sections/home/VideoSection";
import ContactSection from "@/components/sections/home/ContactSection";

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
