"use server";

import { auth } from "@auth";
import prisma from "@src/lib/prisma";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";

export const DeleteComment = zact(z.object({ id: z.string().cuid() }))(
  async (data) => {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        error: "Unauthorized",
      };
    }
    const comment = await prisma.videoComment.findUnique({
      where: { id: data.id },
    });

    if (comment?.userId !== session.user.id) {
      return {
        error: "You are not authorized.",
      };
    }

    const res = await prisma.videoComment.delete({
      where: {
        id: data.id,
      },
    });

    revalidatePath("/");

    return res;
  }
);

export const createComment = zact(
  z.object({ id: z.string().cuid(), comment: z.string() })
)(async (data) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const res = await prisma.videoComment.create({
    data: {
      comment: data.comment,
      user: { connect: { id: session.user.id } },
      video: { connect: { id: data.id } },
    },
  });

  revalidatePath("/");

  return res;
});
