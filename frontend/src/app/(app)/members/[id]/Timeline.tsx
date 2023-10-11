import {
  convertSecondsToTime,
  formatDate,
  getFaviconSrcFromHostname,
  getHostFromURL,
  getHostFromURLProtocol,
} from "@src/helper/utils";
import { Meeting } from "@src/types/meeting";
import { Member } from "@src/types/member";
import { Dayjs } from "dayjs";
import Link from "next/link";

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

function Kokkai({
  data,
  member,
}: {
  data: Meeting;
  member: Member & {
    _count: {
      words: number;
    };
  };
}) {
  const { id, date, house, meeting_name, questions } = data;

  return (
    <div className="relative mb-10 pl-[20px]">
      <BulletPoint />
      <div className="text-xs text-gray-500">
        <span className="mr-2 text-base">🏛️</span>
        <span>国会</span>
        <time className="ml-2">{formatDate(date)}</time>
      </div>
      <div className="mb-2 mt-3 items-center text-xl md:text-2xl">
        <Link href={`/meetings/${id}`} className="mb-2 flex items-center">
          <span
            className={`${
              house === "COUNCILLORS" ? "bg-indigo-400" : "bg-[#EA5433]"
            } mr-2 rounded px-2 py-1 text-base font-bold text-white`}
          >
            {house === "COUNCILLORS" ? "参議院" : "衆議院 "}
          </span>
          <span className="font-bold">{meeting_name}</span>
        </Link>
        <p className="mb-3 line-clamp-2 text-sm text-gray-500">
          {questions ? (
            <>
              {member.name}さんは{questions.length}回質問しました
            </>
          ) : (
            <>
              {member.name}議員は{member._count.words}回発言しました
            </>
          )}
        </p>
        {questions && (
          <div className="grid gap-2 md:grid-cols-3">
            {questions.map((question) => (
              <Link
                href={`/meetings/${id}?t=${question.start}`}
                className="mb-2 line-clamp-3 inline-block rounded-md border bg-gray-100 px-4 py-3 text-sm font-semibold leading-6 text-gray-500"
                key={question.id}
              >
                <span className="mr-2 text-gray-600">
                  {convertSecondsToTime(question.start)}
                </span>
                {question.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline({
  combinedData,
  member,
}: {
  combinedData: TimelineItem[];
  member: Member & {
    _count: {
      words: number;
    };
  };
}) {
  if (combinedData.length === 0) {
    return (
      <div className="mx-auto flex max-w-md  justify-center text-center font-bold text-gray-400 md:text-lg">
        🧐国会での活動や記事が見つかると表示されます
      </div>
    );
  }
  return (
    <div className="border-l-2 py-3">
      {combinedData.map((item, i) => {
        switch (item.itemType) {
          case "feed":
            return <Feed member={member} key={i} data={item.data} />;
          case "kokkai":
            return <Kokkai key={i} data={item.data} member={member} />;
        }
      })}
    </div>
  );
}
