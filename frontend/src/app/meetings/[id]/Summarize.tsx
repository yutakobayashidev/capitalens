"use client";

import { isKanji, kanaToHira } from "@src/helper/utils";
import { useKuromoji } from "@src/hooks/useKuromoji";
import { Meeting } from "@src/types/meeting";
import { AttentionIcon } from "@xpadev-net/designsystem-icons";
import { type Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export default function Summarize({
  meeting,
  user,
}: {
  meeting: Meeting;
  user: Session["user"];
}) {
  const [summary, setSummary] = useState<string>("");
  const [kids, setKids] = useState<string>("");
  const [ruby, setRuby] = useState<string>("");
  const [start, Summarystart] = useState<boolean>(false);
  const [copy, setCopy] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { isTokenizerReady, tokenizer } = useKuromoji();

  useEffect(() => {
    if (user && tokenizer) {
      setIsChecked(user.kids);
    }
  }, [user, tokenizer]);

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

  async function handleStreamResponse(response: Response) {
    const data = response.body;

    if (!data) {
      Summarystart(false);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { done: doneReading, value } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      if (isChecked) {
        setKids((prev) => (prev ? prev + chunkValue : chunkValue));
      } else {
        setSummary((prev) => (prev ? prev + chunkValue : chunkValue));
      }
    }
    Summarystart(false);
  }

  async function handleSyncResponse(response: Response) {
    const data = await response.json();
    setSummary(data.summary);
    setKids(data.kids);
    Summarystart(false);
  }

  const generateYomi = useCallback(
    async (text: string) => {
      if (!tokenizer) {
        // Use the tokenizer obtained from the custom hook
        console.error("Tokenizer not initialized");
        return;
      }

      const tokens = tokenizer.tokenize(text);

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
    },
    [tokenizer]
  );

  const applyRuby = useCallback(async () => {
    const text = kids ? kids : meeting.kids ? meeting.kids : "";
    const yomi = await generateYomi(text);
    setRuby(yomi !== undefined ? yomi : "");
  }, [kids, meeting.kids, generateYomi]);

  useEffect(() => {
    if (isChecked) {
      applyRuby();
    }
  }, [isChecked, applyRuby]);

  const handleSummarize = async () => {
    try {
      Summarystart(true);
      const response = await fetch("/api/summarize", {
        body: JSON.stringify({
          id: meeting.id,
          kids: isChecked,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType === "text/event-stream") {
        handleStreamResponse(response);
      } else {
        handleSyncResponse(response);
      }
    } catch (error) {
      console.error("Error occurred during summarization:", error);
    }
  };

  const handleCopy = () => {
    let textToCopy = "";

    if (isChecked) {
      textToCopy = kids ? kids : meeting.kids ? meeting.kids : "";
    } else {
      textToCopy = summary ? summary : meeting.summary ? meeting.summary : "";
    }

    copyTextToClipboard(textToCopy);
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };

  useEffect(() => {
    setCopy(false);
  }, [isChecked]);

  const displayText = (): string => {
    if (isChecked) {
      if (kids || meeting.kids) return ruby;
    } else {
      if (summary) return summary;
      if (meeting.summary) return meeting.summary;
    }
    return "「OpenAIで要約」ボタンをクリックしてください";
  };

  return (
    <div className="rounded-xl border border-gray-200 px-5 pb-4 pt-2">
      <h2 className="my-3 flex items-center gap-x-2 text-2xl font-bold">
        AIによるサマリー
      </h2>
      {(isChecked
        ? meeting.kids === null && kids === ""
        : meeting.summary === null && summary === "") && (
        <button
          onClick={handleSummarize}
          disabled={start}
          className="mb-3 flex items-center rounded-md bg-[#74aa9c] px-2 py-1.5 text-sm font-bold text-white disabled:bg-gray-200"
        >
          <SiOpenai className="mr-2" />
          OpenAIで要約
        </button>
      )}
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
      <div className="leading-5 text-gray-800">
        <ReactMarkdown
          className="prose text-sm"
          rehypePlugins={[
            rehypeRaw,
            [rehypeSanitize, { tagNames: ["p", "li", "ol", "ruby", "rt"] }],
          ]}
        >
          {displayText()}
        </ReactMarkdown>
      </div>
      {(meeting.summary || summary) && !start && (
        <button
          onClick={handleCopy}
          className="mt-3 flex items-center rounded-full border border-gray-200 px-4 py-2 font-medium"
        >
          {copy ? (
            "✨ コピーしました"
          ) : (
            <>
              <AiOutlineLink className="mr-1 text-2xl text-gray-400" />
              要約をコピーする
            </>
          )}
        </button>
      )}
      <div className="mt-3 flex items-center text-sm text-gray-500">
        <AttentionIcon
          width="1em"
          height="1em"
          fill="currentColor"
          className="text-xl text-red-400"
        />
        <div className="ml-1 text-xs">
          AIによる要約は間違いを含む可能性があります
        </div>
      </div>
    </div>
  );
}
