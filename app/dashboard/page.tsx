import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NcStatus } from "@prisma/client";

export default async function DashboardPage() {
  // 1) Aantallen per status (alle NCs)
  const byStatus = await prisma.nonConformity.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  // 2) Open NCs per locatie (exclude CLOSED)
 const openByLocationRaw = await prisma.nonConformity.groupBy({
  by: ["locationId"],
  where: { status: { not: NcStatus.CLOSED } },
  _count: { _all: true },
});

// sorteer in JS (desc)
const openByLocation = openByLocationRaw.sort(
  (a, b) => b._count._all - a._count._all
);

  const locations = await prisma.location.findMany({
    select: { id: true, name: true, code: true },
  });

  const locMap = new Map(locations.map((l) => [l.id, l]));

  // 3) Laatste NCs
  const latest = await prisma.nonConformity.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { location: true },
  });

  const statusCount = (s: NcStatus) =>
    byStatus.find((x) => x.status === s)?._count._all ?? 0;

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Link className="rounded-xl border px-3 py-2 text-sm font-medium" href="/ncs">
            Naar NC’s
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi title="NEW" value={statusCount(NcStatus.NEW)} href="/ncs?status=NEW" />
          <Kpi title="TRIAGED" value={statusCount(NcStatus.TRIAGED)} href="/ncs?status=TRIAGED" />
          <Kpi title="INVESTIGATING" value={statusCount(NcStatus.INVESTIGATING)} href="/ncs?status=INVESTIGATING" />
          <Kpi title="CLOSED" value={statusCount(NcStatus.CLOSED)} href="/ncs?status=CLOSED" />
        </div>

        {/* Open per location */}
        <section className="rounded-2xl border p-4">
          <h2 className="text-base font-semibold">Open NC’s per locatie</h2>
          <div className="mt-3 space-y-2">
            {openByLocation.length === 0 && (
              <div className="text-sm opacity-80">Geen open NC’s.</div>
            )}
            {openByLocation.map((row) => {
              const loc = locMap.get(row.locationId);
              return (
                <Link
                  key={row.locationId}
                  href={`/ncs?locationId=${row.locationId}`}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="text-sm">
                    {loc ? `${loc.name} (${loc.code})` : row.locationId}
                  </div>
                  <div className="text-sm font-medium">{row._count._all}</div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Latest */}
        <section className="rounded-2xl border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Laatste 10 NC’s</h2>
            <Link className="text-sm underline" href="/ncs/new">
              + Nieuw
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {latest.map((nc) => (
              <Link
                key={nc.id}
                href={`/ncs/${nc.id}`}
                className="block rounded-xl border p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{nc.title}</div>
                    <div className="text-sm opacity-80">
                      {nc.location.name} ({nc.location.code})
                    </div>
                  </div>
                  <div className="text-xs rounded-lg border px-2 py-1">{nc.status}</div>
                </div>
                <div className="mt-1 text-xs opacity-70">
                  {nc.type} · {nc.severity}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Kpi({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border p-4 block">
      <div className="text-xs opacity-70">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs underline opacity-80">Bekijk</div>
    </Link>
  );
}