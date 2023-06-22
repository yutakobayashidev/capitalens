"use client";

import { useTransition } from "react";
import { useRef, useState } from "react";
import { VscTriangleUp } from "react-icons/vsc";
import dayjs from "dayjs";
import { type Session } from "next-auth";
import { LoginPrompt } from "@src/app/_components/Login";
import { addComment, Vote } from "./actions";
import "dayjs/locale/ja";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

dayjs.locale("ja");

type Comment = {
  id: string;
  comment: string;
  type: string;
  createdAt: string;
  user: {
    image: string;
    name: string;
  };
  _count: {
    votes: number;
  };
};

type Bill = {
  id: string;
  comments: Comment[];
};

type Props = {
  bill: Bill;
  count: ObjectDefinition;
  user: Session["user"];
};

type ObjectDefinition = {
  AGREEMENT: number;
  NEUTRAL: number;
  OPPOSITION: number;
};

const Form = ({ bill, count, user }: Props) => {
  const [selectedGroup, setSelectedGroup] = useState("AGREEMENT");
  const form = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  const [_, startTransition] = useTransition();

  const filteredDiscussion = bill.comments.filter(
    (item) => item.type === selectedGroup
  );

  const handleGroupChange = (group: keyof ObjectDefinition) => {
    setSelectedGroup(group);
  };

  const renderFilteredDiscussion = () => {
    return filteredDiscussion.map((item, i) => (
      <div key={i} className="my-3">
        <div className="flex">
          <img
            src={item.user.image}
            alt="hi"
            className="border border-gray-300 rounded-full"
            height={50}
            width={50}
          />
          <div className="ml-3">
            <p className="font-bold">{item.user.name}</p>
            <p className="text-sm text-gray-500">
              {dayjs(item.createdAt).fromNow()}
            </p>
          </div>
        </div>
        <div className="flex first-letter mt-3">
          <div>
            <button
              onClick={async () => {
                startTransition(async () => {
                  Vote({ id: item.id });
                });
              }}
            >
              <span>+{item._count.votes}</span>
              <VscTriangleUp className="text-4xl" />
            </button>
          </div>
          <div className="ml-6">
            <p>{item.comment}</p>
          </div>
        </div>
      </div>
    ));
  };

  const renderInputForm = () => (
    <>
      <form
        ref={form}
        className="relative text-sm"
        action={async (formData) => {
          const comment = formData.get("comment");

          if (typeof comment !== "string") return;

          await addComment({
            bill_id: bill.id,
            type: selectedGroup,
            comment,
          });

          form.current?.reset();
        }}
      >
        <input
          aria-label="Your message"
          placeholder={
            selectedGroup === "AGREEMENT"
              ? "賛成として意見を投稿"
              : selectedGroup === "NEUTRAL"
              ? "どちらでもないとして意見を投稿"
              : "反対として意見を投稿"
          }
          name="comment"
          type="text"
          disabled={pending}
          required
          className="pl-4 pr-32 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full border-neutral-300 rounded-md bg-gray-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
        <button
          className="flex items-center justify-center absolute right-1 top-1 px-2 py-1 font-medium h-7 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded w-16"
          type="submit"
          disabled={pending}
        >
          投稿
        </button>
      </form>
      <p className="mt-2 text-sm text-gray-600">
        この法案に関して、意見やコメントを残してみましょう。
      </p>
    </>
  );

  return (
    <>
      <nav className="flex justify-between mb-4 border-b mx-auto max-w-screen-md px-4 md:px-8">
        <button
          className={`justify-center flex items-center py-3 w-[33%] ${
            selectedGroup === "AGREEMENT"
              ? "text-blue-500 border-b pointer-events-none border-gray-500"
              : "text-gray-500"
          }`}
          onClick={() => handleGroupChange("AGREEMENT")}
        >
          <div className="text-lg font-bold">賛成</div>
          <span className="bg-blue-400 font-bold text-xs ml-1 text-white rounded-full h-5 w-5 flex items-center justify-center">
            {count.AGREEMENT}
          </span>
        </button>
        <button
          className={`flex justify-center items-center py-3 ${
            selectedGroup === "NEUTRAL"
              ? "text-yellow-500 border-b pointer-events-none border-gray-500"
              : "text-gray-500"
          }`}
          onClick={() => handleGroupChange("NEUTRAL")}
        >
          <div className="text-lg font-bold">どちらでもない</div>
          <span className="text-white font-bold text-xs ml-1 rounded-full h-5 w-5 flex items-center justify-center bg-yellow-300">
            {count.NEUTRAL}
          </span>
        </button>
        <button
          className={`flex justify-center items-center py-3 ${
            selectedGroup === "OPPOSITION"
              ? "text-red-500 border-b pointer-events-none border-gray-500"
              : "text-gray-500"
          }`}
          onClick={() => handleGroupChange("OPPOSITION")}
        >
          <div className="text-lg font-bold">反対</div>
          <span className="text-white font-bold text-xs ml-1 rounded-full h-5 w-5 flex items-center justify-center bg-red-400">
            {count.OPPOSITION}
          </span>
        </button>
      </nav>
      {renderFilteredDiscussion()}
      {user ? (
        renderInputForm()
      ) : (
        <LoginPrompt message="法案に対して意見を投稿するにはログインが必要です" />
      )}
    </>
  );
};

export default Form;
