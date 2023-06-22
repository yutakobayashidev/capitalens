import { connect } from "@planetscale/database";
import { NextResponse } from "next/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "langchain/prompts";
import { SpeechRecord } from "@src/types/api";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const runtime = "edge";

async function runLLMChain(text: string, kids: boolean, id: string, conn: any) {
  const encoder = new TextEncoder();

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  let finalResult = "";

  const chatStreaming = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-16k",
    streaming: true,
    maxTokens: -1,
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          finalResult += token;
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
          const column = kids ? "kids" : "summary";
          const query = `UPDATE Video SET ${column} = ? WHERE id = ?`;
          const params = [finalResult, id];
          await conn.execute(query, params);
        },
        async handleLLMError(e) {
          await writer.ready;
          console.log("handleLLMError Error: ", e);
          await writer.abort(e);
        },
      },
    ],
  });

  const Prompt = `Instructions: Your output should use the following template:

- Bulletpoint
- Bulletpoint

🔎 ハイライト: text

You will summarize the proceedings of the Japanese Diet. Please respond in Japanese. Do not omit the names of legislators or the time of day. Do not use Kanji characters for the time, but use numbers. Use up to 6 brief bullet points to summarize the content below,and summarize a short highlight: {text}.`;

  const KidsPrompt = `Instructions: Your output should use the following template:

- Bulletpoint
- Bulletpoint

🔎 ハイライト: text

You will summarize the proceedings of the Japanese Diet in polite, easy-to-understand, simple, soft-spoken language that can be easily understood by Japanese elementary school students and other children. Please respond in Japanese. Do not omit the names of legislators or the time of day. Do not use Kanji characters for the time, but use numbers. Use up to 6 brief bullet points to summarize the content below,and summarize a short highlight: {text}.`;

  const prompt_template = kids ? KidsPrompt : Prompt;

  const RPROMPT = new PromptTemplate({
    template: prompt_template,
    inputVariables: ["text"],
  });

  const refinePromptTemplate = `あなたの仕事は最終的な要約を作ることです
  途中までの要約があります: "{existing_answer}"
  必要に応じて下記の文章を使い、さらに良い要約を作成してください
  与えられた文章が有用でない場合、途中までの文章を返してください
------------
"{text}"
------------

与えられた文章を踏まえて、日本語で要約を改善してください
REFINED SUMMARY:`;

  const REFINE_PROMPT = new PromptTemplate({
    template: refinePromptTemplate,
    inputVariables: ["existing_answer", "text"],
  });

  const chain = loadSummarizationChain(chatStreaming, {
    type: "refine",
    refinePrompt: REFINE_PROMPT,
    questionPrompt: RPROMPT,
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 7000,
  });

  const docs = await textSplitter.createDocuments([text]);

  chain.call({
    input_documents: docs,
  });
  return stream.readable;
}

const pscale_config = {
  url: process.env.DATABASE_URL || "mysql://user:pass@host",
};

const conn = process.env.DATABASE_URL ? connect(pscale_config) : null;

export async function POST(request: Request) {
  if (!conn) return null;

  const body = await request.json();

  const query = "SELECT * FROM Video WHERE id = ? LIMIT 1";
  const params = [body.id];

  const results = await conn.execute(query, params);
  const column = body.kids ? "kids" : "summary";

  // @ts-expect-error: https://github.com/planetscale/database-js/issues/71
  if (!results.rows[0][column]) {
    // @ts-expect-error: https://github.com/planetscale/database-js/issues/71
    if (!results.rows[0].apiURL) {
      return NextResponse.json({ error: "error" });
    }
    // @ts-expect-error: https://github.com/planetscale/database-js/issues/71
    const res = await fetch(results.rows[0].apiURL, {
      method: "GET",
    });

    const json = await res.json();

    const records: SpeechRecord[] = json.meetingRecord[0].speechRecord;

    const speeches = records
      .slice(1)
      .map((record) => JSON.stringify(record.speech));

    const stream = runLLMChain(speeches.join("\n"), body.kids, body.id, conn);

    return new Response(await stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  }

  // @ts-expect-error: https://github.com/planetscale/database-js/issues/71
  return NextResponse.json({ summary: results.rows[0][column] });
}
