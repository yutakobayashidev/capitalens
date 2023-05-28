import prisma from "@src/lib/prisma";

export const revalidate = 3600;

export async function GET() {
  const timeline = await prisma.timeline.findMany({
    where: {
      member: {
        group: "JIMIN",
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
        <title>自由民主党</title>
        <subtitle>自由民主党議員のブログ・動画のRSSフィードです</subtitle>
        <link href="https://parliament-data.vercel.app/group/feed" rel="self"/>
        <link href="https://parliament-data.vercel.app/group/feed"/>
        <updated>${timeline[0].isoDate}</updated>
        <id>https://parliament-data.vercel.app</id>${timeline
          .map((post) => {
            return `
        <entry>
            <id>${post.link}</id>
            <title>${post.title}</title>
            <link href=${post.link}/>
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
