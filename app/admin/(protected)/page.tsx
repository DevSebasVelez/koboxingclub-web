import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Users, CalendarDays, TrendingUp, Eye } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  const [
    totalFighters,
    publishedFighters,
    totalEvents,
    publishedEvents,
    recentFighters,
    upcomingEvents,
  ] = await Promise.all([
    prisma.fighter.count(),
    prisma.fighter.count({ where: { status: "PUBLISHED" } }),
    prisma.event.count(),
    prisma.event.count({ where: { status: "PUBLISHED" } }),
    prisma.fighter.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.event.findMany({
      take: 5,
      orderBy: { date: "asc" },
      where: { date: { gte: new Date() } },
    }),
  ]);

  const stats = [
    {
      label: "Total Peleadores",
      value: totalFighters,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Peleadores Publicados",
      value: publishedFighters,
      icon: Eye,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Total Eventos",
      value: totalEvents,
      icon: CalendarDays,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Eventos Publicados",
      value: publishedEvents,
      icon: TrendingUp,
      color: "text-[#c11737]",
      bg: "bg-[#c11737]/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Bienvenido, {session!.user!.name}
        </h1>
        <p className="text-neutral-400 mt-1 text-sm">
          Panel de administración KO Boxing Club
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-400">{stat.label}</p>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Fighters */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 px-5 py-4">
            <h2 className="font-semibold text-white">Peleadores Recientes</h2>
          </div>
          <div className="divide-y divide-neutral-800">
            {recentFighters.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-neutral-500">
                No hay peleadores aún.
              </p>
            ) : (
              recentFighters.map((fighter) => (
                <div
                  key={fighter.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {fighter.firstName} {fighter.lastName}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {fighter.category?.name ?? "Sin categoría"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      fighter.status === "PUBLISHED"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-neutral-500/15 text-neutral-400"
                    }`}
                  >
                    {fighter.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 px-5 py-4">
            <h2 className="font-semibold text-white">Próximos Eventos</h2>
          </div>
          <div className="divide-y divide-neutral-800">
            {upcomingEvents.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-neutral-500">
                No hay próximos eventos.
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {event.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {format(new Date(event.date), "d MMM yyyy", {
                        locale: es,
                      })}
                      {event.city ? ` · ${event.city}` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      event.status === "PUBLISHED"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-neutral-500/15 text-neutral-400"
                    }`}
                  >
                    {event.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
