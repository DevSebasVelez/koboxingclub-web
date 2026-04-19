import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

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
  },
  {
    href: "https://www.facebook.com/koboxingclub593/",
    icon: FaFacebook,
    label: "Facebook",
  },
  {
    href: "https://wa.me/593982667750",
    icon: FaWhatsapp,
    label: "WhatsApp",
  },
  {
    href: "mailto:koboxingclub593@gmail.com",
    icon: FiMail,
    label: "Email",
    noBlank: true,
  },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/8">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-block bg-white rounded-xl px-5 py-3">
              <Image
                src="/images/logos/logo-koboxingclub.png"
                alt="KO Boxing Club"
                width={160}
                height={56}
                className="h-10 w-auto"
              />
            </div>

            <p className="text-sm text-white/45 max-w-xs leading-relaxed">
              Academia de boxeo en Cuenca, Ecuador. Entrenamiento técnico,
              acondicionamiento físico y formación deportiva para todos los
              niveles.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.noBlank ? undefined : "_blank"}
                  rel={s.noBlank ? undefined : "noopener noreferrer"}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/6 hover:bg-ko-red flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>

            {/* KO Boxing Promotions sub-brand */}
            <div className="pt-4 border-t border-white/8 space-y-3">
              <div className="inline-block bg-white rounded-xl px-4 py-2.5">
                <Image
                  src="/images/logos/logo-koboxingpromotions.png"
                  alt="KO Boxing Promotions"
                  width={140}
                  height={48}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-xs text-white/28 leading-relaxed">
                División de promoción y eventos de boxeo
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-5">
              Navegación
            </h3>
            <ul className="space-y-3">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-5">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="text-white/30">Cuenca, Ecuador</li>
              <li>
                <a
                  href="https://wa.me/593982667750"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ko-red transition-colors inline-flex items-center gap-2"
                >
                  <FaWhatsapp size={13} className="shrink-0" />
                  +593 98 266 7750
                </a>
              </li>
              <li>
                <a
                  href="mailto:koboxingclub593@gmail.com"
                  className="hover:text-ko-red transition-colors inline-flex items-center gap-2"
                >
                  <FiMail size={13} className="shrink-0" />
                  koboxingclub593@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/koboxingclub593/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ko-red transition-colors inline-flex items-center gap-2"
                >
                  <FaInstagram size={13} className="shrink-0" />
                  @koboxingclub593
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/koboxingclub593/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ko-red transition-colors inline-flex items-center gap-2"
                >
                  <FaFacebook size={13} className="shrink-0" />
                  koboxingclub593
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} KO Boxing Club. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/18">KO Boxing Promotions</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
