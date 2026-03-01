import { prisma } from "@/lib/prisma";
import { createNc } from "./actions";

export default async function NewNcPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, code: true },
  });

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="text-xl font-semibold">Nieuwe non-conformity</h1>
        <p className="mt-1 text-sm opacity-80">
          Snel registreren (mobielvriendelijk).
        </p>

        <form action={createNc} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Titel</label>
            <input
              name="title"
              required
              className="mt-2 w-full rounded-xl border px-4 py-3"
              placeholder="Bv. Verpakking gescheurd"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Beschrijving</label>
            <textarea
              name="description"
              required
              className="mt-2 w-full rounded-xl border px-4 py-3"
              rows={5}
              placeholder="Wat is er gebeurd? Waar? Welke impact?"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Type</label>
              <select
                name="type"
                defaultValue="QUALITY"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >
                <option value="QUALITY">Quality</option>
                <option value="SAFETY">Safety</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Severity</label>
              <select
                name="severity"
                defaultValue="MEDIUM"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Locatie</label>
            <select
              name="locationId"
              required
              className="mt-2 w-full rounded-xl border px-4 py-3"
              defaultValue=""
            >
              <option value="" disabled>
                Kies een locatie…
              </option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Moment</label>
            <input
              name="happenedAt"
              type="datetime-local"
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
            <p className="mt-1 text-xs opacity-70">
              Leeg laten = nu.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl border px-4 py-3 font-medium"
          >
            Opslaan
          </button>
        </form>
      </div>
    </main>
  );
}