import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NcsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/signin");
  return <>{children}</>;
}