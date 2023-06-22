"use client";

import Link from "next/link";
import { formatDate } from "@src/helper/utils";
import { FaClock } from "react-icons/fa";
import { useKuromoji } from "@src/hooks/useKuromoji";
import { useState, useEffect } from "react";
import { kanaToHira, isKanji } from "@src/helper/utils";
import { type Session } from "next-auth";
import { Meeting } from "@src/types/meeting";

export default function Meeting({
  meetings,
  user,
}: {
  meetings: {
    id: string;
    house: string | null;
    kids: string | null;
    date: string;
    summary: string | null;
    meeting_name: string;
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
      <label className="flex items-center mb-3">
        <input
          type="checkbox"
          className="mr-2"
          checked={isChecked}
          disabled={!isTokenizerReady}
          onChange={() => setIsChecked(!isChecked)}
        />
        子ども向けに説明
      </label>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4">
        {meetings.map((meeting) => (
          <Link
            href={`/meetings/${meeting.id}`}
            className="mb-5 bg-gray-50 p-6 rounded-xl border border-gray-200"
            key={meeting.id}
          >
            <h1 className="text-xl font-bold items-center flex mb-2">
              {meeting.house && (
                <span
                  className={`${
                    meeting.house === "COUNCILLORS"
                      ? "bg-indigo-400"
                      : "bg-[#EA5433]"
                  } text-white rounded font-bold mr-2 text-sm py-1 px-2`}
                >
                  {meeting.house === "COUNCILLORS" ? "参議院" : "衆議院"}
                </span>
              )}
              {meeting.meeting_name}
            </h1>
            <time
              itemProp="datePublished"
              dateTime={meeting.date}
              className="text-sm flex items-center text-gray-500"
            >
              <FaClock className="mr-1 text-gray-400" />
              {formatDate(meeting.date)}
            </time>
            {meeting.summary && (
              <div className="text-sm mt-2 text-gray-500 line-clamp-4">
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
