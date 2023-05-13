import { NextResponse } from "next/server";
import prisma from "@src/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@src/app/api/auth/[...nextauth]/authOptions";

export async function POST(request: Request) {
  const res = await request.json();

  const session = await getServerSession(authOptions);

  if (!session)
    return res.status(401).json({
      error: { code: 401, message: "ログインしてください" },
    });

  if (!session.user || !session.user.id)
    return res.status(500).json({
      error: {
        code: 500,
        message: "サーバーがセッションユーザーIDの取得に失敗しました",
      },
    });

  if (typeof res.body !== "string") {
    return NextResponse.json({ error: "" });
  }

  const req = await prisma.comment.create({
    data: {
      comment: res.body,
      user: { connect: { id: session.user.id } },
      type: res.type,
      bill: { connect: { id: res.bill_id } },
    },
  });

  return NextResponse.json(req);
}
