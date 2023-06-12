import { getServerSession } from "next-auth";
import prisma from "@src/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@src/app/api/auth/[...nextauth]/authOptions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required." });
  }

  const body = await request.json();

  const res = await prisma.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      kids: body.kids,
    },
  });

  return NextResponse.json(res);
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required." });
  }

  const res = await prisma.user.delete({
    where: {
      id: session.user.id,
    },
  });

  return NextResponse.json(res);
}
