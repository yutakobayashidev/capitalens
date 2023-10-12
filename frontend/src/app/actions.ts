"use server";

import { auth } from "@auth";
import { config } from "@site.config";
import {
  hasDurationPassedSinceCreation,
  hiraToKana,
  twoWeeksInMilliseconds,
} from "@src/helper/utils";
import prisma from "@src/lib/prisma";
import { MemberSchema } from "@src/schema/member";
import { NoteSchema } from "@src/schema/note";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";

export const updateMember = zact(MemberSchema)(async (data) => {
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

  const {
    id,
    name,
    description,
    firstName,
    firstNameHira,
    groupId,
    house,
    lastName,
    lastNameHira,
    twitter,
    website,
  } = data;

  const fullname = firstName && lastName ? firstName + lastName : null;
  const nameHira =
    firstNameHira && lastNameHira ? firstNameHira + lastNameHira : null;
  const nameKana = hiraToKana(nameHira);
  const firstNameKana = hiraToKana(firstNameHira);
  const lastNameKana = hiraToKana(lastNameHira);

  const currentMember = await prisma.member.findUnique({
    select: {
      group: true,
    },
    where: {
      id: id,
    },
  });

  let groupData;

  if (groupId) {
    groupData = { connect: { id: groupId } };
  } else if (currentMember && currentMember.group) {
    groupData = { disconnect: true };
  }

  const res = await prisma.member.update({
    data: {
      name,
      description,
      firstName,
      firstNameHira,
      firstNameKana,
      fullname,
      group: groupData,
      house,
      lastName,
      lastNameHira,
      lastNameKana,
      nameHira,
      nameKana,
      twitter,
      website,
    },
    where: {
      id: id,
    },
  });

  if (res) {
    const embed = {
      title: `${name} (ID: ${id})`,
      color: 1986741,
      description,
      fields: [
        { name: "Name", inline: true, value: name },
        { name: "House", inline: true, value: house },
        { name: "Group ID", inline: true, value: groupId ?? "無所属・その他" },
      ],
      url: config.siteRoot + "members/" + id,
    };

    const discordData = {
      content: "Member information has been updated!",
      embeds: [embed],
    };

    const WEBHOOK_URL = process.env.WEBHOOK_URL as string;

    await fetch(WEBHOOK_URL, {
      body: JSON.stringify(discordData),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  }

  return res;
});

export async function get_contains_members(query: string) {
  if (!query.trim()) {
    return null;
  }

  const members = await prisma.member.findMany({
    include: {
      group: true,
    },
    where: {
      name: {
        contains: query,
      },
    },
  });
  return members;
}

export const getMember = async (name: string) => {
  const foundMember = await prisma.member.findFirst({
    include: {
      group: true,
    },
    where: {
      name: name,
    },
  });

  if (!foundMember) return null;

  await prisma.member.update({
    data: { scannedCount: { increment: 1 } },
    where: { id: foundMember.id },
  });

  return foundMember;
};

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

export async function updateUser({ kids }: { kids: boolean }) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const res = await prisma.user.update({
    data: {
      kids: kids,
    },
    where: {
      id: session?.user.id,
    },
  });

  return res;
}

export async function updatePrefecture({ prefecture }: { prefecture: number }) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const res = await prisma.user.update({
    data: {
      prefectureId: prefecture,
    },
    where: {
      id: session?.user.id,
    },
  });

  return res;
}

export async function DeleteAccount() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const res = await prisma.user.delete({
    where: {
      id: session.user.id,
    },
  });

  return res;
}

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
