import prisma from "@src/lib/prisma";
import type { Metadata } from "next";
import Topics from "@src/app/_components/Topics";

export const revalidate = 3600;

async function getTopicViews() {
  const data = await prisma.views.findMany({
    take: 100,
    orderBy: {
      count: "desc",
    },
    select: {
      name: true,
    },
  });

  return data;
}

export const metadata: Metadata = {
  title: "注目のトピック",
};

export default async function Page() {
  const topics = await getTopicViews();

  return (
    <div className="mx-auto max-w-screen-xl px-4 md:px-8 my-12">
      <h1 className="font-bold mb-7 text-3xl md:text-4xl">🔍注目のトピック</h1>
      <p className="mb-3">
        注目のトピックは国会での発言数、本サイトでの各トピックのアクセス数で決定されています。
      </p>
      <Topics topics={topics} />
    </div>
  );
}
