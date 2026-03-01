"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function toDateOrNow(value: FormDataEntryValue | null) {
  const s = typeof value === "string" ? value : "";
  if (!s) return new Date();
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}

export async function createNc(formData: FormData) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/signin");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const locationId = String(formData.get("locationId") ?? "");
  const type = String(formData.get("type") ?? "QUALITY");
  const severity = String(formData.get("severity") ?? "MEDIUM");
  const happenedAt = toDateOrNow(formData.get("happenedAt"));

  if (!title) throw new Error("Title is required");
  if (!description) throw new Error("Description is required");
  if (!locationId) throw new Error("Location is required");

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: session?.user?.name ?? null },
  });

  const nc = await prisma.nonConformity.create({
    data: {
      title,
      description,
      type: type as any,
      severity: severity as any,
      happenedAt,
      location: { connect: { id: locationId } },
      reportedBy: { connect: { id: user.id } },
      events: {
        create: {
          actor: { connect: { id: user.id } },
          action: "CREATED",
          detail: { title, type, severity, locationId },
        },
      },
    },
    select: { id: true },
  });

  redirect(`/ncs/${nc.id}`);
}