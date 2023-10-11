"use server";

import { auth } from "@auth";
import {
  hasDurationPassedSinceCreation,
  twoWeeksInMilliseconds,
} from "@src/helper/utils";
import prisma from "@src/lib/prisma";
import { NoteSchema } from "@src/schema/note";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";

export const createNote = zact(NoteSchema)(async (data) => {
  const session = await auth();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  if (
    !hasDurationPassedSinceCreation(
      session.user.createdAt,
      twoWeeksInMilliseconds
    )
  ) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, end, start, text } = data;

  if (end < start) {
    return {
      error: "終了時間が開始時間以下です。",
    };
  }

  const res = await prisma.note.create({
    data: {
      end,
      meeting: {
        connect: {
          id: id,
        },
      },
      start,
      text,
    },
  });

  revalidatePath("/");

  return res;
});

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
