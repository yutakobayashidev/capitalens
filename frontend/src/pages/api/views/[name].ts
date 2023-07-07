import prisma from "@src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      error: `${req.method}メソッドはサポートされていません。`,
    });
  }

  if (!req.query.name) {
    return res.status(400).json({
      error: "nameが存在しません",
    });
  }

  const name = decodeURI(req.query.name.toString());

  const newOrUpdatedViews = await prisma.views.upsert({
    create: {
      name,
    },
    update: {
      count: {
        increment: 1,
      },
    },
    where: {
      name,
    },
  });

  return res.status(200).json({
    total: newOrUpdatedViews.count.toString(),
  });
}
