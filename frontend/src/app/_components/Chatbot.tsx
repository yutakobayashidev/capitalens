"use client";

import { placeholderAtom } from "@src/store/placeholder";
import { Country } from "@src/types/country";
import { ArrowDownIcon, ArrowUpIcon } from "@xpadev-net/designsystem-icons";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { type Session } from "next-auth";
import { useState } from "react";
import { FaMagic } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { toast } from "sonner";

import MessageItem from "../chat/Message";

export default function Chatbot({
  countries,
  user,
}: {
  countries: Country[];
  user: Session["user"];
}) {
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
    data,
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
                messages.map((message, i) => {
                  const correspondingData = data
                    ? data.find((d: any) => d.index === i)
                    : null;

                  return (
                    <div key={i} className="mb-5">
                      <MessageItem
                        countries={countries}
                        message={message}
                        user={user}
                        data={correspondingData}
                      />
                    </div>
                  );
                })
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
