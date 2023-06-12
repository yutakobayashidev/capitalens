"use client";

import { useRequireLogin } from "@src/hooks/useRequireLogin";
import { useSession } from "next-auth/react";
import GLogo from "@public/g-logo.svg";
import { useState } from "react";
import cn from "classnames";
import { Switch } from "@headlessui/react";
import Modal from "@src/app/_components/Modal";
import { Dialog } from "@headlessui/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  useRequireLogin();

  const { data: session } = useSession();

  const [kids, setEnabled] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);

  useEffect(() => {
    if (session && session.user) {
      setEnabled(session.user.kids);
    }
  }, [session]);

  const router = useRouter();

  const handleDeleteAccount = async () => {
    setDeleteStatus(true);

    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }

      setDeleteStatus(false);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kids }),
        });
        if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
      } catch (error) {
        // Handle the error here
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, [kids]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <section className="py-8 bg-gray-100">
        <div className="mx-auto max-w-screen-sm px-4 md:px-8">
          <h1 className="text-xl font-bold mb-3">設定</h1>
          <div className="flex text-sm gap-x-2 text-gray-500">
            <GLogo width={20} height={20} />
            {session && session.user && (
              <div>
                <span>
                  <strong>{session.user.email}</strong>
                </span>
                でログインしています
              </div>
            )}
          </div>
          <p className="text-lg text-gray-500 mb-3"></p>
        </div>
      </section>
      <div className="mx-auto max-w-screen-sm px-4 md:px-8">
        <div className="mt-4 pb-9">
          <section className="flex items-start gap-4 py-7 xs:gap-5">
            <div className="flex-1">
              <label className="font-bold">子ども向けに説明 (ベータ)</label>
              <div className="mt-2.5 text-gray-500 text-sm">
                表示が分かりやすい言葉になり、ルビ (ふりがな)が付きます
              </div>
            </div>
            {session && (
              <Switch
                checked={kids}
                onChange={setEnabled}
                className={cn(
                  kids ? "bg-primary" : "bg-blue-500",
                  "relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${kids ? "translate-x-9" : "translate-x-0"}
          pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            )}
          </section>
          <section className="flex items-start gap-4 py-7 xs:gap-5 border-t border-gray-200">
            <div className="flex-1">
              <label className="font-bold">退会</label>
              <div className="mt-2.5 text-gray-500 text-sm">
                投稿したコメントなど、すべてのコンテンツが削除されます
              </div>
            </div>
            <button
              onClick={handleModal}
              className="border-2 rounded-xl text-red-400 font-bold text-xs py-2.5 px-3"
            >
              退会する
            </button>
          </section>
        </div>
      </div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-10 align-middle shadow-xl transition-all">
          <div className="text-2xl mb-3 font-bold">退会する</div>
          <div>
            <p className="leading-7">
              本当に退会しますか？この操作は元に戻せません
            </p>
          </div>
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleDeleteAccount}
              className="border-2 flex items-center rounded-xl text-red-400 font-bold py-2.5 px-3"
            >
              {deleteStatus && (
                <div
                  className="flex justify-center mr-2"
                  aria-label="読み込み中"
                >
                  <div className="animate-spin h-3 w-3 border-2 border-gray-300 rounded-full border-t-transparent"></div>
                </div>
              )}
              退会する
            </button>
          </div>
        </Dialog.Panel>
      </Modal>
    </>
  );
}
