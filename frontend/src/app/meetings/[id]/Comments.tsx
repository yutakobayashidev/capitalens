import { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { addComment } from "./actions";
import { LoginPrompt } from "@src/app/_components/Login";
import { type Session } from "next-auth";
import { Meeting } from "@src/types/meeting";
import Comment from "./Comment";

export default function Comments({
  meeting,
  user,
}: {
  meeting: Meeting;
  user: Session["user"];
}) {
  const form = useRef<HTMLFormElement>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">コメントする</h2>
      <form
        ref={form}
        action={async (formData) => {
          const comment = formData.get("comment");

          if (typeof comment !== "string") return;

          await addComment({ comment, id: meeting.id });

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
              className="w-full mb-3 block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-md font-bold"
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
