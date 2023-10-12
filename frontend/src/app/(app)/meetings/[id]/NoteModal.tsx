"use client";

import { Dialog } from "@headlessui/react";
import { createNote } from "@src/app/actions";
import Modal from "@src/components/ui/modal";
import { Meeting } from "@src/types/meeting";
import { FocusEvent } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

export default function NoteModal({
  endBluer,
  endChange,
  EndTime,
  inputEndInputValue,
  inputStartInputValue,
  isOpen,
  meeting,
  setIsOpen,
  startBluer,
  startChange,
  StartTime,
}: {
  endBluer: (event: FocusEvent<HTMLInputElement>) => void;
  endChange: (event: FocusEvent<HTMLInputElement>) => void;
  EndTime: number;
  inputEndInputValue: string;
  inputStartInputValue: string;
  isOpen: boolean;
  meeting: Meeting;
  setIsOpen: (value: boolean) => void;
  startBluer: (event: FocusEvent<HTMLInputElement>) => void;
  startChange: (event: FocusEvent<HTMLInputElement>) => void;
  StartTime: number;
}) {
  const { pending } = useFormStatus();

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Panel className="w-full max-w-xl overflow-hidden rounded-xl bg-white p-10 text-center align-middle shadow-xl transition-all">
        <div className="mb-2 text-2xl font-bold">コミュニティノートを作成</div>
        <div className="mt-6">
          <p className="leading-7 text-gray-600">
            コミュニティノートは、会議の特定の範囲内に背景情報を追加できる機能です。アカウントの作成から2週間後に利用可能になります。
          </p>
          <form
            action={async (formData) => {
              const text = formData.get("text");

              if (typeof text !== "string") return;
              const response = await createNote({
                id: meeting.id,
                end: EndTime,
                start: StartTime,
                text: text,
              });
              if ("error" in response) {
                toast.error(response.error);
              } else {
                setIsOpen(false);
                toast.success("コミュニティノートを作成しました");
              }
            }}
            className="mt-6"
          >
            <div className="mb-3 flex items-center justify-center gap-x-3">
              <input
                autoComplete="off"
                value={inputStartInputValue}
                className="mt-2 border p-3 text-center"
                onChange={startChange}
                onBlur={startBluer}
                required
              />
              <span>–</span>
              <input
                autoComplete="off"
                value={inputEndInputValue}
                className="mt-2 border p-3 text-center"
                onChange={endChange}
                required
                onBlur={endBluer}
              />
            </div>
            <label className="mb-2 block text-left">ノートのテキスト</label>
            <TextareaAutosize
              name="text"
              required
              placeholder="コミュニティノートの内容"
              minRows={2}
              className="mb-3 block w-full resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
            />
            <button
              disabled={pending}
              className="bg-primary mt-2 rounded-full px-4 py-2 font-bold text-white disabled:bg-gray-300"
            >
              {pending ? "作成しています..." : "ノートを作成"}
            </button>
          </form>
        </div>
      </Dialog.Panel>
    </Modal>
  );
}
