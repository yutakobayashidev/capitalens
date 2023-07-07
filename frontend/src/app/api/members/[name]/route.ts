import prisma from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { name: string };
  }
) {
  const name = params.name;

  try {
    const foundMember = await prisma.member.findFirst({
      include: {
        group: true,
      },
      where: {
        name: name,
      },
    });

    if (foundMember) {
      // Increment the scannedCount and update the member
      await prisma.member.update({
        data: { scannedCount: { increment: 1 } },
        where: { id: foundMember.id },
      });

      return NextResponse.json(foundMember);
    } else {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
