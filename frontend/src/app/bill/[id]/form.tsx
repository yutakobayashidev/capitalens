"use client";

import "dayjs/locale/ja";

import { LoginPrompt } from "@src/app/_components/Login";
import dayjs from "dayjs";
import { type Session } from "next-auth";
import { useRef, useState,useTransition  } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { VscTriangleUp } from "react-icons/vsc";

import { addComment, Vote } from "./actions";

dayjs.locale("ja");

type Comment = {
  id: string;
  _count: {
    votes: number;
  };
  comment: string;
  createdAt: string;
  type: string;
  user: {
    name: string;
    image: string;
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
            className="rounded-full border border-gray-300"
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
        <div className="first-letter mt-3 flex">
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
            comment,
            type: selectedGroup,
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
          className="mt-1 block w-full rounded-md border-neutral-300 bg-gray-100 py-2 pl-4 pr-32 text-neutral-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-100"
        />
        <button
          className="absolute right-1 top-1 flex h-7 w-16 items-center justify-center rounded bg-neutral-200 px-2 py-1 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100"
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
      <nav className="mx-auto mb-4 flex max-w-screen-md justify-between border-b px-4 md:px-8">
        <button
          className={`flex w-[33%] items-center justify-center py-3 ${
            selectedGroup === "AGREEMENT"
              ? "pointer-events-none border-b border-gray-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => handleGroupChange("AGREEMENT")}
        >
          <div className="text-lg font-bold">賛成</div>
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-400 text-xs font-bold text-white">
            {count.AGREEMENT}
          </span>
        </button>
        <button
          className={`flex items-center justify-center py-3 ${
            selectedGroup === "NEUTRAL"
              ? "pointer-events-none border-b border-gray-500 text-yellow-500"
              : "text-gray-500"
          }`}
          onClick={() => handleGroupChange("NEUTRAL")}
        >
          <div className="text-lg font-bold">どちらでもない</div>
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300 text-xs font-bold text-white">
            {count.NEUTRAL}
          </span>
        </button>
        <button
          className={`flex items-center justify-center py-3 ${
            selectedGroup === "OPPOSITION"
              ? "pointer-events-none border-b border-gray-500 text-red-500"
              : "text-gray-500"
          }`}
          onClick={() => handleGroupChange("OPPOSITION")}
        >
          <div className="text-lg font-bold">反対</div>
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-xs font-bold text-white">
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
