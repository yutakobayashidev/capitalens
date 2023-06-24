import { connect } from "@planetscale/database";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const pscale_config = {
  url: process.env.DATABASE_URL || "mysql://user:pass@host",
};

const conn = process.env.DATABASE_URL ? connect(pscale_config) : null;

export const runtime = "edge";

async function getPopulation(countryCode: string) {
  try {
    const response = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json`
    );
    const result = await response.json();
    const data = result[1];

    if (!data) {
      return "Sorry, we could not retrieve population data because there was no data available for the country code.";
    }

    const transformedData = data.map((datum: any) => {
      return {
        country_id: datum.country.id,
        country_value: datum.country.value,
        date: datum.date,
        value: datum.value,
        indicator_id: datum.indicator.id,
        indicator_value: datum.indicator.value,
      };
    });

    return transformedData;
  } catch (e: any) {
    return `Sorry, we could not retrieve population data due to an error: ${e.message}`;
  }
}

export async function POST(request: Request) {
  if (!conn) return null;

  const { messages } = await request.json();

  const requestHeadersOpenAI: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
  };

  const prompt = messages[0].content;

  const bodyStep1 = {
    model: "gpt-3.5-turbo-0613",
    messages,
    temperature: 0,
    functions: [
      {
        name: "getMemberInfo",
        description:
          "Retrieve the user's information from the Member table in the database.use markdown notation to display the image if an image field is present.",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of Member of Parliament",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "get_population",
        description:
          "Search the World Bank for the most current population data at this time by country.",
        parameters: {
          type: "object",
          properties: {
            country_code: {
              type: "string",
              description: "ISO 3166-1 alpha-3 format code for country name.",
            },
          },
          required: ["country_code"],
        },
      },
    ],
    function_call: "auto",
  };

  const resStep1 = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: requestHeadersOpenAI,
    method: "POST",
    body: JSON.stringify(bodyStep1),
  });

  const dataStep1 = await resStep1.json();

  const message = dataStep1.choices[0].message;

  if (message.function_call) {
    const userRequested = JSON.parse(message["function_call"]["arguments"]);
    const functionName = message.function_call?.name;

    const query = "SELECT * FROM Member WHERE name = ? LIMIT 1";
    const params = [userRequested.name];
    const data = await conn.execute(query, params);

    if (functionName === "getMemberInfo") {
      const bodyStep3 = {
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: "user",
            content: prompt,
          },
          message,
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(data.rows[0]),
          },
        ],
        stream: true,
      };

      const resStep3 = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          headers: requestHeadersOpenAI,
          method: "POST",
          body: JSON.stringify(bodyStep3),
        }
      );

      const stream = OpenAIStream(resStep3);

      return new StreamingTextResponse(stream);
    } else if (functionName === "get_population") {
      const data = getPopulation(userRequested.country_code);

      const bodyStep3 = {
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: "user",
            content: prompt,
          },
          message,
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(data),
          },
        ],
        stream: true,
      };

      const resStep3 = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          headers: requestHeadersOpenAI,
          method: "POST",
          body: JSON.stringify(bodyStep3),
        }
      );

      const stream = OpenAIStream(resStep3);

      return new StreamingTextResponse(stream);
    }
  } else return NextResponse.json({ message });
}
