"use client";

import { useChat } from "ai/react";
import { Member } from "@src/types/member";
import ReactMarkdown from "react-markdown";
import cn from "classnames";
import { SiOpenai } from "react-icons/si";
import { MeOutlinedIcon } from "@xpadev-net/designsystem-icons";
import { IoMdSend } from "react-icons/io";
import { type Session } from "next-auth";
import toast from "react-hot-toast";

export default function Chat({
  member,
  user,
}: {
  member: Member;
  user: Session["user"];
}) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("利用制限を超えました。時間を開けてお試しください。");
        return;
      }
    },
    initialMessages: [
      {
        role: "system",
        id: "1",
        content: `あなたは${member.name}さんに関する情報のみを提供し返答するアシスタントです`,
      },
    ],
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="w-full rounded-md bg-gray-100 flex items-center py-[8px] md:py-2 md:pl-4 relative border shadow">
          <input
            placeholder={member.name + "さんの最近の発言を教えて"}
            value={input}
            required={true}
            className="m-0 outline-none w-full resize-none border-0 bg-transparent p-0 pr-10 focus:ring-0 focus-visible:ring-0 md:pr-12 pl-3 md:pl-0"
            onChange={handleInputChange}
          />
          <button type="submit" className="absolute p-1 rounded-md right-3 ">
            <span>
              <IoMdSend />
            </span>
          </button>
        </div>
      </form>
      <div className="mt-5">
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div key={i} className="flex items-start md:-ml-12 mb-4">
              {user && m.role === "user" ? (
                <img
                  src={user.image ?? "/noimage.png"}
                  alt={user.name ?? "不明"}
                  className={cn("h-8 w-8 rounded-md border shadow")}
                />
              ) : (
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
                    m.role === "user" ? "bg-gray-100" : "bg-black"
                  )}
                >
                  {m.role === "user" ? (
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
              <ReactMarkdown
                key={m.id}
                className="prose ml-4 flex-1 space-y-2 overflow-hidden px-1 prose-img:rounded-lg prose-img:shadow prose-a:no-underline hover:prose-a:underline prose-a:text-primary prose-neutral max-w-none"
              >
                {m.content}
              </ReactMarkdown>
            </div>
          ))}
      </div>
    </div>
  );
}
