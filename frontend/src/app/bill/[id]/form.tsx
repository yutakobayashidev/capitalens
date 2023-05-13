"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { VscTriangleUp } from "react-icons/vsc";
import { Login } from "@src/app/bill/[id]/actions";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
const thresholds = [
  { l: "s", r: 1 },
  { l: "m", r: 1 },
  { l: "mm", r: 59, d: "minute" },
  { l: "h", r: 1 },
  { l: "hh", r: 23, d: "hour" },
  { l: "d", r: 1 },
  { l: "dd", r: 29, d: "day" },
  { l: "M", r: 1 },
  { l: "MM", r: 11, d: "month" },
  { l: "y" },
  { l: "yy", d: "year" },
];
dayjs.extend(relativeTime, {
  thresholds,
});
import "dayjs/locale/ja";
dayjs.locale("ja");

type Discussion = {
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
};

type Props = {
  discussion: Discussion[];
  bill: Bill;
  count: ObjectDefinition;
};

type ObjectDefinition = {
  AGREEMENT: number;
  NEUTRAL: number;
  OPPOSITION: number;
};

const Form = ({ discussion, bill, count }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;
  const [selectedGroup, setSelectedGroup] = useState("AGREEMENT");
  const session = useSession();

  const filteredDiscussion = discussion.filter(
    (item) => item.type === selectedGroup
  );

  const handleGroupChange = (group: keyof ObjectDefinition) => {
    setSelectedGroup(group);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFetching(true);
    const form = e.currentTarget;
    const input = form.elements.namedItem("entry") as HTMLInputElement;

    await fetch("/api/comment", {
      body: JSON.stringify({
        body: input.value,
        type: selectedGroup,
        bill_id: bill.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    input.value = "";
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
    });
  };

  async function votes(id: string) {
    await fetch("/api/vote", {
      body: JSON.stringify({
        id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    router.refresh();
  }

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
                await votes(item.id);
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

  const renderLoginPrompt = () => (
    <div className="text-center mt-3">
      <p className="font-semibold mb-3">
        法案に対して意見を投稿するにはログインが必要です
      </p>
      <Login />
    </div>
  );

  const renderInputForm = () => (
    <>
      <form className="relative text-sm" onSubmit={onSubmit}>
        <input
          aria-label="Your message"
          placeholder={
            selectedGroup === "AGREEMENT"
              ? "賛成として意見を投稿"
              : selectedGroup === "NEUTRAL"
              ? "どちらでもないとして意見を投稿"
              : "反対として意見を投稿"
          }
          disabled={isPending}
          name="entry"
          type="text"
          required
          className="pl-4 pr-32 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full border-neutral-300 rounded-md bg-gray-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        />
        <button
          className="flex items-center justify-center absolute right-1 top-1 px-2 py-1 font-medium h-7 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded w-16"
          disabled={isMutating}
          type="submit"
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
          className={`text-center flex items-center py-3 ${
            selectedGroup === "AGREEMENT" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => handleGroupChange("AGREEMENT")}
        >
          <div className="text-lg font-bold">賛成</div>
          <span className="bg-blue-400 font-bold text-xs ml-1 text-white rounded-full h-5 w-5 flex items-center justify-center">
            {count.AGREEMENT}
          </span>
        </button>
        <button
          className={`text-center flex items-center py-3 ${
            selectedGroup === "NEUTRAL" ? "text-yellow-500" : "text-gray-500"
          }`}
          onClick={() => handleGroupChange("NEUTRAL")}
        >
          <div className="text-lg font-bold">どちらでもない</div>
          <span className="text-white font-bold text-xs ml-1 rounded-full h-5 w-5 flex items-center justify-center bg-yellow-300">
            {count.NEUTRAL}
          </span>
        </button>
        <button
          className={`text-center flex items-center py-3 ${
            selectedGroup === "OPPOSITION" ? "text-red-500" : "text-gray-500"
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
      {session && session.data && session.data.user
        ? renderInputForm()
        : renderLoginPrompt()}
    </>
  );
};

export default Form;
