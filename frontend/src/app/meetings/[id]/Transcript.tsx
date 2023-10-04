import { convertSecondsToTime } from "@src/helper/utils";
import { Meeting, Word } from "@src/types/meeting";
import { SearchIcon } from "@xpadev-net/designsystem-icons";
import Avatar from "boring-avatars";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import Player from "video.js/dist/types/player";

type TranscriptProps = {
  currentWord: string | null;
  meeting: Meeting;
  player: Player | null;
};

function Word({
  currentWord,
  player,
  word,
  wordRef,
}: {
  currentWord: string | null;
  player: Player | null;
  word: Word;
  wordRef: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      className={cn("p-4 flex flex-1 items-start", {
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
      <div className="mr-2.5">
        {word.member && word.member.image ? (
          <div className="relative h-[40px] w-[40px]">
            <img
              alt={word.member.name}
              src={word.member.image}
              className="absolute left-0 top-0 h-full w-full rounded-full border object-cover"
            />
          </div>
        ) : (
          <Avatar
            size={40}
            name={word.speaker || "不明な話者"}
            variant="beam"
            colors={["#FFBD87", "#FFD791", "#F7E8A6", "#D9E8AE", "#BFE3C0"]}
          />
        )}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-x-1">
          <p className="font-bold">
            {word.member
              ? word.member.name
              : word.speaker
              ? word.speaker
              : "不明な話者"}
          </p>
          <span className="text-sm text-gray-400">
            {convertSecondsToTime(word.start)}
          </span>
        </div>
        <div>{word.text}</div>
      </div>
    </div>
  );
}

export default function Transcript({
  currentWord,
  meeting,
  player,
}: TranscriptProps) {
  const wordRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [disableAutoScroll, setDisableAutoScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeakerNames, setSelectedSpeakerNames] = useState<string[]>(
    []
  );
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
        .filter(
          (word) =>
            !selectedSpeakerNames.length ||
            (word.member && selectedSpeakerNames.includes(word.member.name)) ||
            (word.speaker && selectedSpeakerNames.includes(word.speaker))
        )
    );
  }, [searchQuery, meeting.utterances, selectedSpeakerNames]);

  const handleScroll = () => {
    if (wordRef.current && parentRef.current && currentWord) {
      const wordRect = wordRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const offset = wordRect.top - parentRect.top;

      if (Math.abs(offset) > 315) {
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

  const speakers = meeting.utterances
    .flatMap((utterance) => utterance.words)
    .map((word) => word.member || { name: word.speaker, image: null })
    .filter(
      (value, index, self) =>
        value && self.findIndex((m) => m && m.name === value.name) === index
    );

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
          placeholder="文字起こしを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mt-2 flex items-center gap-x-2 overflow-x-auto whitespace-nowrap px-4 py-2">
        {speakers.map((speaker) => {
          if (!speaker || !speaker.name) {
            return null;
          }

          const speakerName = speaker.name; // Ensure speaker.name is not null here

          return (
            <button
              key={speaker.name}
              className={cn(
                "relative flex items-center rounded-full px-2 py-1",
                selectedSpeakerNames.includes(speaker.name)
                  ? "bg-blue-300 font-semibold text-white"
                  : "bg-gray-200 font-medium text-gray-600"
              )}
              onClick={() =>
                setSelectedSpeakerNames((prevSpeakerNames) => {
                  if (prevSpeakerNames.includes(speakerName)) {
                    return prevSpeakerNames.filter(
                      (name) => name !== speakerName
                    ); // If already selected, remove the name
                  } else {
                    return [...prevSpeakerNames, speakerName]; // Add the name
                  }
                })
              }
            >
              <div className="absolute left-[0px] top-[-0px]">
                {speaker.image ? (
                  <div className="relative h-[32px] w-[32px]">
                    <img
                      alt={speaker.name}
                      src={speaker.image}
                      className="absolute left-0 top-0 h-full w-full rounded-full border object-cover"
                    />
                  </div>
                ) : (
                  <Avatar
                    size={32}
                    name={speaker.name}
                    variant="beam"
                    colors={[
                      "#FFBD87",
                      "#FFD791",
                      "#F7E8A6",
                      "#D9E8AE",
                      "#BFE3C0",
                    ]}
                  />
                )}
              </div>
              <span className="ml-7">{speaker.name}</span>
            </button>
          );
        })}
      </div>
      <div
        className="hidden-scrollbar h-[315px] overflow-y-auto"
        ref={parentRef}
        onScroll={handleScroll}
      >
        {filteredWords.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div className="items-center px-4 text-gray-500">
              <p className="mb-3">一致する検索結果がありません</p>
            </div>
          </div>
        ) : (
          filteredWords.map((word, i) => (
            <Word
              key={i}
              player={player}
              word={word}
              wordRef={wordRef}
              currentWord={currentWord}
            />
          ))
        )}
      </div>
    </div>
  );
}
