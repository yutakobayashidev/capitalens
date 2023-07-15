"use client";

import { placeholderAtom } from "@src/store/placeholder";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MeOutlinedIcon,
} from "@xpadev-net/designsystem-icons";
import { useChat } from "ai/react";
import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { type Session } from "next-auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaMagic } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from "react-markdown";

export default function Chatbot({ user }: { user: Session["user"] }) {
  const [isOpen, setIsOpen] = useState(false);

  const variants = {
    closed: { height: "0" },
    open: { height: "400px" },
  };

  const [placeholder] = useAtom(placeholderAtom);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const {
    handleInputChange,
    handleSubmit,
    input,
    isLoading,
    messages,
    setInput,
  } = useChat({
    api: "/api/chat",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("利用制限を超えました。時間を開けてお試しください。");
        return;
      }
    },
  });

  return (
    <div className="fixed bottom-[0] right-[30px] hidden w-[380px] rounded-t-2xl border border-gray-200 bg-white px-5 py-3 shadow-2xl md:block">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-xl font-bold">
          <FaMagic className="mr-2 text-[#9d34da]" />
          AIに質問する
        </h2>
        <button onClick={handleClick}>
          {isOpen ? (
            <ArrowDownIcon
              width="1em"
              height="1em"
              fill="currentColor"
              className="text-xl text-gray-700"
            />
          ) : (
            <ArrowUpIcon
              width="1em"
              height="1em"
              fill="currentColor"
              className="text-xl text-gray-700"
            />
          )}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mt-3 flex flex-col"
            style={{ maxHeight: "400px" }}
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          >
            <div className="grow overflow-y-auto">
              {messages.length ? (
                messages.map((m, i) => (
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
                    <ReactMarkdown className="prose prose-neutral prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow ml-4 max-w-none flex-1 space-y-2 overflow-hidden px-1">
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  <p className="mb-2">
                    <span className="text-base">💡</span>{" "}
                    AIと対話し、様々な視点から効率的に情報を収集できます
                  </p>
                  <span className="text-xs">
                    Tip: Tabキーでプレスホルダーの内容が自動的に入力されます
                  </span>
                </div>
              )}
            </div>
            <form
              onSubmit={handleSubmit}
              className="mt-3 w-full rounded-md bg-gray-100 px-4 py-1.5"
            >
              <input
                required
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    setInput(placeholder);
                  }
                }}
                className="w-full resize-none border-0 bg-transparent p-0 pl-3 pr-10 outline-none focus:ring-0 focus-visible:ring-0 md:pl-0 md:pr-12"
                placeholder={placeholder}
              />
              <button
                type="submit"
                disabled={isLoading || input === ""}
                className="absolute right-7 rounded-md bg-blue-400 p-1 text-white disabled:bg-opacity-0 disabled:text-gray-800"
              >
                <span>
                  <IoMdSend />
                </span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
