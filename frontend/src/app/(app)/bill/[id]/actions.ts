"use server";

import { auth } from "@auth";
import prisma from "@src/lib/prisma";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";

export const Vote = zact(z.object({ id: z.string().cuid() }))(async (data) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const vote = await prisma.vote.findFirst({
    where: {
      commentId: data.id,
      userId: session.user.id,
    },
  });

  if (!vote) {
    const res = await prisma.vote.create({
      data: {
        comment: { connect: { id: data.id } },
        user: { connect: { id: session.user.id } },
      },
    });

    revalidatePath("/");

    return res;
  }

  if (vote) {
    const res = await prisma.vote.delete({
      where: {
        id: vote.id,
      },
    });

    revalidatePath("/");

    return res;
  }
});

export async function addComment({
  bill_id,
  comment,
  type,
}: {
  bill_id: string;
  comment: string;
  type: any;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const res = await prisma.comment.create({
    data: {
      bill: { connect: { id: bill_id } },
      comment,
      type: type,
      user: { connect: { id: session.user.id } },
    },
  });

  revalidatePath("/");

  return res;
}
