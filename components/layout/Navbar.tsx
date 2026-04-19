"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const NAV_LINKS = [
  { href: "/eventos", label: "Eventos" },
  { href: "/peleadores", label: "Peleadores" },
  { href: "/#horarios", label: "Horarios" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href.startsWith("/#")
      ? false
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/92 backdrop-blur-md border-b border-white/8">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="flex h-16 items-center justify-between gap-8">
          <Link
            href="/"
            className="shrink-0"
            aria-label="KO Boxing Club - Inicio"
          >
            <Image
              src="/images/logos/logo-koboxingclub.png"
              alt="KO Boxing Club"
              width={140}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-[0.04em] transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/58 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/#contacto"
              className="inline-flex items-center bg-ko-red hover:bg-ko-red-hover text-white text-sm font-semibold tracking-wide px-5 py-2.5 rounded-lg transition-colors"
            >
              Reservar clase
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-white"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="md:hidden bg-black/98 border-t border-white/8 px-6 py-4 flex flex-col gap-0.5"
          aria-label="Navegación móvil"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 text-sm font-medium text-white/65 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contacto"
            className="mt-3 py-3 text-center bg-ko-red text-white text-sm font-semibold rounded-lg"
            onClick={() => setOpen(false)}
          >
            Reservar clase
          </Link>
        </nav>
      )}
    </header>
  );
}
