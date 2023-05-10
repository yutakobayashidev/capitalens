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
    const foundPeople = await prisma.member.findFirst({
      where: {
        name: name,
      },
    });

    if (foundPeople) {
      return NextResponse.json(foundPeople);
    } else {
      return NextResponse.json({ error: "Not found" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
