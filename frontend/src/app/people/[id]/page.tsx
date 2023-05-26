import "dayjs/locale/ja";

import { MeetingRecord } from "@src/types/meeting";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaTwitter, FaFacebook, FaYoutube, FaWikipediaW } from "react-icons/fa";
import Link from "next/link";
import WordCloud from "@src/app/people/[id]/WordCloud";
import type { Metadata } from "next";
import { AiOutlineLink } from "react-icons/ai";
import prisma from "@src/lib/prisma";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export const revalidate = 3600;

function getFaviconSrcFromHostname(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${hostname}`;
}

function getHostFromURL(url: string) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

function formatDate(dateText: string, format = "YYYY-MM-DD") {
  const date = dayjs(dateText);
  // conditionally return relative date
  const isRecent = Math.abs(date.diff(Date.now(), "month")) < 6;

  return isRecent ? date.fromNow() : date.format(format);
}

async function getTimeline(name: string) {
  const res = await fetch(
    `https://kokkai.ndl.go.jp/api/meeting_list?speaker=${name}&recordPacking=json`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data.meetingRecord as MeetingRecord[];
}

async function getPeople(id: string) {
  const people = await prisma.member.findUnique({
    where: { id },
    include: {
      supporters: {
        include: {
          bill: true,
        },
      },
    },
  });

  if (!people) {
    notFound();
  }

  return people;
}

type Timeline = {
  itemType: "feed" | "kokkai";
  date: dayjs.Dayjs;
  data: any;
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  const people = await getPeople(params.id);

  if (!people) {
    notFound();
  }

  const ogImage =
    people.image ?? `https://parliament-data.vercel.app/opengraph.jpg`;

  return {
    title: people.name,
    description: people.description,
    twitter: {
      card: people.image ? "summary" : "summary_large_image",
      title: people.name,
      description:
        people.description ?? people.name + "議員の情報をチェックしましょう",
      images: [ogImage],
    },
    openGraph: {
      title: people.name,
      siteName: "CapitaLens",
      url: `https://parliament-data.vercel.app/people/${people.id}`,
      description:
        people.abstract ??
        people.description ??
        people.name + "議員の情報をチェックしましょう",
      locale: "ja-JP",
      images: [
        {
          url: ogImage,
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const people = await getPeople(params.id);
  const kokkai = await getTimeline(people.name);
  const feed = await prisma.timeline.findMany({
    where: {
      memberId: params.id,
    },
  });

  let combinedData: Timeline[] = [
    ...feed.map((item) => ({
      itemType: "feed" as const,
      date: dayjs(item.isoDate),
      data: item,
    })),
    ...kokkai.map((item) => ({
      itemType: "kokkai" as const,
      date: dayjs(item.date),
      data: item,
    })),
  ];

  // Sort by date
  combinedData.sort((a, b) => b.date.diff(a.date));

  return (
    <div className="mx-auto max-w-screen-sm px-4 md:px-8 my-12">
      <section className="text-center">
        <img
          alt={people.name}
          className="rounded-2xl mx-auto h-56 w-56 object-cover object-center"
          height={230}
          width={230}
          src={people.image ?? ""}
        />
        <h1 className="mt-5 font-bold text-4xl mb-2 font-base">
          {people.name}
        </h1>
        {people.house && (
          <div className="mb-4 font-bold text-gray-600">
            {people.house == "REPRESENTATIVES"
              ? people.group + "の" + "衆議院議員"
              : "参議院議員"}
          </div>
        )}
        {people.abstract ? (
          <p className="text-gray-500">{people.abstract}</p>
        ) : (
          people.description && (
            <p className="text-gray-500">{people.description}</p>
          )
        )}
        <div className="mt-3">
          {people.twitter && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={"https://twitter.com/" + people.twitter}
            >
              <FaTwitter className="text-[#1da1f2] text-xl" />
            </Link>
          )}
          {people.facebook && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={"https://www.facebook.com/" + people.facebook}
            >
              <FaFacebook className="text-[#1877f2] text-xl" />
            </Link>
          )}
          {people.youtube && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={
                people.youtube.startsWith("UC")
                  ? `https://www.youtube.com/channel/${people.youtube}`
                  : `https://www.youtube.com/@${people.youtube}`
              }
            >
              <FaYoutube className="text-[#FF0000] text-xl" />
            </Link>
          )}
          {people.wikipedia && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={people.wikipedia}
            >
              <FaWikipediaW className="text-black text-xl" />
            </Link>
          )}
          {people.website && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={people.website}
            >
              <AiOutlineLink className="text-xl text-gray-500" />
            </Link>
          )}
        </div>
      </section>
      <section className="my-10">
        <h2 className="text-center text-4xl font-bold">WordCloud</h2>
        <WordCloud name={people.name} />
      </section>
      <section>
        <h2 className="text-3xl mb-5 font-bold">詳細情報</h2>
        {people.group && (
          <div className="flex items-center mb-3">
            <div className="w-[70px] h-[70px] mr-2 flex justify-center items-center bg-blue-100 text-4xl rounded-full text-center">
              <span>🏛️</span>
            </div>
            <div className="font-semibold">{people.group}</div>
          </div>
        )}
        {people.birthplace && (
          <div className="flex items-center mb-3">
            <div className="w-[70px] h-[70px] mr-2 flex justify-center items-center bg-green-200 text-4xl rounded-full text-center">
              <span>🌏</span>
            </div>
            <div className="font-semibold">{people.birthplace}出身</div>
          </div>
        )}
        {people.win && (
          <div className="flex items-center mb-5">
            <div className="w-[70px] h-[70px] mr-2 flex justify-center items-center bg-red-300 text-4xl rounded-full text-center">
              <span>🎉</span>
            </div>
            <div className="font-semibold">{people.win}回の当選</div>
          </div>
        )}
      </section>
      <section>
        <h2 className="text-3xl mb-5 font-bold">賛成している法案</h2>
        <div className="grid grid-cols-2 gap-5">
          {people.supporters.map((bill, i) => (
            <Link
              key={i}
              href={`/bill/${bill.billId}`}
              className="block bg-white px-6 py-4 border border-gray-200"
            >
              <div className="text-5xl mb-4">⚖️</div>
              <h2 className="text-xl font-semibold line-clamp-3 mb-5">
                {bill.bill.name}
              </h2>
              <p className="text-gray-500 line-clamp-3">{bill.bill.reason}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="my-10">
        <h2 className="text-4xl font-bold mb-3">Timeline</h2>
        <p className="mb-5">
          ここでは、発言した議会や、ブログの投稿などが収集され表示されています。活動を確認してみましょう。
        </p>
        <div className="border-l-2 py-3">
          {combinedData.map((item, i) => {
            switch (item.itemType) {
              case "feed":
                return (
                  <div key={i} className="relative mb-10 pl-[20px]">
                    <div className="absolute inline-flex w-[10px] h-[10px] left-[-6px] top-[5px] border-2 rounded-full bg-white" />
                    <div className="flex items-center">
                      <img
                        alt={getHostFromURL(item.data.link)}
                        src={getFaviconSrcFromHostname(
                          getHostFromURL(item.data.link)
                        )}
                        className="rounded mr-2"
                        width={20}
                        height={20}
                      />
                      <div className="text-gray-500 text-xs">
                        <span>Posted on {getHostFromURL(item.data.link)}</span>
                        {item.data.isoDate && (
                          <time className="ml-2">
                            {formatDate(item.data.isoDate)}
                          </time>
                        )}
                      </div>
                    </div>
                    <a
                      href={item.data.link}
                      className="block leading-10 text-xl md:text-2xl font-bold mt-3 mb-2"
                    >
                      {item.data.title}
                    </a>
                    <p className="line-clamp-2 text-gray-600 text-sm">
                      {item.data.contentSnippet}
                    </p>
                  </div>
                );
              case "kokkai":
                return (
                  <div
                    key={item.data.issueID}
                    className="relative mb-10 pl-[20px]"
                  >
                    <div className="absolute inline-flex w-[10px] h-[10px] left-[-6px] top-[5px] border-2 rounded-full bg-white"></div>
                    <div className="text-gray-500 text-xs">
                      <span>国会での発言</span>
                      <time className="ml-2">{formatDate(item.data.date)}</time>
                    </div>

                    <div className="flex items-center mt-4 text-xl md:text-2xl">
                      <a
                        href={item.data.meetingURL}
                        className="font-bold leading-10"
                      >
                        <span
                          className={`${
                            item.data.nameOfHouse === "参議院"
                              ? "bg-[#007ABB]"
                              : "bg-[#EA5433]"
                          } text-white text-lg rounded-md font-bold mr-3 px-3 py-1.5`}
                        >
                          {item.data.nameOfHouse}
                        </span>
                        (国会) {item.data.nameOfMeeting} {item.data.issue}
                      </a>
                    </div>
                  </div>
                );
            }
          })}
        </div>
      </section>
    </div>
  );
}
