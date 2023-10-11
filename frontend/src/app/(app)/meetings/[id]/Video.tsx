"use client";

import MemberCard from "@src/components/member-card/member-card";
import Notes from "@src/components/notes/notes";
import {
  hasDurationPassedSinceCreation,
  twoWeeksInMilliseconds,
} from "@src/helper/utils";
import { Meeting } from "@src/types/meeting";
import { Member } from "@src/types/member";
import cn from "classnames";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { type Session } from "next-auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPencilAlt, FaShare } from "react-icons/fa";
import type Player from "video.js/dist/types/player";

import Comments from "./Comments";
import Description from "./Description";
import NoteModal from "./NoteModal";
import { options } from "./options";
import VideoJSPlayer from "./Player";
import ShareModal from "./ShareModal";
import Summarize from "./Summarize";
import Transcript from "./Transcript";
import { useShareTimeInput } from "./useShareTimeInput";

type Note = {
  end: number;
  start: number;
  text: string;
};

type Marker = {
  color: string | null;
  label: string;
  time: number;
};

dayjs.extend(utc);
dayjs.extend(duration);

export const convertTimeToSeconds = (time: string): number => {
  const parts = time.split(":").reverse();
  let seconds = 0;
  parts.forEach((part, index) => {
    seconds += parseInt(part, 10) * Math.pow(60, index);
  });
  return seconds;
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
  const [currentNote, setCurrentNote] = useState<Note | null>(null); // 追加
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareOpen] = useState(false);
  const searchParams = useSearchParams();
  const startSec = searchParams?.get("t");
  const endSec = searchParams?.get("e");

  useEffect(() => {
    const newTime = playerRef.current?.currentTime();

    if (typeof newTime === "undefined") return;

    const matchedNote = meeting.notes.find(
      (note) => newTime >= note.start && newTime <= note.end
    );

    if (matchedNote) {
      setCurrentNote(matchedNote);
    } else {
      setCurrentNote(null);
    }
  }, [meeting.notes]);

  const {
    currentShareTime,
    handleBlur,
    handleChange,
    initializeInputValue,
    inputValue,
  } = useShareTimeInput(currentTime);

  const {
    currentShareTime: StartTime,
    handleBlur: startBluer,
    handleChange: startChange,
    initializeInputValue: initializeStartInputValue,
    inputValue: inputStartInputValue,
  } = useShareTimeInput(currentTime);

  const {
    currentShareTime: EndTime,
    handleBlur: endBluer,
    handleChange: endChange,
    initializeInputValue: initializeEndInputValue,
    inputValue: inputEndInputValue,
  } = useShareTimeInput(currentTime);

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

  const handleTimeUpdate = (player: Player) => {
    const newTime = player.currentTime();

    if (typeof newTime === "undefined") return;

    setCurrentTime(newTime);

    const matchedNote = meeting.notes.find(
      (note) => newTime >= note.start && newTime <= note.end
    );

    if (matchedNote) {
      setCurrentNote(matchedNote); // 時間範囲内にある場合、そのtext情報を格納
    } else {
      setCurrentNote(null); // 時間範囲外にある場合、nullに戻す
    }
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
  };

  const handleLoadedMetadata = (player: Player) => {
    // @ts-expect-error
    const p = player.controlBar.progressControl.children_[0].el_;

    const createMarkers = () => {
      const questionMarkers = meeting.questions.map((question) => ({
        color: "blue",
        label: question.title,
        time: question.start,
      }));

      const timeMarkers: Marker[] = [];

      if (startSec) {
        timeMarkers.push({
          color: "yellow",
          label: "開始",
          time: parseFloat(startSec),
        });
      }

      if (endSec) {
        timeMarkers.push({
          color: "yellow",
          label: "終了",
          time: parseFloat(endSec),
        });
      }

      return [...questionMarkers, ...timeMarkers];
    };

    createMarkers().forEach((marker) => {
      const total = player.duration();
      if (typeof total === "undefined") return;

      const left = (marker.time / total) * 100 + "%";
      const el = document.createElement("div");
      el.className = "vjs-marker";
      el.style.left = left;
      el.dataset.time = marker.time.toString();
      if (marker.color) el.dataset.color = marker.color;

      el.innerHTML = `<span>${marker.label}</span>`;
      el.addEventListener("click", () => player.currentTime(marker.time));
      p.append(el);
    });

    if (startSec) {
      player.currentTime(parseFloat(startSec));
    } else if (meeting.utterances[0]) {
      player.currentTime(meeting.utterances[0].start);
    }
  };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;
    player.on("timeupdate", () => handleTimeUpdate(player));
    player.on("loadedmetadata", () => handleLoadedMetadata(player));
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
    initializeStartInputValue(currentTime);
    initializeEndInputValue(currentTime + 10);
  };

  const handleShare = () => {
    initializeInputValue(currentTime);
    setIsShareOpen(!isShareModalOpen);
  };

  return (
    <>
      <div className="my-7 block justify-center md:flex">
        <div className="space-y-5 md:mr-5 md:w-[calc(65%)]">
          <VideoJSPlayer
            options={options(meeting.m3u8_url)}
            onReady={handlePlayerReady}
          />
          {currentNote && <Notes note={currentNote} />}
          <div className="flex items-center justify-between overflow-x-auto">
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
            <div className="hidden items-center gap-x-3 md:flex">
              <button
                onClick={handleShare}
                className="flex items-center rounded-full border px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
              >
                <FaShare className="mr-2  text-lg" />
                シェア
              </button>
              {user &&
                hasDurationPassedSinceCreation(
                  user.createdAt,
                  twoWeeksInMilliseconds
                ) && (
                  <button
                    onClick={handleModal}
                    className="flex items-center rounded-full border px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                  >
                    <FaPencilAlt className="mr-2  text-lg" />
                    ノートを作成
                  </button>
                )}
            </div>
          </div>
          <div className="flex items-center gap-x-3 md:hidden">
            <button
              onClick={handleShare}
              className="flex items-center rounded-full border px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
            >
              <FaShare className="mr-2  text-lg" />
              シェア
            </button>
            {user &&
              hasDurationPassedSinceCreation(
                user.createdAt,
                twoWeeksInMilliseconds
              ) && (
                <button
                  onClick={handleModal}
                  className="flex items-center rounded-full border px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200"
                >
                  <FaPencilAlt className="mr-2  text-lg" />
                  ノートを作成
                </button>
              )}
          </div>
          {currentSpeaker && <MemberCard member={currentSpeaker} />}
          <Description meeting={meeting} player={playerRef.current} />
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
      <ShareModal
        currentShareTime={currentShareTime}
        handleBlur={handleBlur}
        handleChange={handleChange}
        inputValue={inputValue}
        isShareModalOpen={isShareModalOpen}
        meeting={meeting}
        setIsShareOpen={setIsShareOpen}
      />
      <NoteModal
        endBluer={endBluer}
        endChange={endChange}
        EndTime={EndTime}
        inputEndInputValue={inputEndInputValue}
        inputStartInputValue={inputStartInputValue}
        isOpen={isModalOpen}
        meeting={meeting}
        setIsOpen={setIsModalOpen}
        startBluer={startBluer}
        startChange={startChange}
        StartTime={StartTime}
      />
    </>
  );
}
