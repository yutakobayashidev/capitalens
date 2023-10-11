"use server";

import { auth } from "@auth";
import prisma from "@src/lib/prisma";

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
