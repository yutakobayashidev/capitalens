import "dayjs/locale/ja";

import { auth } from "@auth";
import { config } from "@site.config";
import Timeline from "@src/app/members/[id]/Timeline";
import WordCloud from "@src/app/members/[id]/WordCloud";
import SetPlaceHolder from "@src/hooks/placeholder";
import prisma from "@src/lib/prisma";
import { MeetingRecord } from "@src/types/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiOutlineLink } from "react-icons/ai";
import { FaFacebook, FaTwitter, FaWikipediaW, FaYoutube } from "react-icons/fa";

import Chat from "./Chat";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export const revalidate = 3600;

async function getKokkai(name: string) {
  const res = await fetch(
    `https://kokkai.ndl.go.jp/api/meeting_list?speaker=${name}&recordPacking=json`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  // Modify each meeting record to include a speech count for the specified name
  data.meetingRecord.forEach((record: MeetingRecord) => {
    let speechCount = 0;
    record.speechRecord.forEach((speech) => {
      if (speech.speaker === name) {
        speechCount++;
      }
    });
    record.speechCount = speechCount; // Add a new field to hold the speech count
  });

  return data.meetingRecord as MeetingRecord[];
}

async function getMember(id: string) {
  const people = await prisma.member.findUnique({
    include: {
      group: true,
      supporters: {
        include: {
          bill: true,
        },
      },
      timelines: true,
    },
    where: { id },
  });

  if (!people) {
    notFound();
  }

  return people;
}

type Timeline = {
  data: any;
  date: dayjs.Dayjs;
  itemType: "feed" | "kokkai";
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  const member = await getMember(params.id);

  if (!member) {
    notFound();
  }

  const ogImage = member.image ?? `${config.siteRoot}opengraph.jpg`;

  return {
    title: member.name,
    description: member.description,
    openGraph: {
      title: member.name,
      description:
        member.abstract ??
        member.description ??
        member.name + "議員の情報をチェックしましょう",
      images: [
        {
          url: ogImage,
        },
      ],
      locale: "ja-JP",
      siteName: config.siteRoot,
      url: `${config.siteRoot}people/${member.id}`,
    },
    twitter: {
      title: member.name,
      card: member.image ? "summary" : "summary_large_image",
      description:
        member.description ?? member.name + "議員の情報をチェックしましょう",
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const member = await getMember(params.id);

  const kokkaiPromise = getKokkai(member.name);
  const sessionPromise = auth();

  const [kokkai, session] = await Promise.all([kokkaiPromise, sessionPromise]);

  let combinedData: Timeline[] = [
    ...member.timelines.map((item) => ({
      data: item,
      date: dayjs(item.isoDate),
      itemType: "feed" as const,
    })),
    ...kokkai.map((item) => ({
      data: item,
      date: dayjs(item.date),
      itemType: "kokkai" as const,
    })),
  ];

  combinedData.sort((a, b) => b.date.diff(a.date));

  return (
    <>
      <div className="mx-auto mt-16 w-full max-w-screen-lg px-4 md:px-8">
        <section>
          <div className="mb-5 items-start text-center md:flex md:text-left">
            <img
              alt={member.name}
              className="mx-auto mb-5 h-56 w-56 rounded-2xl object-cover object-center md:mb-0 md:mr-8"
              height={230}
              width={230}
              src={member.image ?? ""}
            />
            <div>
              <div className="mb-2 inline-flex items-center gap-x-3">
                <h1 className="text-4xl font-bold">{member.name}</h1>
                {session?.user && (
                  <Link
                    href={`/members/${member.id}/edit`}
                    className="text-primary block"
                  >
                    更新
                  </Link>
                )}
              </div>
              {member.house && member.group && (
                <div className="mb-2 font-bold text-gray-600">
                  {member.group.name +
                    "の" +
                    (member.house === "REPRESENTATIVES" ? "衆議院" : "参議院") +
                    "議員"}
                </div>
              )}
              {member.abstract ? (
                <p className="mb-2 text-gray-500">{member.abstract}</p>
              ) : (
                member.description && (
                  <p className="mb-2 text-gray-500">{member.description}</p>
                )
              )}
              <div>
                {member.twitter && (
                  <Link
                    className="m-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F1F5F9]"
                    href={`https://twitter.com/${member.twitter}`}
                  >
                    <FaTwitter className="text-xl text-[#1da1f2]" />
                  </Link>
                )}
                {member.facebook && (
                  <Link
                    className="m-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F1F5F9]"
                    href={`https://www.facebook.com/${member.facebook}`}
                  >
                    <FaFacebook className="text-xl text-[#1877f2]" />
                  </Link>
                )}
                {member.youtube && (
                  <Link
                    className="m-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F1F5F9]"
                    href={
                      member.youtube.startsWith("UC")
                        ? `https://www.youtube.com/channel/${member.youtube}`
                        : `https://www.youtube.com/@${member.youtube}`
                    }
                  >
                    <FaYoutube className="text-xl text-[#FF0000]" />
                  </Link>
                )}
                {member.wikipedia && (
                  <a
                    className="m-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F1F5F9]"
                    href={member.wikipedia}
                  >
                    <FaWikipediaW className="text-xl text-black" />
                  </a>
                )}
                {member.website && (
                  <a
                    className="m-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F1F5F9]"
                    href={member.website}
                  >
                    <AiOutlineLink className="text-xl text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-3xl font-bold">詳細情報</h2>
          <Chat user={session?.user} member={member} />
          {member.group && (
            <div className="mb-3 flex items-center">
              {member.group.image ? (
                <img
                  className="mr-2 h-[70px] w-[70px] rounded-full border"
                  alt={member.group.name}
                  src={member.group.image}
                />
              ) : (
                <div className="mr-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-blue-100 text-center text-4xl">
                  <span>🏛️</span>
                </div>
              )}
              <div className="font-semibold">{member.group.name}</div>
            </div>
          )}
          {member.birthplace && (
            <div className="mb-3 flex items-center">
              <div className="mr-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-green-200 text-center text-4xl">
                <span>🌏</span>
              </div>
              <div className="font-semibold">{member.birthplace}出身</div>
            </div>
          )}
          {member.win && (
            <div className="mb-5 flex items-center">
              <div className="mr-2 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-red-300 text-center text-4xl">
                <span>🎉</span>
              </div>
              <div className="font-semibold">{member.win}回の当選</div>
            </div>
          )}
        </section>
        {member.supporters.length !== 0 && (
          <section>
            <h2 className="mb-5 text-3xl font-bold">賛成している法律案</h2>
            <div className="grid grid-cols-2 gap-5">
              {member.supporters.map((bill, i) => (
                <Link
                  key={i}
                  href={`/bill/${bill.billId}`}
                  className="block border border-gray-200 bg-white px-6 py-4"
                >
                  <div className="mb-4 text-5xl">⚖️</div>
                  <h2 className="mb-5 line-clamp-3 text-xl font-semibold">
                    {bill.bill.name}
                  </h2>
                  <p className="line-clamp-3 text-gray-500">
                    {bill.bill.reason}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
        <section className="my-10">
          <h2 className="mb-3 text-4xl font-bold">タイムライン</h2>
          <p className="mb-5">
            ここでは、発言した議会や、ブログの投稿などが収集され表示されています。活動を確認してみましょう。
          </p>
          <Timeline member={member} combinedData={combinedData} />
        </section>
        <section className="my-10">
          <h2 className="text-center text-4xl font-bold">WordCloud</h2>
          <WordCloud name={member.name} />
        </section>
      </div>
      <SetPlaceHolder
        placeholder={`${member.name}議員について教えてください`}
      />
    </>
  );
}
