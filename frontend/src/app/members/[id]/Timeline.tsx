import {
  formatDate,
  getFaviconSrcFromHostname,
  getHostFromURL,
  getHostFromURLProtocol,
} from "@src/helper/utils";
import { MeetingRecord } from "@src/types/api";
import { Member } from "@src/types/member";
import { Dayjs } from "dayjs";

type TimelineItem = {
  data: any;
  date: Dayjs;
  itemType: "feed" | "kokkai";
};

type Feed = {
  title: string;
  contentSnippet?: string;
  isoDate?: string;
  link: string;
};

function BulletPoint() {
  return (
    <div className="absolute left-[-6px] top-[5px] inline-flex h-[10px] w-[10px] rounded-full border-2 bg-white" />
  );
}

function Linkify({ content }: { content: string }) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  return (
    <p className="line-clamp-2 text-sm text-gray-600">
      {content.split(urlPattern).map((part, i) =>
        urlPattern.test(part) ? (
          <a className="text-primary hover:underline" key={i} href={part}>
            {part}
          </a>
        ) : (
          part
        )
      )}
    </p>
  );
}

function Feed({ data, member }: { data: Feed; member: Member }) {
  const { title, contentSnippet, isoDate, link } = data;
  const host = getHostFromURL(link);

  return (
    <div className="relative mb-10 pl-[20px]">
      <BulletPoint />
      <div className="flex items-center">
        <img
          alt={host}
          src={getFaviconSrcFromHostname(host)}
          className="mr-2 rounded"
          width={20}
          height={20}
        />
        <div className="text-xs text-gray-500">
          <span>
            Posted on{" "}
            <a
              className="font-semibold text-gray-600 underline-offset-4 hover:underline"
              href={
                host === "www.youtube.com" && member.youtube
                  ? member.youtube.startsWith("UC")
                    ? `https://www.youtube.com/channel/${member.youtube}`
                    : `https://www.youtube.com/@${member.youtube}`
                  : getHostFromURLProtocol(link)
              }
            >
              {host}
            </a>
          </span>
          {isoDate && <time className="ml-2">{formatDate(isoDate)}</time>}
        </div>
      </div>
      <a
        href={link}
        className="mb-2 mt-3 block text-xl font-bold leading-10 md:text-2xl"
      >
        {title}
      </a>
      {contentSnippet && <Linkify content={contentSnippet} />}
    </div>
  );
}

function Kokkai({ data, member }: { data: MeetingRecord; member: Member }) {
  const { date, issue, meetingURL, nameOfHouse, nameOfMeeting, speechCount } =
    data;

  return (
    <div className="relative mb-10 pl-[20px]">
      <BulletPoint />
      <div className="text-xs text-gray-500">
        <span className="mr-2 text-base">🏛️</span>
        <span>国会での発言</span>
        <time className="ml-2">{formatDate(date)}</time>
      </div>
      <div className="mb-2 mt-3 flex items-center text-xl md:text-2xl">
        <a href={meetingURL} className="font-bold leading-10">
          <span
            className={`${
              nameOfHouse === "参議院" ? "bg-indigo-400" : "bg-[#EA5433]"
            } mr-2 rounded-md px-2 py-1.5 text-lg font-bold text-white`}
          >
            {nameOfHouse}
          </span>
          {nameOfMeeting} {issue}
        </a>
      </div>
      <p className="line-clamp-2 text-sm text-gray-600">
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
            return <Feed member={member} key={i} data={item.data as Feed} />;
          case "kokkai":
            return (
              <Kokkai
                key={i}
                data={item.data as MeetingRecord}
                member={member}
              />
            );
        }
      })}
    </div>
  );
}
