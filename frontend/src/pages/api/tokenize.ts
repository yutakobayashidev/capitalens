import { tokenize } from "kuromojin";
import { NextApiRequest, NextApiResponse } from "next";

type FrequencyMap = Record<string, number>;

async function getSpeechText(name: string): Promise<string> {
  const endpoint = "https://kokkai.ndl.go.jp/api/1.0/speech";
  const params: Record<string, string> = {
    recordPacking: "json",
    speaker: name,
  };
  const url = new URL(endpoint);
  Object.entries(params).forEach(([key, value]: [string, string]) =>
    url.searchParams.append(key, value)
  );
  const speeches = (
    await (await fetch(url.toString())).json()
  ).speechRecord.map((speech: { speech: string }) => speech.speech);
  return speeches.map((s: string) => s.replace(/^○\S+\s/, "")).join("");
}

async function getNouns(text: string): Promise<string[]> {
  const tokens = await tokenize(text);
  const nounTokens = tokens.filter((token) => {
    const pos = token.pos;
    const surface_form = token.surface_form;

    // 一般的すぎる単語を除外する
    if (
      pos === "名詞" &&
      ![
        "これ",
        "それ",
        "あれ",
        "ここ",
        "こと",
        "そこ",
        "あそこ",
        "どこ",
        "こちら",
        "そちら",
        "あちら",
        "人",
        "〇",
        "％",
        "よう",
        "わけ",
        "たち",
        "フル",
      ].includes(surface_form)
    ) {
      return true;
    }
    return false;
  });
  return nounTokens.map((token) => token.surface_form);
}

async function getFrequencyMap(words: string[]): Promise<FrequencyMap> {
  const freqMap = words.reduce<FrequencyMap>((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {});
  return freqMap;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.name as string;
  const text = await getSpeechText(name);
  const nouns = await getNouns(text);
  const freqMap = await getFrequencyMap(nouns);
  const words = Object.keys(freqMap).map((text) => ({
    text,
    value: freqMap[text],
  }));
  res.status(200).json(words);
}
