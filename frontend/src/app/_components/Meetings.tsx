"use client";

import { Meeting } from "@src/types/meeting";
import { SiOpenai } from "react-icons/si";
import { useState, useEffect, useCallback } from "react";
import { SpeechRecord } from "@src/types/meeting";
import { Fragment } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { getCommitteeUrl } from "@src/helper/member";
import * as kuromoji from "kuromoji";

dayjs.locale("ja");

let tokenizerInstance: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | undefined;
kuromoji.builder({ dicPath: "/dict" }).build((err, tokenizer) => {
  if (err) {
    console.log(err);
  } else {
    tokenizerInstance = tokenizer;
  }
});

interface Props {
  meetings: Meeting;
}

class APIError extends Error {}

const Meetings: React.FC<Props> = ({ meetings }) => {
  const [summally, setSummallyId] = useState<string | null>(null);
  const [api, setAPIKey] = useState<string | null>(null);
  const [copy, setCopy] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [translatedSummaries, setTranslatedSummaries] = useState<{
    [issueID: string]: string;
  }>({});
  const [isSummaryReady, setIsSummaryReady] = useState<{
    [issueID: string]: boolean;
  }>({});

  const [start, Setstart] = useState(false);

  const kanaToHira = (str: string) =>
    str.replace(/[\u30a1-\u30f6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );

  const isKanji = (ch: string): boolean => {
    const unicode = ch.charCodeAt(0);
    return unicode >= 0x4e00 && unicode <= 0x9faf;
  };

  const generateYomi = useCallback(async (text: string) => {
    if (!tokenizerInstance) {
      console.error("Tokenizer not initialized");
      return;
    }

    const tokens = tokenizerInstance.tokenize(text);
    const rubyArray = tokens.map((token) => {
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
    });
    return rubyArray.join("");
  }, []);

  const [rubySummaries, setRubySummaries] = useState<{
    [issueID: string]: string;
  }>({});

  const applyRuby = useCallback(async () => {
    for (const issueID in translatedSummaries) {
      const yomi = await generateYomi(translatedSummaries[issueID]);
      setRubySummaries((prevState) => ({
        ...prevState,
        [issueID]: yomi !== undefined ? yomi : "",
      }));
    }
  }, [translatedSummaries, generateYomi]);

  useEffect(() => {
    if (isChecked) {
      applyRuby();
    }
  }, [isChecked, applyRuby]);

  const callAI = async (records: SpeechRecord[], issueID: string) => {
    if (!api) {
      alert("No API Key");
    }

    const speeches = records
      .slice(1)
      .map((record) => JSON.stringify(record.speech));

    Setstart(true);

    try {
      await fetchEventSource("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `入力された国会の議事録を要約してください。\n制約条件${
                isChecked
                  ? "\n- 小学生のために、国会議事録の議題の進行を、お話や物語に例えて説明してください。議員の名前などはそのまま、出来事を簡単な言葉で表現してみてください。"
                  : "\n- 文章は簡潔にわかりやすく。\n- 箇条書きでで出力。\n- 名前や日付など、その他重要なキーワードは取り逃がさない"
              }`,
            },
            { role: "user", content: speeches.join("\n") },
          ],
          stream: true,
        }),
        async onopen(response) {
          if (response.status >= 400) {
            const res = await response.json();
            const errMessage =
              res.error?.message || response.statusText || response.status;

            throw new APIError(errMessage);
          }
        },
        onmessage(ev) {
          if (ev.data === "[DONE]") {
            Setstart(false);
            setIsSummaryReady((prevState) => ({
              ...prevState,
              [issueID]: true,
            }));
            return;
          }

          const data = JSON.parse(ev.data);
          const content = data.choices?.[0]?.delta?.content;
          if (content) {
            setTranslatedSummaries((prevState) => ({
              ...prevState,
              [issueID]: prevState[issueID]
                ? prevState[issueID] + content
                : content,
            }));
          }
        },
        onerror(err) {
          throw err;
        },
      });
    } catch (err: any) {
      alert(err.message);
    }

    Setstart(false);
  };

  function copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  return (
    <>
      <p className="text-sm mb-3 text-gray-500">
        ※ OpenAI
        APIに直接アクセスするため、APIトークンの保存などは行っていません。
      </p>
      <label className="flex items-center mb-3">
        <input
          type="checkbox"
          className="mr-2"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        子ども向けに説明
      </label>
      <input
        onChange={(e) => setAPIKey(e.target.value)}
        className="w-full mb-3 block resize-none rounded-md border-2 border-gray-200 bg-gray-100 px-4 py-2  "
        placeholder="OpenAIのAPIキーを入力..."
      ></input>
      {meetings.meetingRecord.map((meeting) => (
        <div key={meeting.issueID}>
          <div className="text-2xl font-semibold mb-3 flex items-center justify-between">
            <a href={meeting.meetingURL} className="flex-1">
              <span
                className={`${
                  meeting.nameOfHouse === "参議院"
                    ? "bg-[#007ABB]"
                    : "bg-[#EA5433]"
                } text-white text-lg rounded-md font-bold mr-3 px-3 py-1.5`}
              >
                {meeting.nameOfHouse}
              </span>
              {meeting.nameOfMeeting} {meeting.issue}{" "}
              {dayjs(meeting.date).format("YY/MM/DD")}
            </a>
            <button
              onClick={() => {
                setSummallyId(meeting.issueID);
                callAI(meeting.speechRecord, meeting.issueID);
              }}
              disabled={!api || start}
              className="disabled:bg-gray-200 flex rounded-md items-center text-white bg-[#74aa9c] px-2 py-1.5 text-lg"
            >
              <SiOpenai className="mr-2" />
              要約する
            </button>
          </div>
          <a
            className="mb-3 text-[#0f41af] hover:underline hover:text-[#222] block"
            href={getCommitteeUrl(meeting.nameOfMeeting) ?? ""}
          >
            {meeting.nameOfMeeting}の名簿を確認
          </a>
          {meeting.issueID == summally && (
            <>
              {translatedSummaries[meeting.issueID] && (
                <div className="bg-gray-50 leading-7 border mb-3 rounded-lg ext-base p-4">
                  {translatedSummaries[meeting.issueID]
                    .split(/\n/)
                    .map((item, index) => {
                      const text = isChecked
                        ? rubySummaries[meeting.issueID]
                        : item;
                      return (
                        <Fragment key={index}>
                          <span dangerouslySetInnerHTML={{ __html: text }} />
                          <br />
                        </Fragment>
                      );
                    })}
                  {isSummaryReady[meeting.issueID] && (
                    <button
                      onClick={() => {
                        copyTextToClipboard(
                          translatedSummaries[meeting.issueID]
                        );
                        setCopy(true);
                      }}
                      className="border mt-3 rounded-md px-4 py-2 font-semibold"
                    >
                      {copy ? "✨ コピーしました" : "📋 要約をコピーする"}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default Meetings;
