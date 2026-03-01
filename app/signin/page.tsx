import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        action={async (formData) => {
          "use server";
          const email = String(formData.get("email") || "");
          await signIn("email", { email, redirectTo: "/ncs" });
        }}
        className="w-full max-w-sm rounded-2xl border p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Inloggen</h1>
        <p className="mt-2 text-sm opacity-80">
          Vul je e-mailadres in. Je krijgt een magic link.
        </p>

        <label className="mt-6 block text-sm font-medium">E-mail</label>
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-xl border px-4 py-3"
          placeholder="jij@bedrijf.be"
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-xl border px-4 py-3 font-medium"
        >
          Stuur magic link
        </button>
      </form>
    </main>
  );
}