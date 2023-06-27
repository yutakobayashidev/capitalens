"use client";

import { useState } from "react";
import { FaMagic } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdSend } from "react-icons/io";
import { useChat } from "ai/react";
import { FiChevronsUp, FiChevronsDown } from "react-icons/fi";
import cn from "classnames";
import { AiOutlineUser } from "react-icons/ai";
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import { type Session } from "next-auth";
import { useAtom } from "jotai";
import { placeholderAtom } from "@src/store/placeholder";
import toast from "react-hot-toast";

export default function Chatbot({ user }: { user: Session["user"] }) {
  const [isOpen, setIsOpen] = useState(false);

  const variants = {
    open: { height: "400px" },
    closed: { height: "0" },
  };

  const [placeholder] = useAtom(placeholderAtom);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/chat",
      onResponse: (response) => {
        if (response.status === 429) {
          toast.error("利用制限を超えました。時間を開けてお試しください。");
          return;
        }
      },
    });

  return (
    <div className="fixed shadow-2xl border-gray-200 border bg-white py-3 w-[380px] px-5 rounded-t-2xl right-[30px] bottom-[0] hidden md:block">
      <div className="flex justify-between items-center">
        <h2 className="text-xl flex items-center font-bold">
          <FaMagic className="text-[#9d34da] mr-2" />
          AIに質問する
        </h2>
        <button onClick={handleClick}>
          {isOpen ? (
            <FiChevronsDown className="text-gray-700 text-2xl" />
          ) : (
            <FiChevronsUp className="text-gray-700 text-2xl" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col mt-3 overflow-y-scroll"
            style={{ maxHeight: "400px" }}
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          >
            <div className="flex-grow overflow-y-auto">
              {messages.length ? (
                messages.map((m, i) => (
                  <div key={i} className="flex items-start mb-4">
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
                          <AiOutlineUser className="h-4 w-4" />
                        ) : (
                          <SiOpenai className="h-4 w-4 text-white" />
                        )}
                      </div>
                    )}
                    <ReactMarkdown className="prose ml-4 flex-1 space-y-2 overflow-hidden px-1 prose-img:rounded-lg prose-img:shadow prose-a:no-underline hover:prose-a:underline prose-a:text-primary prose-neutral max-w-none">
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-base text-gray-500">
                    AIと対話をし、様々な視点で情報を扱えます。
                  </p>
                </>
              )}
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full px-4 mt-3 py-1.5 rounded-md bg-gray-100"
            >
              <input
                required
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault(); // This prevents the normal Tab key behaviour
                    handleInputChange({ target: { value: placeholder } }); // Here, placeholder is the content you want to insert
                  }
                }}
                className="outline-none w-full resize-none border-0 bg-transparent p-0 pr-10 focus:ring-0 focus-visible:ring-0 md:pr-12 pl-3 md:pl-0"
                placeholder={placeholder}
              />
              <button
                type="submit"
                disabled={isLoading || input === ""}
                className="absolute p-1 rounded-md right-7 bg-blue-400 disabled:bg-opacity-0 disabled:text-gray-800 text-white"
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
