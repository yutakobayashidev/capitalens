import { auth } from "@auth";
import { Member, Video } from "@prisma/client";
import Meetings from "@src/app/_components/Meetings";
import prisma from "@src/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

import Search from "./Search";

export const metadata: Metadata = {
  title: "検索",
};

async function getMember(query: string): Promise<Member[]> {
  const members = await prisma.member.findMany({
    where: {
      name: {
        contains: query,
      },
    },
  });
  return members;
}

async function getMeeting(query: string): Promise<Video[]> {
  const meetings = await prisma.video.findMany({
    where: {
      meeting_name: {
        contains: query,
      },
    },
  });
  return meetings;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { q, source } = searchParams;

  const session = await auth();

  let membersData: Member[] | null = null;
  let meetingsData: Video[] | null = null;

  if (q && (source === undefined || source === "members")) {
    membersData = await getMember(q as string);
  } else if (q && source === "meetings") {
    meetingsData = await getMeeting(q as string);
  }

  return (
    <div className="mt-6">
      <div className="mx-auto w-full max-w-screen-md px-4 md:px-8">
        <Search />
        {membersData && (
          <>
            {membersData.length === 0 ? (
              <p className="text-center font-bold text-gray-400 md:text-lg">
                🧐 検索結果が見つかりませんでした
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-4 gap-5">
                {membersData.map((item, i) => (
                  <Link href={`/members/${item.id}`} key={item.id}>
                    <img
                      className="rounded-xl"
                      src={item.image ?? "/noimage.png"}
                      alt={item.name}
                    />
                    <h1 className="mt-3 text-center text-xl font-bold">
                      {item.name}
                    </h1>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
        {meetingsData && (
          <>
            {meetingsData.length === 0 ? (
              <p className="text-center font-bold text-gray-400 md:text-lg">
                🧐 検索結果が見つかりませんでした
              </p>
            ) : (
              <Meetings user={session?.user} meetings={meetingsData} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
