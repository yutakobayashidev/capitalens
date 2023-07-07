"use client";

import { Dialog } from "@headlessui/react";
import GLogo from "@public/g-logo.svg";
import { config } from "@site.config";
import Modal from "@src/app/_components/Modal";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginPrompt({ message }: { message: string }) {
  return (
    <div className="mt-3 text-center">
      <p className="mb-3 font-semibold">{message}</p>
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
        className="rounded-lg bg-primary px-4 py-2 font-bold text-white"
      >
        ログイン
      </button>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-10 text-center align-middle shadow-xl transition-all">
          <div className="mb-2 text-4xl font-bold">{config.siteMeta.title}</div>
          <div className="mt-6">
            <p className="leading-7 text-gray-600">
              ログインすると、法案に対するコメントや、AI機能の利用、新機能のテストなどが行なえます。
            </p>
          </div>
          <button
            onClick={() => signIn("google")}
            className="mt-4 inline-flex items-center justify-center rounded-xl border border-gray-200 px-10 py-4 font-semibold text-gray-600 shadow-sm md:px-6"
          >
            <span className="mr-2 inline-flex items-center">
              <GLogo width={22} height={22} />
            </span>
            <span className="hidden md:block">Googleアカウントでログイン</span>
            <span className="md:hidden">Googleでログイン</span>
          </button>
          <p className="mt-6 text-left text-sm text-gray-500">
            続行することで、
            <Link
              href="/guideline"
              className="font-medium text-primary hover:underline"
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
