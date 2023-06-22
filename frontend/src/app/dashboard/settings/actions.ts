"use server";

import prisma from "@src/lib/prisma";
import { auth } from "@auth";

export async function updateUser({ kids }: { kids: boolean }) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const res = await prisma.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      kids: kids,
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
    where: {
      id: session?.user.id,
    },
    data: {
      prefectureId: prefecture,
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
