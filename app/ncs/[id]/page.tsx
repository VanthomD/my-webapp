import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addComment, updateNc } from "./actions";


export default async function NcDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    select: { id: true, email: true },
    });


  const nc = await prisma.nonConformity.findUnique({
    where: { id },
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
          <div className="text-sm opacity-80 space-y-1">
            <div>
              <b>Status:</b> {nc.status}
            </div>
            <div>
              <b>Type:</b> {nc.type}
            </div>
            <div>
              <b>Severity:</b> {nc.severity}
            </div>
            <div>
              <b>Locatie:</b> {nc.location.name} ({nc.location.code})
            </div>
            <div>
              <b>Reporter:</b> {nc.reportedBy.email}
            </div>
            <div>
              <b>Owner:</b> {nc.owner?.email ?? "—"}
            </div>
          </div>

          <div className="pt-2">
            <b>Beschrijving</b>
            <p className="mt-1 whitespace-pre-wrap">{nc.description}</p>
          </div>
        </div>

        

 <div className="mt-4 rounded-xl border p-4">
  <h2 className="font-semibold">Triage</h2>

  <form action={updateNc.bind(null, nc.id)} className="mt-3 space-y-3">
    <div>
      <label className="block text-sm font-medium">Status</label>
      <select
        name="status"
        defaultValue={nc.status}
        className="mt-2 w-full rounded-xl border px-4 py-3"
      >
        <option value="NEW">NEW</option>
        <option value="TRIAGED">TRIAGED</option>
        <option value="INVESTIGATING">INVESTIGATING</option>
        <option value="CLOSED">CLOSED</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium">Owner</label>
      <select
        name="ownerId"
        defaultValue={nc.ownerId ?? ""}
        className="mt-2 w-full rounded-xl border px-4 py-3"
      >
        <option value="">— geen —</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.email}
          </option>
        ))}
      </select>
    </div>

    <button className="w-full rounded-xl border px-4 py-3 font-medium" type="submit">
      Opslaan
    </button>
  </form>
</div>
<div className="mt-6">
  <h2 className="text-base font-semibold">Comment</h2>

  <form action={addComment.bind(null, nc.id)} className="mt-2 space-y-2">
    <textarea
      name="body"
      className="w-full rounded-xl border px-4 py-3"
      rows={3}
      placeholder="Schrijf een korte comment…"
    />
    <button className="rounded-xl border px-4 py-2 text-sm font-medium" type="submit">
      Post
    </button>
  </form>

  <div className="mt-4 space-y-2">
    {nc.comments.map((c) => (
      <div key={c.id} className="rounded-xl border p-3 text-sm">
        <div className="opacity-70 text-xs">{c.author.email}</div>
        <div className="mt-1 whitespace-pre-wrap">{c.body}</div>
      </div>
    ))}
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