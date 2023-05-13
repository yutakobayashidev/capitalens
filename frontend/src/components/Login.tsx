"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import GLogo from "@public/g-logo.svg";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function LoginModal({ isOpen, setIsOpen }: LoginModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-10 text-center align-middle shadow-xl transition-all">
                <div className="text-4xl mb-2 font-bold">国会分析</div>
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
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
