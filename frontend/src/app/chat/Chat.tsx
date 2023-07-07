"use client";

import { Dialog } from "@headlessui/react";
import Modal from "@src/app/_components/Modal";
import { MeOutlinedIcon } from "@xpadev-net/designsystem-icons";
import { useChat } from "ai/react";
import cn from "classnames";
import { type Session } from "next-auth";
import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaMagic } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from "react-markdown";

export function EmptyScreen({
  president,
  setInput,
}: {
  president: string;
  setInput: (message: string) => void;
}) {
  const exampleMessages = [
    {
      heading: `議員情報を調べる`,
      message: `日本の国会議員で、現在の総理大臣である${president}議員について教えてください。`,
    },
    {
      heading: `日本の人口推移の調査`,
      message: `日本の人口の推移を教えてください。またその理由を考えてください`,
    },
    {
      heading: `議会での議論を調べる`,
      message: `マイナンバーに関する議会での議論を調べてください`,
    },
  ];

  return (
    <div className="mb-5 rounded-lg border bg-gray-50 p-8">
      <h1 className="mb-2 text-lg font-semibold">
        新しい情報収集方法へようこそ
      </h1>
      <p className="text-muted-foreground mb-2 leading-normal">
        議員の情報や、最近の国会の情報や世界銀行のデータなどを自然な言葉から調べられます。早速入力してみましょう。
      </p>
      <div className="mt-4 flex flex-col items-start space-y-2">
        {exampleMessages.map((message, index) => (
          <button
            key={index}
            className="flex h-auto items-center p-0 text-base text-gray-500"
            onClick={() => setInput(message.message)}
          >
            <AiOutlineArrowRight className="text-muted-foreground mr-2" />
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
  const { handleInputChange, handleSubmit, input, messages, setInput } =
    useChat({
      api: "/api/chat",
      onResponse: (response) => {
        if (response.status === 429) {
          toast.error("利用制限を超えました。時間を開けてお試しください。");
          return;
        }
      },
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
            <div key={i} className="mb-4 flex items-start md:-ml-12">
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
              <ReactMarkdown className="prose prose-neutral ml-4 max-w-none flex-1 space-y-2 overflow-hidden px-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow">
                {m.content}
              </ReactMarkdown>
            </div>
          ))
        ) : (
          <EmptyScreen president={president} setInput={setInput} />
        )}
        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
            value={input}
            placeholder="AIに質問を入力"
            onChange={handleInputChange}
          />
        </form>
      </div>
      <Modal isOpen={isModalOpen} setIsOpen={closeOnboarding}>
        <Dialog.Panel className="w-full max-w-lg overflow-hidden rounded-2xl bg-white p-10 align-middle shadow-xl transition-all">
          <div className="mb-2 flex items-center gap-x-2 text-2xl font-bold">
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
