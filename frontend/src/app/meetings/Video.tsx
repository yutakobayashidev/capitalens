"use client";

import { FaTwitter } from "react-icons/fa";
import dayjs from "dayjs";
import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Member } from "@src/types/member";
import Speaker from "./Speaker";
import { useSearchParams } from "next/navigation";

type Annotation = {
  id: string;
  start_sec: number;
  speaker_name: string;
  speaker_info: string;
  time: string;
  member: Member | null;
};

type Diet = {
  house: string | null;
  m3u8_url: string;
  meeting_name: string;
  page_url: string;
  date: string;
  summary: string | null;
  meetingURL: string | null;
  annotations: Annotation[];
};

export default function Video({ meeting }: { meeting: Diet }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<Member | null>(null);
  const searchParams = useSearchParams();
  const [currentTime, setCurrentTime] = useState<number>(0);

  const startSec = searchParams?.get("t");

  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        language: "ja",
        sources: [
          {
            src: meeting.m3u8_url,
            type: "application/x-mpegURL",
          },
        ],
      });

      player.on("loadedmetadata", function () {
        if (startSec) {
          player.currentTime(parseFloat(startSec));
        }
      });

      player.on("timeupdate", function () {
        setCurrentTime(player.currentTime());
        const currentTime = player.currentTime();
        for (let i = meeting.annotations.length - 1; i >= 0; i--) {
          let annotation = meeting.annotations[i];
          if (currentTime >= annotation.start_sec) {
            if (annotation.speaker_name !== (currentSpeaker?.name ?? "")) {
              setCurrentSpeaker(annotation.member);
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

      // Keyboard event listener
      const keyDownHandler = (event: KeyboardEvent) => {
        const skipTime = 10; // 10 seconds

        // Right arrow key
        if (event.keyCode === 39) {
          player.currentTime(player.currentTime() + skipTime);
        }
        // Left arrow key
        else if (event.keyCode === 37) {
          player.currentTime(player.currentTime() - skipTime);
        } else if (event.keyCode === 32) {
          if (player.paused()) {
            player.play();
          } else {
            player.pause();
          }
          event.preventDefault(); // This line will prevent the default action of the space key
        }
      };

      // Add the event listener
      window.addEventListener("keydown", keyDownHandler);

      // Cleanup function
      return () => {
        window.removeEventListener("keydown", keyDownHandler);
      };
    }
  }, [meeting, currentSpeaker, startSec]);

  const MAX_TWEET_LENGTH = 140;
  const TWITTER_SHORTENED_URL_LENGTH = 23;
  const ellipsis = "...";
  const baseText = "参議院 国土交通委員会 第5号\n\n";
  const url = "https://parliament-data.vercel.app/meetings";

  // summaryが長い場合は途中で切り、代わりに"..."を追加します。
  function truncateSummary(summary: string, maxChars: number): string {
    if (summary.length > maxChars) {
      return summary.slice(0, maxChars - ellipsis.length) + ellipsis;
    }

    return summary;
  }

  return (
    <>
      <div>
        <video controls ref={videoRef} className="video-js" />
      </div>
      <div className="flex items-center justify-between my-5">
        <h1 className="text-2xl font-bold items-center flex">
          <span
            className={`${
              meeting.house === "COUNCILLORS" ? "bg-[#007ABB]" : "bg-[#EA5433]"
            } text-white rounded font-bold mr-2 text-xl py-1 px-2`}
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
      {currentSpeaker && <Speaker currentSpeaker={currentSpeaker} />}
      <div className="bg-gray-100 px-4 pt-4 pb-6 mb-5 md:mb-5 rounded-xl">
        <div className="flex items-center mb-3 justify-between">
          <div className="flex items-center text-base">
            <span className="mr-2 font-medium">
              {dayjs(meeting.date).format("YYYY年MM月DD日")}
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
                  if (videoRef.current) {
                    const player = videojs(videoRef.current);
                    player.currentTime(annotation.start_sec);
                    player.play();
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
          <a
            href={meeting.page_url}
            className="md:p-10 px-2 py-8 bg-white text-xl justify-center text-gray-800 transition-all duration-500 ease-in-out hover:shadow-md flex font-bold items-center border rounded-xl"
          >
            <span className="text-4xl mr-3">📺</span>
            {meeting.house === "COUNCILLORS" ? "インターネット審議中継" : ""}
          </a>
          {meeting.meetingURL && (
            <a
              href={meeting.meetingURL}
              className="md:p-10 px-2 py-8 text-xl justify-center bg-white text-gray-800 transition-all duration-500 ease-in-out hover:shadow-md flex font-bold items-center border rounded-xl"
            >
              <span className="text-4xl mr-3">📝</span>
              国会会議録検索システム
            </a>
          )}
        </div>
      </div>
    </>
  );
}
