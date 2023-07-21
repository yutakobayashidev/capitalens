"use client";

import { config } from "@site.config";
import { convertSecondsToTime } from "@src/helper/utils";
import { Meeting } from "@src/types/meeting";
import { Member } from "@src/types/member";
import cn from "classnames";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { type Session } from "next-auth";
import { useCallback, useRef, useState } from "react";
import { FaTwitter } from "react-icons/fa";
import Player from "video.js/dist/types/player";

import Comments from "./Comments";
import { options } from "./options";
import VideoJSPlayer from "./Player";
import Speaker from "./Speaker";
import Summarize from "./Summarize";
import Transcript from "./Transcript";

dayjs.extend(utc);
dayjs.extend(duration);

function LinkButton({
  title,
  emoji,
  url,
}: {
  title: string;
  emoji: string;
  url: string;
}) {
  return (
    <a
      href={url}
      className="flex items-center justify-center rounded-xl border bg-white px-2 py-8 text-xl font-bold text-gray-800 transition-all duration-500 ease-in-out hover:shadow-md md:p-10"
    >
      <span className="mr-3 text-4xl">{emoji}</span>
      {title}
    </a>
  );
}

// Moved these constants and functions outside the component to declutter the component itself.
const MAX_TWEET_LENGTH = 140;
const TWITTER_SHORTENED_URL_LENGTH = 23;
const ellipsis = "...";

const truncateSummary = (summary: string, maxChars: number): string =>
  summary.length > maxChars
    ? summary.slice(0, maxChars - ellipsis.length) + ellipsis
    : summary;

const formatSeconds = (secs: number) => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const result = [];
  if (hours > 0) result.push(`${hours}時間`);
  if (minutes > 0) result.push(`${minutes}分`);
  return result.join("");
};

export default function Video({
  meeting,
  user,
}: {
  meeting: Meeting;
  user: Session["user"];
}) {
  const playerRef = useRef<Player | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<Member | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const startSec = searchParams?.get("t");

  const baseText = `${meeting.house === "COUNCILLORS" ? "参議院" : "衆議院"} ${
    meeting.meeting_name
  }\n\n`;
  const url = `${config.siteRoot}meetings/${meeting.id}`;

  const updateCurrentWord = useCallback(
    (time: number) => {
      let found = false;
      for (let i = 0; i < meeting.utterances.length; i++) {
        for (let j = 0; j < meeting.utterances[i].words.length; j++) {
          if (
            time >= meeting.utterances[i].words[j].start &&
            time < meeting.utterances[i].words[j].end
          ) {
            setCurrentWord(meeting.utterances[i].words[j].text);
            setCurrentSpeaker(meeting.utterances[i].words[j].member);
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) {
        setCurrentWord(null);
        setCurrentSpeaker(null);
      }
    },
    [meeting.utterances]
  );

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;
    player.on("timeupdate", function () {
      const newTime = player.currentTime();
      setCurrentTime(newTime);
      if (meeting.utterances.length === 0) {
        for (let i = meeting.annotations.length - 1; i >= 0; i--) {
          let annotation = meeting.annotations[i];
          if (newTime >= annotation.start_sec) {
            if (annotation.speaker_name !== (currentSpeaker?.name ?? ""))
              setCurrentSpeaker(annotation.member);
            break;
          }
        }
      } else {
        updateCurrentWord(newTime);
      }
    });
    player.on("loadedmetadata", function () {
      if (startSec) player.currentTime(parseFloat(startSec));
      else if (meeting.utterances[0])
        player.currentTime(meeting.utterances[0].start);
    });
  };

  return (
    <div className="my-7 block justify-center md:flex">
      <div className="md:mr-5 md:w-[calc(65%)]">
        <VideoJSPlayer
          options={options(meeting.m3u8_url)}
          onReady={handlePlayerReady}
        />
        <div className="my-5 flex items-center justify-between">
          <h1 className="flex items-center text-2xl font-bold">
            <span
              className={cn({
                "bg-[#EA5433]": meeting.house !== "COUNCILLORS",
                "bg-indigo-400": meeting.house === "COUNCILLORS",
                "mr-2 rounded px-2 py-1 text-base font-bold text-white": true,
              })}
            >
              {meeting.house === "COUNCILLORS" ? "参議院" : "衆議院"}
            </span>
            {meeting.meeting_name}
          </h1>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              baseText +
                truncateSummary(
                  meeting.summary ? meeting.summary : "",
                  MAX_TWEET_LENGTH -
                    baseText.length -
                    TWITTER_SHORTENED_URL_LENGTH
                )
            )}&url=${url}?t=${Math.floor(currentTime)}`}
            className="hidden items-center rounded-full bg-[#00acee] px-4 py-2 text-sm font-semibold text-white md:inline-flex"
          >
            <FaTwitter className="mr-2" />
            ツイートする
          </a>
        </div>
        {currentSpeaker && <Speaker currentSpeaker={currentSpeaker} />}
        <div className="mb-5 rounded-xl bg-gray-100 px-4 pb-6 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center text-base">
              <span className="font-medium">
                {dayjs(meeting.date).format("YYYY/MM/DD")}
              </span>
              {meeting.utterances.length !== 0 && (
                <>
                  <span>・</span>
                  <span>
                    {formatSeconds(
                      meeting.utterances[meeting.utterances.length - 1].end -
                        meeting.utterances[0].start
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold">発言者</h2>
          <div className="my-3">
            {meeting.annotations.map((annotation) => (
              <div className="mb-0.5 flex" key={annotation.id}>
                <button
                  className="text-primary"
                  data-start-sec={annotation.start_sec}
                  onClick={() => {
                    if (playerRef.current) {
                      playerRef.current.currentTime(annotation.start_sec);
                      playerRef.current.play();
                    }
                  }}
                >
                  {convertSecondsToTime(annotation.start_sec)}
                </button>
                <p className="ml-2">
                  {annotation.speaker_name} ({annotation.speaker_info})
                </p>
              </div>
            ))}
          </div>
          {meeting.questions.length !== 0 && (
            <>
              <h2 className="text-xl font-bold">ハイライト</h2>
              <div className="my-3">
                {meeting.questions.map((question) => (
                  <div className="mb-0.5 flex items-start" key={question.id}>
                    <button
                      className="text-primary"
                      data-start-sec={question.start}
                      onClick={() => {
                        if (playerRef.current) {
                          playerRef.current.currentTime(question.start);
                          playerRef.current.play();
                        }
                      }}
                    >
                      {convertSecondsToTime(question.start)}
                    </button>
                    <p className="ml-2">
                      {question.title}{" "}
                      {question.member ? `(${question.member.name})` : null}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
          <h2 className="mb-3 text-xl font-bold">関連リンク</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <LinkButton
              url={meeting.page_url}
              emoji="📺"
              title="インターネット審議中継"
            />
            {meeting.meetingURL && (
              <LinkButton
                emoji="📝"
                url={meeting.meetingURL}
                title="国会会議録検索システム"
              />
            )}
          </div>
        </div>
        <Comments meeting={meeting} user={user} />
      </div>
      <div className="flex flex-col gap-y-5 md:w-[calc(35%)]">
        {meeting.utterances.length !== 0 && (
          <Transcript
            meeting={meeting}
            currentWord={currentWord}
            player={playerRef.current}
          />
        )}
        {(!!meeting.apiURL && !!meeting.meetingURL) ||
        meeting.utterances.length > 0 ? (
          <Summarize user={user} meeting={meeting} />
        ) : null}
      </div>
    </div>
  );
}
