"use client";

import { FaTwitter } from "react-icons/fa";
import dayjs from "dayjs";
import { useRef, useEffect, useState, useCallback } from "react";
import { Member } from "@src/types/member";
import Speaker from "./Speaker";
import Player from "video.js/dist/types/player";
import { useSearchParams } from "next/navigation";
import { config } from "@site.config";
import { type Session } from "next-auth";
import Comments from "./Comments";
import { Meeting } from "@src/types/meeting";
import { options } from "./options";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import Summarize from "./Summarize";
import { SearchIcon } from "@xpadev-net/designsystem-icons";
import VideoJSPlayer from "./Player";

dayjs.extend(utc);
dayjs.extend(duration);

function LinkButton({
  url,
  title,
  emoji,
}: {
  url: string;
  title: string;
  emoji: string;
}) {
  return (
    <a
      href={url}
      className="md:p-10 px-2 py-8 bg-white text-xl justify-center text-gray-800 transition-all duration-500 ease-in-out hover:shadow-md flex font-bold items-center border rounded-xl"
    >
      <span className="text-4xl mr-3">{emoji}</span>
      {title}
    </a>
  );
}

export default function Video({
  meeting,
  user,
}: {
  meeting: Meeting;
  user: Session["user"];
}) {
  const playerRef = useRef<Player | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [currentSpeaker, setCurrentSpeaker] = useState<Member | null>(null);
  const [currentSpeakerInfo, setCurrentSpeakerInfo] = useState<string | null>(
    null
  );
  const [disableAutoScroll, setDisableAutoScroll] = useState(false);
  const searchParams = useSearchParams();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const startSec = searchParams?.get("t");
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWords, setFilteredWords] = useState(
    meeting.utterances.flatMap((utterance) => utterance.words)
  );

  const handleScroll = () => {
    if (wordRef.current && parentRef.current && currentWord) {
      const wordRect = wordRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const offset = wordRect.top - parentRect.top;

      if (Math.abs(offset) > 400) {
        // Disable auto-scroll if the user scrolls beyond a 100px distance from the current word position
        setDisableAutoScroll(true);
      } else {
        // Enable auto-scroll if the user scrolls within a 100px distance from the current word position
        setDisableAutoScroll(false);
      }
    }
  };

  const updateCurrentWord = useCallback(
    (time: number) => {
      let found = false;

      // Find the word in the utterances.
      for (let i = 0; i < meeting.utterances.length; i++) {
        for (let j = 0; j < meeting.utterances[i].words.length; j++) {
          if (
            time >= meeting.utterances[i].words[j].start &&
            time < meeting.utterances[i].words[j].end
          ) {
            setCurrentWord(meeting.utterances[i].words[j].text);
            found = true;
            break;
          }
        }
        if (found) {
          break;
        }
      }

      // If no word was found for the current time, unset the current word.
      if (!found) {
        setCurrentWord(null);
      }
    },
    [meeting.utterances]
  );

  const updateCurrentTime = useCallback(
    (time: number) => {
      setCurrentTime(time);
      updateCurrentWord(time);
    },
    [updateCurrentWord]
  );

  const MAX_TWEET_LENGTH = 140;
  const TWITTER_SHORTENED_URL_LENGTH = 23;
  const ellipsis = "...";
  const baseText = `${meeting.house === "COUNCILLORS" ? "参議院" : "衆議院"} ${
    meeting.meeting_name
  }\n\n`;
  const url = `${config.siteRoot}meetings/${meeting.id}`;

  function truncateSummary(summary: string, maxChars: number): string {
    if (summary.length > maxChars) {
      return summary.slice(0, maxChars - ellipsis.length) + ellipsis;
    }

    return summary;
  }

  useEffect(() => {
    if (wordRef.current && parentRef.current && !disableAutoScroll) {
      const wordRect = wordRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();

      let offset = wordRect.top - parentRect.top - parentRect.height / 2;
      offset += parentRef.current.scrollTop; // add the current scroll position of the parent element

      offset = Math.max(offset, 0);
      offset = Math.min(
        offset,
        parentRef.current.scrollHeight - parentRect.height
      );

      parentRef.current.scrollTo(0, offset);
    }
  }, [currentWord, disableAutoScroll]);

  useEffect(() => {
    setFilteredWords(
      meeting.utterances
        .flatMap((utterance) => utterance.words)
        .filter((word) =>
          word.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery, meeting.utterances]);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    player.on("timeupdate", function () {
      const currentTime = player.currentTime();
      setCurrentTime(currentTime);
      updateCurrentTime(player.currentTime());
      for (let i = meeting.annotations.length - 1; i >= 0; i--) {
        let annotation = meeting.annotations[i];
        if (currentTime >= annotation.start_sec) {
          if (annotation.speaker_name !== (currentSpeaker?.name ?? "")) {
            setCurrentSpeaker(annotation.member);
            setCurrentSpeakerInfo(annotation.speaker_info);
          }
          break;
        }
      }
    });

    player.on("seeked", function () {
      const currentTime = player.currentTime();
      if (currentTime < meeting.annotations[0].start_sec) {
        setCurrentSpeaker(null);
      }
    });

    player.on("loadedmetadata", function () {
      if (startSec) {
        player.currentTime(parseFloat(startSec));
      } else if (meeting.utterances[0].words[0]) {
        player.currentTime(meeting.utterances[0].words[0].start);
      }
    });
  };

  return (
    <div className="md:flex block justify-center my-7">
      <div className="md:w-[calc(65%)] md:mr-5">
        <VideoJSPlayer
          options={options(meeting.m3u8_url)}
          onReady={handlePlayerReady}
        />
        <div className="flex items-center justify-between my-5">
          <h1 className="text-2xl font-bold items-center flex">
            <span
              className={`${
                meeting.house === "COUNCILLORS"
                  ? "bg-indigo-400"
                  : "bg-[#EA5433]"
              } text-white rounded font-bold mr-2 text-base py-1 px-2`}
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
            className="bg-[#00acee] hidden text-sm text-white md:inline-flex items-center font-semibold px-4 py-2 rounded-full"
          >
            <FaTwitter className="mr-2" />
            ツイートする
          </a>
        </div>
        {currentSpeaker && (
          <Speaker
            currentSpeaker={currentSpeaker}
            speakerInfo={currentSpeakerInfo}
          />
        )}
        <div className="bg-gray-100 px-4 pt-4 pb-6 mb-5 rounded-xl">
          <div className="flex items-center mb-3 justify-between">
            <div className="flex items-center text-base">
              <span className="mr-2 font-medium">
                {dayjs(meeting.date).format("YYYY/MM/DD")}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold">チャプター</h2>
          <div className="my-3">
            {meeting.annotations.map((annotation) => (
              <div className="flex" key={annotation.id}>
                <button
                  className={`text-primary`}
                  data-start-sec={annotation.start_sec}
                  onClick={() => {
                    if (playerRef.current) {
                      playerRef.current.currentTime(annotation.start_sec);
                      playerRef.current.play();
                    }
                  }}
                >
                  {annotation.time}
                </button>
                <p className="ml-2">
                  {annotation.speaker_name} ({annotation.speaker_info})
                </p>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold mb-3">関連リンク</h2>
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
      <div className="flex-1 flex flex-col gap-y-5">
        {(!!meeting.apiURL && !!meeting.meetingURL) ||
        meeting.utterances.length > 0 ? (
          <Summarize user={user} meeting={meeting} />
        ) : null}
        {meeting.utterances.length !== 0 && (
          <div className="border rounded-xl border-gray-200 pt-2">
            <h2 className="text-2xl font-bold my-3 px-4 gap-x-2">
              文字起こし (自動生成)
            </h2>
            <div className="px-4 flex py-2 text-gray-600 items-center">
              <SearchIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block mr-2 text-2xl"
              />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="文字起こしを検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div
              className="overflow-y-auto hidden-scrollbar h-[400px]"
              ref={parentRef}
              onScroll={handleScroll}
            >
              {filteredWords.length === 0 ? (
                <div className="flex justify-center items-center h-full text-center">
                  <div className="px-4 text-gray-500 items-center">
                    <p className="mb-3">一致する検索結果がありません</p>
                    <img
                      src="/m_03_white.png"
                      height={100}
                      width={400}
                      alt="Alert"
                    />
                  </div>
                </div>
              ) : (
                filteredWords.map((word, i) => (
                  <div
                    key={i}
                    className={`p-4 ${
                      word.text === currentWord ? "bg-gray-100" : ""
                    }`}
                    ref={word.text === currentWord ? wordRef : null}
                    onClick={() => {
                      if (playerRef.current) {
                        playerRef.current.currentTime(word.start);
                        playerRef.current.play();
                      }
                    }}
                  >
                    <p className="inline-block bg-blue-100 px-2 py-0.5 text-xs text-blue-500 rounded mb-1 font-semibold">
                      {dayjs
                        .utc(
                          dayjs
                            .duration(
                              dayjs().diff(
                                dayjs().subtract(word.start, "seconds")
                              )
                            )
                            .asMilliseconds()
                        )
                        .format("m:ss")}
                    </p>
                    <div>{word.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
