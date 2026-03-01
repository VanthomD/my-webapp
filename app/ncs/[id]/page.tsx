import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NcDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const nc = await prisma.nonConformity.findUnique({
    where: { id: params.id },
    include: {
      location: true,
      reportedBy: true,
      owner: true,
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      events: { include: { actor: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!nc) notFound();

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{nc.title}</h1>
          <Link className="text-sm underline" href="/ncs">
            Terug
          </Link>
        </div>

        <div className="mt-3 rounded-xl border p-4 space-y-2">
          <div className="text-sm opacity-80">
            <div><b>Status:</b> {nc.status}</div>
            <div><b>Type:</b> {nc.type}</div>
            <div><b>Severity:</b> {nc.severity}</div>
            <div><b>Locatie:</b> {nc.location.name} ({nc.location.code})</div>
            <div><b>Reporter:</b> {nc.reportedBy.email}</div>
            <div><b>Owner:</b> {nc.owner?.email ?? "—"}</div>
          </div>

          <div className="pt-2">
            <b>Beschrijving</b>
            <p className="mt-1 whitespace-pre-wrap">{nc.description}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-base font-semibold">Timeline</h2>
          <div className="mt-2 space-y-2">
            {nc.events.map((e) => (
              <div key={e.id} className="rounded-xl border p-3 text-sm">
                <div className="opacity-80">
                  {e.createdAt.toISOString()} — <b>{e.action}</b> door{" "}
                  {e.actor.email}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}