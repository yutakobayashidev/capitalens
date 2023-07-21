"use client";

import { Member } from "@src/types/member";
import { MeOutlinedIcon } from "@xpadev-net/designsystem-icons";
import { useChat } from "ai/react";
import cn from "classnames";
import { type Session } from "next-auth";
import toast from "react-hot-toast";
import { IoMdSend } from "react-icons/io";
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from "react-markdown";

export default function Chat({
  member,
  user,
}: {
  member: Member;
  user: Session["user"];
}) {
  const { handleInputChange, handleSubmit, input, messages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        content: `あなたは${member.name}さんに関する情報のみを提供し返答するアシスタントです`,
        role: "system",
      },
    ],
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("利用制限を超えました。時間を開けてお試しください。");
        return;
      }
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="relative inline-flex w-full items-center rounded-md border bg-gray-100 py-[8px] shadow md:py-2 md:pl-4">
          <input
            placeholder={member.name + "議員について何でも聞いてみましょう"}
            value={input}
            required={true}
            className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-3 pr-10 outline-none focus:ring-0 focus-visible:ring-0 md:pl-0 md:pr-12"
            onChange={handleInputChange}
          />
          <button type="submit" className="absolute right-3 rounded-md p-1 ">
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
            <div key={i} className="mb-4 flex items-start">
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
                className="prose prose-neutral prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow ml-4 max-w-none flex-1 space-y-2 overflow-hidden px-1"
              >
                {m.content}
              </ReactMarkdown>
            </div>
          ))}
      </div>
    </div>
  );
}
