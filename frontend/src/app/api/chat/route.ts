import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { functions, runFunction } from "./functions";

export const runtime = "edge";

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(apiConfig);

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
  const cached = await await redis.get(key);

  if (cached) {
    return new Response(cached as string);
  }

  const response = await openai.createChatCompletion({
    functions,
    messages,
    model: "gpt-3.5-turbo-0613",
    stream: true,
    temperature: 0,
  });

  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages
    ) => {
      const functionResponse = await runFunction(name, args);

      const newMessages = createFunctionCallMessages(functionResponse);
      return openai.createChatCompletion({
        functions,
        messages: [...messages, ...newMessages],
        model: "gpt-3.5-turbo-0613",
        stream: true,
      });
    },
    async onCompletion(completion) {
      // Cache the response
      await redis.set(key, completion);
      await redis.expire(key, 60 * 60);
    },
  });

  return new StreamingTextResponse(stream);
}
