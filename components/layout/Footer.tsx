import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/eventos", label: "Eventos" },
  { href: "/peleadores", label: "Peleadores" },
  { href: "/#horarios", label: "Horarios" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/8">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-6">
            <Image
              src="/images/logos/logo-koboxingclub.png"
              alt="KO Boxing Club"
              width={160}
              height={56}
              className="h-12 w-auto"
            />
            <p className="text-sm text-white/48 max-w-xs leading-relaxed">
              Escuela de boxeo seria y profesional. Entrena con método,
              exigencia y respeto en un ambiente de club real.
            </p>
            <div className="pt-5 border-t border-white/8 space-y-2">
              <Image
                src="/images/logos/logo-koboxingpromotions.png"
                alt="KO Boxing Promotions"
                width={140}
                height={48}
                className="h-9 w-auto opacity-60"
              />
              <p className="text-xs text-white/30 leading-relaxed">
                División de promoción y eventos de boxeo
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-5">
              Navegación
            </h3>
            <ul className="space-y-3">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/52 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-5">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-white/52">
              <li>Medellín, Colombia</li>
              <li>
                <a
                  href="https://instagram.com/koboxingclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ko-red transition-colors"
                >
                  @koboxingclub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/28">
            © {new Date().getFullYear()} KO Boxing Club. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-white/18">KO Boxing Promotions</p>
        </div>
      </div>
    </footer>
  );
}
