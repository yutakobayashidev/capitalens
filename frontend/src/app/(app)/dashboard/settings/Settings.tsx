"use client";

import { Dialog, Switch } from "@headlessui/react";
import GLogo from "@public/g-logo.svg";
import Modal from "@src/components/ui/dialog";
import { ArrowDownIcon } from "@xpadev-net/designsystem-icons";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { type Session } from "next-auth";
import { useEffect, useState, useTransition } from "react";

import { DeleteAccount, updatePrefecture, updateUser } from "./actions";

export default function Settings({
  prefectures,
  user,
}: {
  prefectures: { id: number; name: string }[];
  user: Session["user"];
}) {
  const [_, startTransition] = useTransition();

  const router = useRouter();

  const [kids, setEnabled] = useState<null | boolean>(null);
  const [prefecture, setPrefecture] = useState<null | number>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);

  useEffect(() => {
    if (user) {
      setEnabled(user.kids);
      setPrefecture(user.prefectureId);
    }
  }, [user]);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <section className="bg-gray-100 py-8">
        <div className="mx-auto max-w-screen-sm px-4 md:px-8">
          <h1 className="mb-3 text-xl font-bold">設定</h1>
          <div className="flex gap-x-2 text-sm text-gray-500">
            <GLogo width={20} height={20} />
            {user && (
              <div>
                <span>
                  <strong>{user.email}</strong>
                </span>
                でログインしています
              </div>
            )}
          </div>
          <p className="mb-3 text-lg text-gray-500"></p>
        </div>
      </section>
      <div className="mx-auto max-w-screen-sm px-4 md:px-8">
        <div className="mt-4 pb-9">
          <section className="xs:gap-5 flex items-start gap-4 py-7">
            <div className="flex-1">
              <label className="font-bold">選挙区</label>
              <div className="mt-2.5 text-sm text-gray-500">
                住んでいる選挙区を設定することで、最適な情報が表示されます
              </div>
            </div>
            <div className="relative inline-flex items-center">
              <select
                value={prefecture === null ? "" : prefecture}
                onChange={(event) => {
                  startTransition(async () => {
                    await updatePrefecture({
                      prefecture: Number(event.target.value),
                    });
                  });

                  setPrefecture(Number(event.target.value));
                }}
                className="border-normal-400 hover:border-normal-500 hover:bg-normal-50 focus:border-primary block w-full appearance-none rounded-lg border-2 bg-white py-2 pl-3 pr-8 leading-tight transition-colors focus:outline-none"
              >
                {prefectures.map((prefecture) => (
                  <option key={prefecture.id} value={prefecture.id}>
                    {prefecture.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 px-2">
                <ArrowDownIcon
                  className="text-sm text-gray-400"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                />
              </div>
            </div>
          </section>
          <section className="xs:gap-5 flex items-start gap-4 border-t border-gray-200 py-7">
            <div className="flex-1">
              <label className="font-bold">子ども向けに説明</label>
              <div className="mt-2.5 text-sm text-gray-500">
                AIの表示が分かりやすい言葉になり、ルビ (ふりがな)が付きます
              </div>
            </div>
            {user && kids !== null && (
              <Switch
                checked={kids}
                onChange={(checked) => {
                  startTransition(async () => {
                    const result = await updateUser({ kids: checked });

                    if (result) setEnabled(checked);
                  });
                }}
                className={cn(
                  kids ? "bg-primary" : "bg-gray-400",
                  "relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    kids ? "translate-x-9" : "translate-x-0",
                    "pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                  )}
                />
              </Switch>
            )}
          </section>
          <section className="xs:gap-5 flex items-start gap-4 border-t border-gray-200 py-7">
            <div className="flex-1">
              <label className="font-bold">退会</label>
              <div className="mt-2.5 text-sm text-gray-500">
                投稿したコメントなど、すべてのコンテンツが削除されます
              </div>
            </div>
            <button
              onClick={handleModal}
              className="rounded-xl border-2 px-3 py-2.5 text-sm font-bold leading-[1.2] text-red-400 outline-2 outline-offset-4 outline-red-300 duration-500 hover:bg-red-50"
            >
              退会する
            </button>
          </section>
        </div>
      </div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-10 align-middle shadow-xl transition-all">
          <div className="mb-3 text-2xl font-bold">退会する</div>
          <div>
            <p className="text-sm leading-7">
              本当に退会しますか？この操作は元に戻せません
            </p>
          </div>
          <button
            onClick={() => {
              setDeleteStatus(true);

              startTransition(async () => {
                DeleteAccount();

                setDeleteStatus(true);
                router.refresh();
                router.push("/");
              });
            }}
            className="mt-5 flex w-full items-center justify-center rounded-xl border-2 px-3 py-2.5 font-bold text-red-400 outline-2 outline-offset-4 outline-red-300 duration-500 hover:bg-red-50"
          >
            {deleteStatus && (
              <div className="mr-2 flex justify-center" aria-label="読み込み中">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></div>
              </div>
            )}
            退会する
          </button>
        </Dialog.Panel>
      </Modal>
    </>
  );
}
