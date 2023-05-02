"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { tokenize } from "kuromojin";
import { getTokenizer } from "kuromojin";

getTokenizer({ dicPath: "/dict" });

const kanaToHira = (str: string) =>
  str.replace(/[\u30a1-\u30f6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );

const isKanji = (ch: string): boolean => {
  const unicode = ch.charCodeAt(0);
  return unicode >= 0x4e00 && unicode <= 0x9faf;
};

const Home: NextPage = () => {
  const [yomi, setYomi] = useState("");
  const [inputText, setInputText] = useState("");
  const [rubyVisible, setRubyVisible] = useState(true);

  const generateYomi = async (text: string) => {
    const tokens = await tokenize(text);
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
    setYomi(rubyArray.join(""));
  };

  const handleButtonClick = () => {
    generateYomi(inputText);
  };

  const toggleRubyVisibility = () => {
    setRubyVisible(!rubyVisible);
  };

  return (
    <div>
      <div>
        <label>テキスト入力:</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ width: "100%", minHeight: "100px" }}
        />
      </div>
      <div>
        <button onClick={handleButtonClick}>ルビを振る</button>
      </div>
      <div>
        <button onClick={toggleRubyVisibility}>
          {rubyVisible ? "ルビを非表示にする" : "ルビを表示する"}
        </button>
      </div>
      <div>
        <p
          dangerouslySetInnerHTML={{
            __html: rubyVisible ? yomi : inputText,
          }}
        />
      </div>
    </div>
  );
};

export default Home;
