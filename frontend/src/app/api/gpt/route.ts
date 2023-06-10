import { connect } from "@planetscale/database";
import { NextResponse } from "next/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "langchain/prompts";
import { SpeechRecord } from "@src/types/meeting";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const runtime = "edge";

async function runLLMChain(text: string, kids: boolean, id: string, conn: any) {
  const encoder = new TextEncoder();

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  let finalResult = "";

  const chatStreaming = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
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

  const prompt_template =
    kids === true
      ? "次の文章の簡潔に議員のフルネームや時刻などは省略せず小学生でもわかるよう要約を書いてください: {text} 小学生でもわかるような簡潔な日本語の要約: "
      : "次の文章の簡潔に議員のフルネームや時刻などは省略せず要約を書いてください: {text} 簡潔な日本語の要約: ";

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
    chunkSize: 3000,
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
