import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function NcsPage() {
  const ncs = await prisma.nonConformity.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { location: true },
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
              Nog geen non-conformities. Klik op <b>Nieuw</b> om te starten.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}