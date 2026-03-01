import { auth } from "@/auth";

export default async function NcsPage() {
  const session = await auth();
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Non-conformities</h1>
      <p className="mt-2 text-sm opacity-80">
        Ingelogd als: {session?.user?.email}
      </p>
    </main>
  );
}