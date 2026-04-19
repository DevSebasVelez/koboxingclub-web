export default function ContactMap() {
  return (
    <section className="bg-neutral-50 py-16 border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-6 bg-ko-red" aria-hidden />
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                  Ubicación
                </span>
              </div>
              <h2 className="font-bold text-2xl tracking-tight text-neutral-900">
                Encuéntranos
              </h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-ko-red pl-4 space-y-1">
                <p className="font-semibold text-neutral-900">KO Boxing Club</p>
                <p className="text-sm text-neutral-500">Cuenca, Ecuador</p>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">
                    Lun – Vie
                  </p>
                  <p className="text-sm text-neutral-700">
                    6:00am – 8:00am &amp; 5:30pm – 7:30pm
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">
                    Sábado
                  </p>
                  <p className="text-sm text-neutral-700">8:00am – 11:00am</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">
                    Domingo
                  </p>
                  <p className="text-sm text-neutral-500">Cerrado</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/593982667750"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ko-red hover:bg-ko-red-hover text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              ¿Cómo llegar? Escríbenos
            </a>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm h-96 lg:h-[460px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.740079067044!2d-79.01477328853316!3d-2.8911046394758486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cd19573d811321%3A0x5469546d12112466!2sKO%20BOXING%20CLUB!5e0!3m2!1ses!2sec!4v1776626520879!5m2!1ses!2sec"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="KO Boxing Club ubicación"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
