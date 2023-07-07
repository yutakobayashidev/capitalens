import { Meeting } from "@src/types/meeting";
import { SearchIcon } from "@xpadev-net/designsystem-icons";
import cn from "classnames";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Player from "video.js/dist/types/player";

type TranscriptProps = {
  currentWord: string | null;
  meeting: Meeting;
  player: Player | null;
};

export default function Transcript({
  currentWord,
  meeting,
  player,
}: TranscriptProps) {
  const wordRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [disableAutoScroll, setDisableAutoScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWords, setFilteredWords] = useState(
    meeting.utterances.flatMap((utterance) => utterance.words)
  );

  useEffect(() => {
    setFilteredWords(
      meeting.utterances
        .flatMap((utterance) => utterance.words)
        .filter((word) =>
          word.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery, meeting.utterances]);

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

  return (
    <div className="rounded-xl border border-gray-200 pt-2">
      <h2 className="my-3 gap-x-2 px-4 text-2xl font-bold">
        文字起こし (自動生成)
      </h2>
      <div className="flex items-center px-4 py-2 text-gray-600">
        <SearchIcon
          width="1em"
          height="1em"
          fill="currentColor"
          className="mr-2 inline-block text-2xl"
        />
        <input
          className="w-full bg-transparent outline-none"
          placeholder="文字起こしを検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div
        className="hidden-scrollbar h-[400px] overflow-y-auto"
        ref={parentRef}
        onScroll={handleScroll}
      >
        {filteredWords.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div className="items-center px-4 text-gray-500">
              <p className="mb-3">一致する検索結果がありません</p>
              <img src="/m_03_white.png" height={100} width={400} alt="Alert" />
            </div>
          </div>
        ) : (
          filteredWords.map((word, i) => (
            <div
              key={i}
              className={cn("p-4", {
                "bg-gray-100": word.text === currentWord,
              })}
              ref={word.text === currentWord ? wordRef : null}
              onClick={() => {
                if (player) {
                  player.currentTime(word.start);
                  player.play();
                }
              }}
            >
              <p className="mb-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-500">
                {dayjs
                  .utc(
                    dayjs
                      .duration(
                        dayjs().diff(dayjs().subtract(word.start, "seconds"))
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
  );
}
