import dayjs from "dayjs";
import "dayjs/locale/ja";
import { MeetingRecord } from "@src/types/meeting";
import { notFound } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";
import Timeline from "@src/app/members/[id]/Timeline";
import { FaTwitter, FaFacebook, FaYoutube, FaWikipediaW } from "react-icons/fa";
import Link from "next/link";
import WordCloud from "@src/app/members/[id]/WordCloud";
import type { Metadata } from "next";
import { AiOutlineLink } from "react-icons/ai";
import prisma from "@src/lib/prisma";
import TwitterTimeline from "@src/app/members/[id]/TwitterTimeline";

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
    where: { id },
    include: {
      supporters: {
        include: {
          bill: true,
        },
      },
      timelines: true,
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
  const member = await getMember(params.id);

  if (!member) {
    notFound();
  }

  const ogImage =
    member.image ?? `https://parliament-data.vercel.app/opengraph.jpg`;

  return {
    title: member.name,
    description: member.description,
    twitter: {
      card: member.image ? "summary" : "summary_large_image",
      title: member.name,
      description:
        member.description ?? member.name + "議員の情報をチェックしましょう",
      images: [ogImage],
    },
    openGraph: {
      title: member.name,
      siteName: "CapitaLens",
      url: `https://parliament-data.vercel.app/people/${member.id}`,
      description:
        member.abstract ??
        member.description ??
        member.name + "議員の情報をチェックしましょう",
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
  const member = await getMember(params.id);
  const kokkai = await getKokkai(member.name);

  let combinedData: Timeline[] = [
    ...member.timelines.map((item) => ({
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

  combinedData.sort((a, b) => b.date.diff(a.date));

  return (
    <div className="mx-auto max-w-screen-sm px-4 md:px-8 my-12">
      <section className="text-center">
        <img
          alt={member.name}
          className="rounded-2xl mx-auto h-56 w-56 object-cover object-center"
          height={230}
          width={230}
          src={member.image ?? ""}
        />
        <h1 className="mt-5 font-bold text-4xl mb-2 font-base">
          {member.name}
        </h1>
        {member.house && (
          <div className="mb-4 font-bold text-gray-600">
            {member.house == "REPRESENTATIVES"
              ? member.group + "の" + "衆議院議員"
              : "参議院議員"}
          </div>
        )}
        {member.abstract ? (
          <p className="text-gray-500">{member.abstract}</p>
        ) : (
          member.description && (
            <p className="text-gray-500">{member.description}</p>
          )
        )}
        <div className="my-3">
          {member.twitter && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={"https://twitter.com/" + member.twitter}
            >
              <FaTwitter className="text-[#1da1f2] text-xl" />
            </Link>
          )}
          {member.facebook && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={"https://www.facebook.com/" + member.facebook}
            >
              <FaFacebook className="text-[#1877f2] text-xl" />
            </Link>
          )}
          {member.youtube && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={
                member.youtube.startsWith("UC")
                  ? `https://www.youtube.com/channel/${member.youtube}`
                  : `https://www.youtube.com/@${member.youtube}`
              }
            >
              <FaYoutube className="text-[#FF0000] text-xl" />
            </Link>
          )}
          {member.wikipedia && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={member.wikipedia}
            >
              <FaWikipediaW className="text-black text-xl" />
            </Link>
          )}
          {member.website && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={member.website}
            >
              <AiOutlineLink className="text-xl text-gray-500" />
            </Link>
          )}
        </div>
        {member.twitter && <TwitterTimeline username={member.twitter} />}
      </section>
      <section className="my-10">
        <h2 className="text-center text-4xl font-bold">WordCloud</h2>
        <WordCloud name={member.name} />
      </section>
      <section>
        <h2 className="text-3xl mb-5 font-bold">詳細情報</h2>
        {member.group && (
          <div className="flex items-center mb-3">
            <div className="w-[70px] h-[70px] mr-2 flex justify-center items-center bg-blue-100 text-4xl rounded-full text-center">
              <span>🏛️</span>
            </div>
            <div className="font-semibold">{member.group}</div>
          </div>
        )}
        {member.birthplace && (
          <div className="flex items-center mb-3">
            <div className="w-[70px] h-[70px] mr-2 flex justify-center items-center bg-green-200 text-4xl rounded-full text-center">
              <span>🌏</span>
            </div>
            <div className="font-semibold">{member.birthplace}出身</div>
          </div>
        )}
        {member.win && (
          <div className="flex items-center mb-5">
            <div className="w-[70px] h-[70px] mr-2 flex justify-center items-center bg-red-300 text-4xl rounded-full text-center">
              <span>🎉</span>
            </div>
            <div className="font-semibold">{member.win}回の当選</div>
          </div>
        )}
      </section>
      <section>
        <h2 className="text-3xl mb-5 font-bold">賛成している法案</h2>
        <div className="grid grid-cols-2 gap-5">
          {member.supporters.map((bill, i) => (
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
        <Timeline member={member} combinedData={combinedData} />
      </section>
    </div>
  );
}
