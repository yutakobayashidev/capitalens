import { Dayjs } from "dayjs";
import {
  getHostFromURL,
  getFaviconSrcFromHostname,
  formatDate,
} from "@src/helper/utils";
import { MeetingRecord } from "@src/types/meeting";
import { Member } from "@src/types/member";

type TimelineItem = {
  itemType: "feed" | "kokkai";
  date: Dayjs;
  data: any;
};

type Feed = {
  title: string;
  link: string;
  isoDate?: string;
  contentSnippet?: string;
};

function BulletPoint() {
  return (
    <div className="absolute inline-flex w-[10px] h-[10px] left-[-6px] top-[5px] border-2 rounded-full bg-white" />
  );
}

function Feed({ data }: { data: Feed }) {
  const { link, isoDate, title, contentSnippet } = data;
  const host = getHostFromURL(link);

  return (
    <div className="relative mb-10 pl-[20px]">
      <BulletPoint />
      <div className="flex items-center">
        <img
          alt={host}
          src={getFaviconSrcFromHostname(host)}
          className="rounded mr-2"
          width={20}
          height={20}
        />
        <div className="text-gray-500 text-xs">
          <span>Posted on {host}</span>
          {isoDate && <time className="ml-2">{formatDate(isoDate)}</time>}
        </div>
      </div>
      <a
        href={link}
        className="block leading-10 text-xl md:text-2xl font-bold mt-3 mb-2"
      >
        {title}
      </a>
      {contentSnippet && (
        <p className="line-clamp-2 text-gray-600 text-sm">{contentSnippet}</p>
      )}
    </div>
  );
}

function Kokkai({ data, member }: { data: MeetingRecord; member: Member }) {
  const { date, meetingURL, nameOfHouse, nameOfMeeting, issue, speechCount } =
    data;

  return (
    <div className="relative mb-10 pl-[20px]">
      <BulletPoint />
      <div className="text-gray-500 text-xs">
        <span className="mr-2 text-base">🏛️</span>
        <span>国会での発言</span>
        <time className="ml-2">{formatDate(date)}</time>
      </div>
      <div className="flex items-center mt-3 mb-2 text-xl md:text-2xl">
        <a href={meetingURL} className="font-bold leading-10">
          <span
            className={`${
              nameOfHouse === "参議院" ? "bg-[#007ABB]" : "bg-[#EA5433]"
            } text-white text-lg rounded-md font-bold mr-3 px-3 py-1.5`}
          >
            {nameOfHouse}
          </span>
          {nameOfMeeting} {issue}
        </a>
      </div>
      <p className="line-clamp-2 text-gray-600 text-sm">
        {member.name}さんは{speechCount}回発言しました
      </p>
    </div>
  );
}

export default function Timeline({
  combinedData,
  member,
}: {
  combinedData: TimelineItem[];
  member: Member;
}) {
  return (
    <div className="border-l-2 py-3">
      {combinedData.map((item, i) => {
        switch (item.itemType) {
          case "feed":
            return <Feed key={i} data={item.data as Feed} />;
          case "kokkai":
            return (
              <Kokkai
                key={i}
                data={item.data as MeetingRecord}
                member={member}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
