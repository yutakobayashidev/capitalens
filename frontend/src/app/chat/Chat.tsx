"use client";

import { useChat } from "ai/react";
import Modal from "@src/app/_components/Modal";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FaMagic } from "react-icons/fa";
import cn from "classnames";
import ReactMarkdown from "react-markdown";
import { AiOutlineArrowRight, AiOutlineUser } from "react-icons/ai";
import { SiOpenai } from "react-icons/si";
import { type Session } from "next-auth";

export function EmptyScreen({
  setInput,
  president,
}: {
  setInput: (message: string) => void;
  president: string;
}) {
  const exampleMessages = [
    {
      heading: `${president}総理について調べる`,
      message: `日本の国会議員で、現在の総理大臣である${president}議員について教えてください。`,
    },
    {
      heading: `日本の人口推移の調査`,
      message: `日本の人口の推移を教えてください。またその理由を考えてください`,
    },
  ];

  return (
    <div className="p-8 border rounded-lg bg-gray-50 mb-5">
      <h1 className="mb-2 text-lg font-semibold">
        新しい情報収集方法へようこそ
      </h1>
      <p className="mb-2 leading-normal text-muted-foreground">
        議員の情報や、最近の国会の情報や世界銀行のデータなどを自然な言葉から調べられます。早速入力してみましょう。
      </p>
      <div className="mt-4 flex flex-col items-start space-y-2">
        {exampleMessages.map((message, index) => (
          <button
            key={index}
            className="h-auto flex items-center text-gray-500 p-0 text-base"
            onClick={() => setInput(message.message)}
          >
            <AiOutlineArrowRight className="mr-2 text-muted-foreground" />
            {message.heading}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Chat({
  president,
  user,
}: {
  president: string;
  user: Session["user"];
}) {
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: "/api/chat",
      body: { kids: true },
    });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const isFirstTime = !localStorage.getItem("onboardingCompleted");
    if (isFirstTime) {
      setIsModalOpen(true);
    }
  }, []);

  function closeOnboarding() {
    setIsModalOpen(false);
    localStorage.setItem("onboardingCompleted", "true");
  }

  return (
    <section className="my-12">
      <div className="mx-auto max-w-screen-sm px-4 md:px-8">
        {messages.length ? (
          messages.map((m, i) => (
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
                    <AiOutlineUser className="h-4 w-4" />
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
          ))
        ) : (
          <EmptyScreen president={president} setInput={setInput} />
        )}
        <form onSubmit={handleSubmit}>
          <input
            className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
            value={input}
            placeholder="AIに質問を入力"
            onChange={handleInputChange}
          />
        </form>
      </div>
      <Modal isOpen={isModalOpen} setIsOpen={closeOnboarding}>
        <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-10 align-middle shadow-xl transition-all">
          <div className="text-2xl mb-2 font-bold flex items-center gap-x-2">
            <FaMagic className="text-[#9d34da]" />
            AIで言葉から情報を調べよう
          </div>
          <div className="prose">
            <p>
              AIと自然な言葉でチャットして、議員の情報や法律案などを検索できます。早速試してみましょう。
            </p>
            <ul>
              <li>情報は必ずしも正しくない可能性があります</li>
              <li>フィードバックをお気軽にお寄せください</li>
            </ul>
          </div>
        </Dialog.Panel>
      </Modal>
    </section>
  );
}
