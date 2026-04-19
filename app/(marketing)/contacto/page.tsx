import type { Metadata } from "next";
import ContactHero from "@/components/sections/contact/ContactHero";
import ContactInfo from "@/components/sections/contact/ContactInfo";
import ContactSocial from "@/components/sections/contact/ContactSocial";
import ContactMap from "@/components/sections/contact/ContactMap";
import ContactCTA from "@/components/sections/contact/ContactCTA";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos por WhatsApp, email o redes sociales. KO Boxing Club, Cuenca Ecuador. Reserva tu primera clase hoy.",
  openGraph: {
    title: "Contacto | KO Boxing Club",
    description:
      "Contáctanos por WhatsApp o redes sociales. Reserva tu primera clase en KO Boxing Club, Cuenca Ecuador.",
    url: "/contacto",
  },
};

export default function ContactoPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactSocial />
      <ContactMap />
      <ContactCTA />
    </>
  );
}
