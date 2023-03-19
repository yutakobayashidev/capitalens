import "dayjs/locale/ja";

import { MeetingRecord } from "@src/types/meeting";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaTwitter, FaFacebook, FaYoutube, FaWikipediaW } from "react-icons/fa";
import Link from "next/link";
import { getPeopleById } from "@src/helper/people";
import WordCloud from "@src/app/people/[id]/WordCloud";
import type { Metadata } from "next";

dayjs.locale("ja");
dayjs.extend(relativeTime);

async function getTimeline(id: string) {
  const people = getPeopleById(id);

  if (!people) {
    notFound();
  }

  const res = await fetch(
    `https://kokkai.ndl.go.jp/api/meeting_list?speaker=${people.name}&recordPacking=json`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data.meetingRecord as MeetingRecord[];
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  const people = getPeopleById(params.id);

  if (!people) {
    notFound();
  }

  return { title: people.name };
}

export default async function Page({ params }: { params: { id: string } }) {
  const timelinePromise = getTimeline(params.id);
  const peoplePromise = getPeopleById(params.id);

  const [timeline, people] = await Promise.all([
    timelinePromise,
    peoplePromise,
  ]);

  if (!people) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-screen-sm px-4 md:px-8 my-12">
      <section className="text-center">
        <img
          alt={people.name}
          className="rounded-2xl mx-auto"
          height={230}
          width={230}
          src={people.image}
        ></img>
        <h1 className="mt-5 font-bold text-4xl mb-2 font-base">
          {people.name}
        </h1>
        {people.role && <div className="mb-4 font-bold">{people.role}</div>}
        {people.bio && <p className="text-gray-500">{people.bio}</p>}
        <div className="mt-3">
          {people.twitter && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={people.twitter}
            >
              <FaTwitter className="text-[#1da1f2] text-xl" />
            </Link>
          )}
          {people.facebook && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={people.facebook}
            >
              <FaFacebook className="text-[#1877f2] text-xl" />
            </Link>
          )}
          {people.youtube && (
            <Link
              className="bg-[#F1F5F9] rounded-md m-2 inline-flex items-center justify-center h-10 w-10"
              href={people.youtube}
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
        </div>
      </section>
      <section className="my-10">
        <h2 className="text-center text-4xl font-bold">WordCloud</h2>
        <WordCloud name={people.name} />
      </section>
      <section className="my-10">
        <h2 className="text-center text-4xl font-bold">Timeline</h2>
        <div className="border-l-2 mt-10 py-3">
          {timeline.map((item) => (
            <div key={item.issueID} className="relative mb-10 pl-[20px]">
              <div className="absolute inline-flex w-[10px] h-[10px] left-[-6px] top-[7px] border-2 rounded-full bg-white"></div>
              <div>{dayjs(item.date).fromNow()}</div>
              <div className="flex items-center mt-4 text-xl md:text-2xl">
                <a
                  href={item.meetingURL}
                  className="font-bold flex items-center"
                >
                  <span
                    className={`${
                      item.nameOfHouse === "参議院"
                        ? "bg-[#007ABB]"
                        : "bg-[#EA5433]"
                    } text-white rounded-md font-bold mr-3 px-2`}
                  >
                    {item.nameOfHouse}
                  </span>
                  (国会) {item.nameOfMeeting} {item.issue}
                  <HiOutlineExternalLink className="text-gray-400 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
