import { NextResponse } from "next/server";
import prisma from "@src/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@src/app/api/auth/[...nextauth]/authOptions";

export async function POST(request: Request) {
  const res = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "ログインしてください" });

  if (!session.user || !session.user.id)
    return NextResponse.json({
      error: "サーバーがセッションユーザーIDの取得に失敗しました",
    });

  if (typeof res.id !== "string") {
    return NextResponse.json({ error: "必須項目が入力されていません" });
  }

  const vote = await prisma.vote.findFirst({
    where: {
      commentId: res.id,
      userId: session.user.id,
    },
  });

  if (!vote) {
    const response = await prisma.vote.upsert({
      create: {
        comment: { connect: { id: res.id } },
        user: { connect: { id: session.user.id } },
      },
      update: {},
      where: {
        id: res.id,
      },
    });

    return NextResponse.json(response);
  }

  if (vote) {
    const res = await prisma.vote.delete({
      where: {
        id: vote.id,
      },
    });
    return NextResponse.json(res);
  }
}
