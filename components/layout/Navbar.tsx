"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";

const NAV_LINKS = [
  { href: "/club", label: "Club" },
  { href: "/eventos", label: "Eventos" },
  { href: "/peleadores", label: "Peleadores" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [openAtPath, setOpenAtPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const open = openAtPath === pathname;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        headerRef.current,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.75, ease: "power3.out", delay: 0.15 },
      );
      gsap.fromTo(
        ".nav-link",
        { autoAlpha: 0, y: -6 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.45,
        },
      );
      gsap.fromTo(
        ".nav-cta",
        { autoAlpha: 0, scale: 0.92 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.4)",
          delay: 0.7,
        },
      );
    },
    { scope: headerRef },
  );

  useGSAP(
    () => {
      const el = overlayRef.current;
      if (!el) return;

      if (open) {
        gsap.set(el, { display: "flex" });
        const links = el.querySelectorAll<HTMLElement>(".mob-link");
        const ctas = el.querySelectorAll<HTMLElement>(".mob-cta");
        const footer = el.querySelector<HTMLElement>(".mob-footer");

        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: 0.22, ease: "power2.out" },
        );
        gsap.fromTo(
          links,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.07,
            ease: "power3.out",
            delay: 0.08,
          },
        );
        gsap.fromTo(
          ctas,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.06,
            ease: "power3.out",
            delay: 0.28,
          },
        );
        if (footer) {
          gsap.fromTo(
            footer,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power2.out", delay: 0.38 },
          );
        }
      } else {
        gsap.to(el, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => gsap.set(el, { display: "none" }),
        });
      }
    },
    { dependencies: [open] },
  );

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-md border-b border-white/8 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="shrink-0 flex items-center relative z-10"
              aria-label="KO Boxing Club"
            >
              <Image
                src="/images/logos/logo-koboxingclub.png"
                alt="KO Boxing Club"
                width={130}
                height={44}
                className="h-9 w-auto"
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
                  className="nav-link group relative pb-0.5"
                >
                  <span
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                      isActive(link.href)
                        ? "text-white"
                        : "text-white/55 group-hover:text-white"
                    }`}
                  >
                    {link.label}
                  </span>
                  <span
                    className={`absolute -bottom-px left-0 h-px bg-ko-red transition-all duration-300 ${
                      isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://wa.me/593982667750"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link text-sm text-white/50 hover:text-white transition-colors font-medium"
              >
                WhatsApp
              </a>
              <Link
                href="/contacto"
                className="nav-cta inline-flex items-center gap-2 bg-ko-red hover:bg-ko-red-hover text-white text-sm font-semibold tracking-wide px-5 py-2.5 rounded-lg transition-colors"
              >
                Reservar clase
              </Link>
            </div>

            <button
              onClick={() => setOpenAtPath(open ? null : pathname)}
              className="md:hidden relative z-10 flex items-center justify-center w-9 h-9 text-white"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              <span
                className="transition-all duration-200"
                style={{ display: open ? "none" : "block" }}
              >
                <FiMenu size={21} />
              </span>
              <span
                className="transition-all duration-200"
                style={{ display: open ? "block" : "none" }}
              >
                <FiX size={21} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 md:hidden flex-col bg-neutral-950"
        style={{ display: "none" }}
        aria-hidden={!open}
      >
        {/* Subtle red accent line at top */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] bg-ko-red"
          aria-hidden
        />

        <div className="flex flex-col h-full px-8 pt-20 pb-8">
          {/* Nav links */}
          <nav
            className="flex-1 flex flex-col justify-center"
            aria-label="Navegación móvil"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mob-link group flex items-center justify-between py-5 border-b border-white/6 last:border-0 ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/35 hover:text-white"
                } transition-colors duration-150`}
                onClick={() => setOpenAtPath(null)}
              >
                <span
                  className="font-bold tracking-tight leading-none"
                  style={{ fontSize: "clamp(1.75rem, 7vw, 2.25rem)" }}
                >
                  {link.label}
                </span>
                <div className="flex items-center gap-2.5">
                  {isActive(link.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-ko-red" />
                  )}
                  <FiArrowRight
                    size={17}
                    className={`transition-all duration-200 ${
                      isActive(link.href)
                        ? "text-ko-red"
                        : "text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="pt-8 space-y-3">
            <Link
              href="/contacto"
              className="mob-cta flex items-center justify-center gap-2 w-full h-13 bg-ko-red hover:bg-ko-red-hover text-white text-sm font-semibold rounded-xl transition-colors"
              onClick={() => setOpenAtPath(null)}
            >
              Reservar clase
              <FiArrowRight size={14} />
            </Link>
            <a
              href="https://wa.me/593982667750"
              target="_blank"
              rel="noopener noreferrer"
              className="mob-cta flex items-center justify-center w-full h-12 border border-white/12 text-white/50 text-sm font-medium rounded-xl hover:border-white/25 hover:text-white/80 transition-all"
              onClick={() => setOpenAtPath(null)}
            >
              WhatsApp · +593 98 266 7750
            </a>
          </div>

          {/* Footer branding */}
          <div className="mob-footer pt-6 mt-2 border-t border-white/6">
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/18">
              KO Boxing Club — Cuenca, Ecuador
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
