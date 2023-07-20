"use client";

import { Switch } from "@headlessui/react";
import { isKanji, kanaToHira } from "@src/helper/utils";
import { useKuromoji } from "@src/hooks/useKuromoji";
import { Meeting } from "@src/types/meeting";
import { ChildOutlinedIcon } from "@xpadev-net/designsystem-icons";
import cn from "classnames";
import { type Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
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
        <Switch
          checked={isChecked}
          onChange={setIsChecked}
          className={`relative block h-[25px] w-[60px] rounded-full ${
            isChecked ? "bg-cyan-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute flex items-center justify-center ${
              isChecked ? "left-[30px]" : "left-0"
            } top-1/2 block h-8 w-8 -translate-y-1/2 rounded-full bg-white shadow-md transition-all duration-200`}
          >
            <ChildOutlinedIcon
              className={isChecked ? "fill-cyan-500" : "fill-gray-300"}
            />
          </div>
        </Switch>
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
      <div className="mt-5 flex justify-end">
        {(meeting.summary || summary) && !start && (
          <button
            onClick={handleCopy}
            disabled={copy}
            className={cn(
              "flex items-center rounded-full border-gray-200 px-3 py-2 text-sm font-medium text-gray-400 duration-100 ease-out",
              !copy && "hover:bg-gray-100"
            )}
          >
            {copy ? (
              "✨ コピーしました"
            ) : (
              <>
                <FiCopy className="mr-1" />
                要約をコピー
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
