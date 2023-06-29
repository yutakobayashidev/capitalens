import { connect } from "@planetscale/database";

const pscale_config = {
  url: process.env.DATABASE_URL || "mysql://user:pass@host",
};

const conn = process.env.DATABASE_URL ? connect(pscale_config) : null;

type FunctionNames =
  | "get_member_info"
  | "get_population"
  | "meeting_list"
  | "speech_list";

export const functions: {
  name: FunctionNames;
  description: string;
  parameters: object;
}[] = [
  {
    name: "get_member_info",
    description:
      "Retrieve the user's information from the Member table in the database.use markdown notation to display the image if an image field is present.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Name of Member of Parliament (full name in Chinese characters, remove spaces between last name and first name)",
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
  {
    name: "meeting_list",
    description:
      "Retrieve meeting and speaker information from the Japanese Diet Meeting Minutes Retrieval System search API in the order of most recent meeting date.",
    parameters: {
      type: "object",
      properties: {
        nameOfMeeting: {
          type: "string",
          description:
            "Set the text to be included in the meeting name. For example: 東日本大震災",
        },
        any: {
          type: "string",
          description:
            "Specify the message to be included in the utterance. Example: 科学技術",
        },
        speaker: {
          type: "string",
          description:
            "Meetings can be searched by speaker name.Can be last name or first name; if full name, remove space between last name and first name. Example: 岸田文雄",
        },
      },
    },
  },
  {
    name: "speech_list",
    description:
      "Retrieved from the search API of the Japanese Diet Proceedings Retrieval System, in order of newest to oldest, based on statements.",
    parameters: {
      type: "object",
      properties: {
        any: {
          type: "string",
          description:
            "Specify the message to be included in the utterance. Example: マイナンバー",
        },
        speaker: {
          type: "string",
          description:
            "Meetings can be searched by speaker name.Can be last name or first name; if full name, remove space between last name and first name. Example: 岸田文雄",
        },
      },
    },
  },
];

async function get_population(countryCode: string) {
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

async function get_member_info(name: string) {
  if (!conn) return null;

  const query = "SELECT * FROM Member WHERE name = ? LIMIT 1";
  const params = [name];
  const data = await conn.execute(query, params);

  return data.rows[0];
}

async function meeting_list(args: any) {
  const { nameOfMeeting, any, speaker } = args;

  // TODO: なにもargsがない場合の処理を書く

  const url =
    `https://kokkai.ndl.go.jp/api/meeting_list?recordPacking=json&maximumRecords=10` +
    `${
      nameOfMeeting ? "&nameOfMeeting=" + encodeURIComponent(nameOfMeeting) : ""
    }` +
    `${any ? "&any=" + encodeURIComponent(any) : ""}` +
    `${speaker ? "&speaker=" + encodeURIComponent(speaker) : ""}`;
  console.log(url);

  const res = await fetch(url);

  const json = await res.json();

  const newArray = json.meetingRecord.map((record: any) => {
    const speakers = Array.from(
      new Set(record.speechRecord.slice(1).map((speech: any) => speech.speaker))
    );
    return {
      info: `${record.nameOfHouse} ${record.nameOfMeeting} ${record.issue} ${record.date}`,
      speakers,
      meetingURL: record.meetingURL,
    };
  });

  console.log(newArray);

  return newArray;
}

async function speech_list(args: any) {
  const { any, speaker } = args;

  // TODO: なにもargsがない場合の処理を書く

  const url =
    `https://kokkai.ndl.go.jp/api/speech?maximumRecords=2&recordPacking=json` +
    `${any ? "&any=" + encodeURIComponent(any) : ""}` +
    `${speaker ? "&speaker=" + encodeURIComponent(speaker) : ""}`;

  const res = await fetch(url);

  const json = await res.json();

  // Map through the array and return a new array with the desired fields
  const newArray = json.speechRecord.map((record: any) => {
    return {
      info: `${record.nameOfHouse} ${record.nameOfMeeting} ${record.issue} ${record.date}`,
      speech: record.speech,
      speechURL: record.speechURL,
      meetingURL: record.meetingURL,
    };
  });

  return newArray;
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "get_member_info":
      return await get_member_info(args["name"]);
    case "get_population":
      return await get_population(args["country_code"]);
    case "meeting_list":
      return await meeting_list(args);
    case "speech_list":
      return await speech_list(args);
    default:
      return null;
  }
}
