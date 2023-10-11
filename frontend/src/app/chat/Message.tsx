import Speaker from "@src/app/meetings/[id]/Speaker";
import { Country } from "@src/types/country";
import { MeOutlinedIcon } from "@xpadev-net/designsystem-icons";
import type { Message } from "ai";
import cn from "classnames";
import type { Session } from "next-auth";
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from "react-markdown";

import Population from "./population";

export default function MessageItem({
  countries,
  data,
  message,
  user,
}: {
  countries: Country[];
  data: any;
  message: Message;
  user: Session["user"];
}) {
  return (
    <>
      <div className="flex items-start">
        {user && message.role === "user" ? (
          <img
            src={user.image ?? "/noimage.png"}
            alt={user.name ?? "不明"}
            className="h-8 w-8 rounded-md border shadow"
          />
        ) : (
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
              message.role === "user" ? "bg-gray-100" : "bg-black"
            )}
          >
            {message.role === "user" ? (
              <MeOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4 w-4"
              />
            ) : (
              <SiOpenai className="h-4 w-4 text-white" />
            )}
          </div>
        )}
        <ReactMarkdown className="prose prose-neutral prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow ml-4 max-w-none flex-1 space-y-2 overflow-hidden px-1">
          {message.content}
        </ReactMarkdown>
      </div>
      <div className="mt-5">
        {data?.type === "get_member_info" ? (
          <Speaker currentSpeaker={data.body} />
        ) : data?.type === "get_population" ? (
          <Population countries={countries} transformedData={data.body} />
        ) : (
          data?.type === "error" && (
            <span className="text-sm text-red-400">⚠ {data.body}</span>
          )
        )}
      </div>
    </>
  );
}
