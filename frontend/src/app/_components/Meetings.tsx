"use client";

import { formatDate , isKanji,kanaToHira } from "@src/helper/utils";
import { useKuromoji } from "@src/hooks/useKuromoji";
import Link from "next/link";
import { type Session } from "next-auth";
import { useEffect,useState } from "react";
import { FaClock } from "react-icons/fa";

export default function Meeting({
  meetings,
  user,
}: {
  meetings: {
    id: string;
    date: string;
    house: string | null;
    kids: string | null;
    meeting_name: string;
    summary: string | null;
  }[];
  user: Session["user"];
}) {
  const [isChecked, setIsChecked] = useState(false);
  const { isTokenizerReady, tokenizer } = useKuromoji();
  const [rubyKids, setRubyKids] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    if (user && tokenizer) {
      setIsChecked(user.kids);
    }
  }, [user, tokenizer]);

  useEffect(() => {
    const generateRubyForAllMeetings = async () => {
      if (isChecked && tokenizer && meetings) {
        const newRubyKids: { [id: string]: string } = {};
        for (const meeting of meetings) {
          const text = meeting.kids || "";
          const tokens = tokenizer.tokenize(text);
          const rubyText = tokens
            .map((token) => {
              const surface = token.surface_form;
              const reading = token.reading;
              if (!reading) {
                return surface;
              }
              const hiraReading = kanaToHira(reading);
              if (surface.split("").some(isKanji)) {
                return `<ruby>${surface}<rt>${hiraReading}</rt></ruby>`;
              } else {
                return surface;
              }
            })
            .join("");
          newRubyKids[meeting.id] = rubyText;
        }
        setRubyKids(newRubyKids);
      }
    };
    generateRubyForAllMeetings();
  }, [isChecked, tokenizer, meetings]);

  return (
    <div>
      <label className="mb-3 flex items-center">
        <input
          type="checkbox"
          className="mr-2"
          checked={isChecked}
          disabled={!isTokenizerReady}
          onChange={() => setIsChecked(!isChecked)}
        />
        子ども向けに説明
      </label>
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        {meetings.map((meeting) => (
          <Link
            href={`/meetings/${meeting.id}`}
            className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-6"
            key={meeting.id}
          >
            <h1 className="mb-2 flex items-center text-xl font-bold">
              {meeting.house && (
                <span
                  className={`${
                    meeting.house === "COUNCILLORS"
                      ? "bg-indigo-400"
                      : "bg-[#EA5433]"
                  } mr-2 rounded px-2 py-1 text-sm font-bold text-white`}
                >
                  {meeting.house === "COUNCILLORS" ? "参議院" : "衆議院"}
                </span>
              )}
              {meeting.meeting_name}
            </h1>
            <time
              itemProp="datePublished"
              dateTime={meeting.date}
              className="flex items-center text-sm text-gray-500"
            >
              <FaClock className="mr-1 text-gray-400" />
              {formatDate(meeting.date)}
            </time>
            {meeting.summary && (
              <div className="mt-2 line-clamp-4 text-sm text-gray-500">
                {isChecked && meeting.kids ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: rubyKids[meeting.id] || "",
                    }}
                  />
                ) : (
                  meeting.summary
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
