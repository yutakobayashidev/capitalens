import { convertSecondsToTime } from "@src/helper/utils";
import { Meeting } from "@src/types/meeting";
import dayjs from "dayjs";
import Player from "video.js/dist/types/player";

const formatSeconds = (secs: number) => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const result = [];
  if (hours > 0) result.push(`${hours}時間`);
  if (minutes > 0) result.push(`${minutes}分`);
  return result.join("");
};

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

export default function Description({
  meeting,
  player,
}: {
  meeting: Meeting;
  player: Player | null;
}) {
  return (
    <div className="rounded-xl bg-gray-100 px-4 pb-6 pt-4">
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
      <h2 className="text-xl font-bold">スピーカー</h2>
      <div className="my-3">
        {meeting.annotations.map((annotation) => (
          <div className="mb-0.5 flex" key={annotation.id}>
            <button
              className="text-primary"
              data-start-sec={annotation.start_sec}
              onClick={() => {
                if (player) {
                  player.currentTime(annotation.start_sec);
                  player.play();
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
                    if (player) {
                      player.currentTime(question.start);
                      player.play();
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
  );
}
