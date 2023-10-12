"use client";

import { Dialog } from "@headlessui/react";
import MessageItem from "@src/components/message-item/message-item";
import Modal from "@src/components/ui/modal";
import { Country } from "@src/types/country";
import { useChat } from "ai/react";
import clsx from "clsx";
import { type Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaMagic } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

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
      message: `日本の人口の推移を教えてください。またその要因を考えてください`,
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

export const LoadingCircle = () => {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 animate-spin fill-stone-600 text-stone-200"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
};

export default function Chat({
  countries,
  president,
  user,
}: {
  countries: Country[];
  president: string;
  user: Session["user"];
}) {
  const formRef = useRef<HTMLFormElement>(null);

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

  const disabled = isLoading || input.length === 0;

  return (
    <section className="my-12 flex min-h-screen flex-col items-center justify-between">
      <div className="w-full max-w-screen-md px-4 sm:px-0">
        {messages.length ? (
          messages.map((message, i) => {
            const correspondingData = data
              ? data.find((d: any) => d.index === i)
              : null;

            return (
              <div key={i} className="mb-5">
                <MessageItem
                  message={message}
                  user={user}
                  countries={countries}
                  data={correspondingData}
                />
              </div>
            );
          })
        ) : (
          <EmptyScreen president={president} setInput={setInput} />
        )}
      </div>
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 sm:px-0">
        <form
          ref={formRef}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
          onSubmit={handleSubmit}
        >
          <TextareaAutosize
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="日本の人口と少子高齢化の要因を考察してください。"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                setInput("日本の人口と少子高齢化の要因を考察してください。");
              } else if (e.key === "Enter" && !e.shiftKey && !disabled) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-primary hover:bg-primary bg-opacity-80"
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <IoMdSend
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white"
                )}
              />
            )}
          </button>
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
