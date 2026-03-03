import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NcStatus } from "@prisma/client";

export default async function NcListPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    locationId?: string | string[];
  }>;
}) {
  const sp = await searchParams;

  const statusRaw = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const locationIdRaw = Array.isArray(sp.locationId)
    ? sp.locationId[0]
    : sp.locationId;

  const status =
    statusRaw && Object.values(NcStatus).includes(statusRaw as NcStatus)
      ? (statusRaw as NcStatus)
      : undefined;

  const locationId =
    typeof locationIdRaw === "string" && locationIdRaw.length > 0
      ? locationIdRaw
      : undefined;

  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, code: true },
  });

  const ncs = await prisma.nonConformity.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(locationId ? { locationId } : {}),
    },
    include: { location: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Non-conformities</h1>
          <Link
            className="rounded-xl border px-3 py-2 text-sm font-medium"
            href="/ncs/new"
          >
            + Nieuw
          </Link>
          <Link className="text-sm underline" href="/dashboard">Dashboard</Link>
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <form method="GET" action="/ncs" className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue={status ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >
                <option value="">Alle</option>
                {Object.values(NcStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Locatie</label>
              <select
                name="locationId"
                defaultValue={locationId ?? ""}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >
                <option value="">Alle</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.code})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl border px-4 py-3 font-medium"
            >
              Filter
            </button>
          </form>
        </div>

        <div className="mt-4 space-y-3">
          {ncs.map((nc) => (
            <Link
              key={nc.id}
              href={`/ncs/${nc.id}`}
              className="block rounded-xl border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{nc.title}</div>
                  <div className="text-sm opacity-80">
                    {nc.location.name} ({nc.location.code})
                  </div>
                </div>
                <div className="text-xs rounded-lg border px-2 py-1">
                  {nc.status}
                </div>
              </div>
              <div className="mt-2 text-xs opacity-70">
                {nc.type} · {nc.severity}
              </div>
            </Link>
          ))}

          {ncs.length === 0 && (
            <div className="rounded-xl border p-4 text-sm opacity-80">
              Geen resultaten voor deze filters.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}