"use client";

import { LoginPrompt } from "@src/app/_components/Login";
import { Meeting } from "@src/types/meeting";
import { type Session } from "next-auth";
import { useRef } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import TextareaAutosize from "react-textarea-autosize";

import { createComment } from "./actions";
import Comment from "./Comment";

export default function Comments({
  meeting,
  user,
}: {
  meeting: Meeting;
  user: Session["user"];
}) {
  const form = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  return (
    <div>
      <h2 className="mb-3 text-xl font-bold">コメントする</h2>
      <form
        ref={form}
        action={async (formData) => {
          const comment = formData.get("comment");

          if (typeof comment !== "string") return;

          await createComment({ id: meeting.id, comment });

          form.current?.reset();
        }}
        className="mb-5"
      >
        {user ? (
          <>
            <TextareaAutosize
              name="comment"
              placeholder="コメントを入力"
              minRows={3}
              required
              className="mb-3 block w-full resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
            />
            <button
              disabled={pending}
              type="submit"
              className="rounded-md bg-blue-500 px-3 py-2 font-bold text-white disabled:bg-gray-400"
            >
              コメントを送信
            </button>
          </>
        ) : (
          <LoginPrompt message="この会議にコメントするにはログインが必要です" />
        )}
      </form>
      <div>
        {meeting.videoComments.map((comment) => (
          <Comment user={user} key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
