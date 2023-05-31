import prisma from "@src/lib/prisma";

export const revalidate = 3600;

enum Group {
  JIMIN = "JIMIN",
  RIKKEN = "RIKKEN",
  KOMEI = "KOMEI",
  KYOSAN = "KYOSAN",
  ISHIN = "ISHIN",
  KOKUMIN = "KOKUMIN",
  REIWA = "REIWA",
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: keyof typeof Group };
  }
) {
  if (!Object.keys(Group).includes(params.id)) {
    return new Response("error");
  }

  const group = await prisma.group.findUnique({
    where: { id: params.id },
  });

  if (!group) {
    return new Response("error");
  }

  const timeline = await prisma.timeline.findMany({
    where: {
      member: {
        group: {
          name: params.id,
        },
      },
    },
    include: {
      member: true,
    },
    orderBy: {
      isoDate: "desc",
    },
    take: 50,
  });

  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
        <title>${group.name}</title>
        <subtitle>${group.name}議員のブログ・動画のRSSフィードです</subtitle>
        <link href="https://parliament-data.vercel.app/group/${
          group.id
        }/feed" rel="self"/>
        <link href="https://parliament-data.vercel.app/group/${group.id}/feed"/>
        <updated>${timeline[0].isoDate}</updated>
        <id>https://parliament-data.vercel.app</id>${timeline
          .map((post) => {
            return `
        <entry>
            <id>${post.link}</id>
            <title>${post.title}</title>
            <link href="${post.link}"/>
            <updated>${post.isoDate}</updated>
        </entry>`;
          })
          .join("")}
    </feed>`,
    {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
      },
    }
  );
}
