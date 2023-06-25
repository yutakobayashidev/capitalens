import { connect } from "@planetscale/database";
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

export async function POST(request: Request) {
  if (!conn) return null;

  const { messages } = await request.json();

  const initialResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages,
    functions,
    function_call: "auto",
  });

  const initialResponseJson = await initialResponse.json();
  const initialResponseMessage = initialResponseJson?.choices?.[0]?.message;

  console.log(initialResponseJson);

  let finalResponse;

  if (initialResponseMessage.function_call) {
    const { name, arguments: args } = initialResponseMessage.function_call;
    const functionResponse = await runFunction(name, JSON.parse(args));

    finalResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      stream: true,
      messages: [
        ...messages,
        initialResponseMessage,
        {
          role: "function",
          name: initialResponseMessage.function_call.name,
          content: JSON.stringify(functionResponse),
        },
      ],
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
