"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import GLogo from "@public/g-logo.svg";
import { config } from "@site.config";
import { Dialog } from "@headlessui/react";
import Modal from "@src/app/_components/Modal";
import { useState } from "react";

export function LoginPrompt({ message }: { message: string }) {
  return (
    <div className="text-center mt-3">
      <p className="font-semibold mb-3">{message}</p>
      <Login />
    </div>
  );
}

export function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <button
        onClick={handleModal}
        className="bg-primary text-white font-bold px-4 py-2 rounded-lg"
      >
        ログイン
      </button>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-10 text-center align-middle shadow-xl transition-all">
          <div className="text-4xl mb-2 font-bold">{config.siteMeta.title}</div>
          <div className="mt-6">
            <p className="text-gray-600 leading-7">
              ログインすると、法案に対するコメントや、AI機能の利用、新機能のテストなどが行なえます。
            </p>
          </div>
          <button
            onClick={() => signIn("google")}
            className="inline-flex items-center justify-center mt-4 border border-gray-200 px-6 py-4 rounded-xl text-gray-600 font-semibold shadow-sm"
          >
            <span className="mr-2 inline-flex items-center">
              <GLogo width={22} height={22} />
            </span>
            Googleアカウントでログイン
          </button>
          <p className="text-left mt-6 text-sm text-gray-500">
            続行することで、
            <Link
              href="/guideline"
              className="text-primary font-medium hover:underline"
            >
              ガイドライン
            </Link>
            、
            <Link
              href="/privacy"
              className="font-medium text-primary hover:underline"
            >
              プライバシーポリシー
            </Link>
            に同意したものと見なされます。
          </p>
        </Dialog.Panel>
      </Modal>
    </div>
  );
}
