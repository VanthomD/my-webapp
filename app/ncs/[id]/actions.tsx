"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";




async function requireUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/signin");

  return prisma.user.upsert({
    where: { email },
    update: { name: session?.user?.name ?? null },
    create: { email, name: session?.user?.name ?? null },
  });
}

export async function updateNc(id: string, formData: FormData) {
  const actor = await requireUser();

  const status = String(formData.get("status") ?? "");
  const ownerIdRaw = String(formData.get("ownerId") ?? "");
  const ownerId = ownerIdRaw === "" ? null : ownerIdRaw;

  await prisma.nonConformity.update({
    where: { id },
    data: {
      status: status as any,
      ownerId,
      events: {
        create: {
          actorId: actor.id,
          action: "UPDATED",
          detail: { status, ownerId },
        },
      },
    },
  });
    revalidatePath(`/ncs/${id}`);
}

export async function addComment(id: string, formData: FormData) {
  const actor = await requireUser();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.ncComment.create({
    data: {
      ncId: id,
      authorId: actor.id,
      body,
    },
  });

  await prisma.ncEvent.create({
    data: {
      ncId: id,
      actorId: actor.id,
      action: "COMMENTED",
      detail: { length: body.length },
    },
  });
  revalidatePath(`/ncs/${id}`);
  
}

