import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiMapPin, FiCode } from "react-icons/fi";

const NAV = [
  { href: "/club", label: "Club" },
  { href: "/eventos", label: "Eventos" },
  { href: "/peleadores", label: "Peleadores" },
  { href: "/#horarios", label: "Horarios" },
  { href: "/contacto", label: "Contacto" },
];

const SOCIALS = [
  {
    href: "https://www.instagram.com/koboxingclub593/",
    icon: FaInstagram,
    label: "Instagram",
    handle: "@koboxingclub593",
  },
  {
    href: "https://www.facebook.com/koboxingclub593/",
    icon: FaFacebook,
    label: "Facebook",
    handle: "koboxingclub593",
  },
  {
    href: "https://wa.me/593982667750",
    icon: FaWhatsapp,
    label: "WhatsApp",
    handle: "+593 98 266 7750",
  },
  {
    href: "mailto:koboxingclub593@gmail.com",
    icon: FiMail,
    label: "Email",
    handle: "koboxingclub593@gmail.com",
    noBlank: true,
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-black overflow-hidden">

      {/* Decorative "KO" watermark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -right-6 bottom-0 text-[280px] font-black leading-none tracking-tighter text-white/3"
      >
        KO
      </span>

      {/* Top accent — gradient red bar */}
      <div className="h-[3px] bg-linear-to-r from-transparent via-ko-red to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">

        {/* ── Hero strip ───────────────────────────────────── */}
        <div className="py-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 border-b border-white/10">

          {/* Left: logo + tagline + description */}
          <div className="space-y-6 max-w-md">
            <div className="inline-block bg-white rounded-2xl px-5 py-3">
              <Image
                src="/images/logos/logo-koboxingclub.png"
                alt="KO Boxing Club"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-ko-red mb-2">
                Cuenca · Ecuador
              </p>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight leading-tight">
                Entrena.<br />Compite.<br />Gana.
              </h2>
            </div>

            <p className="text-base text-white/60 leading-relaxed">
              Academia de boxeo con entrenamiento técnico, acondicionamiento
              físico y formación deportiva para todos los niveles.
            </p>
          </div>

          {/* Right: social links — card style */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/40 mb-4">
              Redes & Contacto
            </p>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.noBlank ? undefined : "_blank"}
                rel={s.noBlank ? undefined : "noopener noreferrer"}
                className="group flex items-center gap-4 bg-white/4 hover:bg-ko-red/15 border border-white/[0.07] hover:border-ko-red/50 rounded-xl px-4 py-3 transition-all duration-200"
              >
                <span className="w-8 h-8 rounded-lg bg-white/8 group-hover:bg-ko-red flex items-center justify-center text-white/50 group-hover:text-white transition-all duration-200 shrink-0">
                  <s.icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 group-hover:text-ko-red transition-colors leading-none mb-0.5">
                    {s.label}
                  </p>
                  <p className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                    {s.handle}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Main grid ────────────────────────────────────── */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-3 gap-12 border-b border-white/10">

          {/* Navegación */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/40 mb-7">
              Navegación
            </p>
            <ul className="space-y-4">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-base font-medium text-white/65 hover:text-white transition-colors"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-ko-red transition-all duration-200 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ubicación */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/40 mb-7">
              Ubicación
            </p>
            <div className="flex items-start gap-3 text-white/65">
              <FiMapPin size={18} className="shrink-0 mt-0.5 text-ko-red" />
              <div>
                <p className="text-base font-semibold text-white">Cuenca, Ecuador</p>
                <p className="text-sm text-white/50 mt-1 leading-relaxed">
                  Academia de boxeo con enfoque técnico y competitivo
                </p>
              </div>
            </div>
          </div>

          {/* KO Boxing Promotions */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/40 mb-7">
              Divisiones
            </p>
            <div className="space-y-4">
              <div className="inline-block bg-white rounded-xl px-4 py-2.5">
                <Image
                  src="/images/logos/logo-koboxingpromotions.png"
                  alt="KO Boxing Promotions"
                  width={140}
                  height={48}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-sm text-white/55 leading-relaxed">
                División de promoción y<br />organización de eventos de boxeo.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────── */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/45 order-2 sm:order-1">
            © {new Date().getFullYear()} KO Boxing Club · Todos los derechos reservados
          </p>

          {/* VeegSoft badge */}
          <a
            href="https://veegsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group order-1 sm:order-2 flex items-center gap-3 border border-white/15 hover:border-ko-red bg-white/3 hover:bg-ko-red/10 rounded-xl px-5 py-3 transition-all duration-300"
          >
            <span className="w-8 h-8 rounded-lg bg-ko-red flex items-center justify-center shrink-0">
              <FiCode size={15} className="text-white" />
            </span>
            <div className="text-left">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/40 group-hover:text-white/60 transition-colors leading-none mb-0.5">
                Desarrollado por
              </p>
              <p className="text-base font-bold text-white group-hover:text-ko-red transition-colors leading-none">
                VeegSoft
              </p>
            </div>
          </a>
        </div>

      </div>
    </footer>
  );
}
