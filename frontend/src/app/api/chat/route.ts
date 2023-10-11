import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  createStreamDataTransformer,
  experimental_StreamData,
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import { OpenAI } from "openai";

import { functions, runFunction } from "./functions";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  url: process.env.UPSTASH_REDIS_REST_URL || "",
});

export async function POST(req: Request) {
  if (
    process.env.NODE_ENV != "development" &&
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const ip = req.headers.get("x-forwarded-for");

    const ratelimit = new Ratelimit({
      limiter: Ratelimit.slidingWindow(20, "1 d"),
      redis: redis,
    });

    const { limit, remaining, reset, success } = await ratelimit.limit(
      `capitalens_ratelimit_${ip}`
    );

    if (!success) {
      return new Response("Too many requests", {
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
        status: 429,
      });
    }
  }

  const { messages } = await req.json();
  const key = JSON.stringify(messages);
  const cached = (await redis.get(key)) as any;

  const data = new experimental_StreamData();

  if (cached && cached.completion) {
    console.log(cached);

    const chunks: string[] = [];
    for (let i = 0; i < cached.completion.length; i += 5) {
      chunks.push(cached.completion.substring(i, i + 5));
    }

    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          const bytes = new TextEncoder().encode(chunk);
          controller.enqueue(bytes);
          await new Promise((r) =>
            setTimeout(r, Math.floor(Math.random() * 40) + 10)
          );
        }
        controller.close();
      },
    });

    if (cached.data) {
      cached.data.forEach((item: any) => {
        data.append(item);
      });
      data.close();

      const transformedStream = stream.pipeThrough(
        createStreamDataTransformer(true)
      );

      return new StreamingTextResponse(transformedStream, {}, data);
    } else {
      return new StreamingTextResponse(stream);
    }
  }
  const initialResponse = await openai.chat.completions.create({
    function_call: "auto",
    functions,
    messages,
    model: "gpt-3.5-turbo",
    stream: true,
    temperature: 0,
  });

  const allDataAppends: any[] = [];

  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages
    ) => {
      const functionResponse = await runFunction(name, args);
      const newMessages = createFunctionCallMessages(functionResponse);

      const appendData = {
        body: functionResponse,
        index: messages.length - 1 + 1,
        type: typeof functionResponse === "string" ? "error" : name,
      };

      data.append(appendData);
      allDataAppends.push(appendData);

      return openai.chat.completions.create({
        functions,
        messages: [...messages, ...newMessages],
        model: "gpt-3.5-turbo-0613",
        stream: true,
        temperature: 0,
      });
    },
    experimental_streamData: true,
    async onFinal(completion) {
      data.close();

      const cacheValue = {
        completion: completion,
        data: allDataAppends,
      };
      await redis.set(key, JSON.stringify(cacheValue));
      await redis.expire(key, 60 * 60);
    },
  });

  return new StreamingTextResponse(stream, {}, data);
}
