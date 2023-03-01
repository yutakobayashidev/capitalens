import "dayjs/locale/ja";

import { MeetingRecord } from "@src/types/meeting";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaTwitter, FaFacebook, FaYoutube, FaWikipediaW } from "react-icons/fa";
import Link from "next/link";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export type People = {
  name: string;
  image?: string;
  role?: string;
  bio?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  wikipedia?: string;
};

const people: People = {
  name: "岸田文雄",
  bio: "岸田文雄は、日本の政治家。自由民主党所属の衆議院議員、内閣総理大臣、自由民主党総裁、宏池会会長。",
  role: "衆議院議員・内閣総理大臣",
  image:
    "https://pbs.twimg.com/profile_images/1547582068661440512/kWVUOKKY_400x400.jpg",
  twitter: "https://twitter.com/kishida230",
  facebook: "https://www.facebook.com/kishdafumio",
  youtube: "https://www.youtube.com/@kishidafumio230",
  wikipedia:
    "https://ja.wikipedia.org/wiki/%E5%B2%B8%E7%94%B0%E6%96%87%E9%9B%84",
};

async function getData() {
  const res = await fetch(
    `https://kokkai.ndl.go.jp/api/meeting_list?speaker=${people.name}&recordPacking=json`
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data.meetingRecord as MeetingRecord[];
}

export default async function Page() {
  const timeline = await getData();

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
        <div className="mb-4 font-bold">{people.role}</div>
        <p className="text-gray-500">{people.bio}</p>
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
