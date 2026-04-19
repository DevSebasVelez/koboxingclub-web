import type { Metadata } from "next";
import ContactHero from "@/components/sections/contact/ContactHero";
import ContactInfo from "@/components/sections/contact/ContactInfo";
import ContactSocial from "@/components/sections/contact/ContactSocial";
import ContactMap from "@/components/sections/contact/ContactMap";
import ContactCTA from "@/components/sections/contact/ContactCTA";

export const metadata: Metadata = {
  title: "Contacto | KO Boxing Club — Cuenca, Ecuador",
  description:
    "Contáctanos por WhatsApp, email o redes sociales. KO Boxing Club, Cuenca Ecuador. Reserva tu primera clase hoy.",
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
