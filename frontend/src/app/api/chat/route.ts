import { connect } from "@planetscale/database";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { functions, runFunction } from "./functions";

const pscale_config = {
  url: process.env.DATABASE_URL || "mysql://user:pass@host",
};

const conn = process.env.DATABASE_URL ? connect(pscale_config) : null;

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  if (!conn) return null;

  if (
    process.env.NODE_ENV != "development" &&
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const ip = req.headers.get("x-forwarded-for");

    const ratelimit = new Ratelimit({
      limiter: Ratelimit.slidingWindow(20, "1 d"),
      redis: new Redis({
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
        url: process.env.UPSTASH_REDIS_REST_URL,
      }),
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

  const initialResponse = await openai.createChatCompletion({
    function_call: "auto",
    functions,
    messages,
    model: "gpt-3.5-turbo-0613",
  });

  const initialResponseJson = await initialResponse.json();
  const initialResponseMessage = initialResponseJson?.choices?.[0]?.message;

  console.log(initialResponseJson);

  let finalResponse;

  if (initialResponseMessage.function_call) {
    const { name, arguments: args } = initialResponseMessage.function_call;
    const functionResponse = await runFunction(name, JSON.parse(args));

    finalResponse = await openai.createChatCompletion({
      messages: [
        ...messages,
        initialResponseMessage,
        {
          name: initialResponseMessage.function_call.name,
          content: JSON.stringify(functionResponse),
          role: "function",
        },
      ],
      model: "gpt-3.5-turbo-0613",
      stream: true,
    });

    const stream = OpenAIStream(finalResponse);
    return new StreamingTextResponse(stream);
  } else {
    const chunks = initialResponseMessage.content.split(" ");
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          const bytes = new TextEncoder().encode(chunk + " ");
          controller.enqueue(bytes);
          await new Promise((r) =>
            setTimeout(
              r,
              // get a random number between 10ms and 30ms to simulate a random delay
              Math.floor(Math.random() * 20 + 10)
            )
          );
        }
        controller.close();
      },
    });
    return new StreamingTextResponse(stream);
  }
}
