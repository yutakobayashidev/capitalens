"use client";

import { useState } from "react";
import LoginModal from "@src/app/_components/Login";
import { AiOutlineLink } from "react-icons/ai";

export function Login() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  return (
    <div>
      <button
        onClick={handleLoginModal}
        className="bg-primary text-white font-bold px-4 py-2 rounded-lg"
      >
        ログイン
      </button>
      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
      )}
    </div>
  );
}

export function Clipboard() {
  const [button, setButton] = useState(false);

  const copyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setButton(true);
    } catch (err) {
      console.error("リンクのコピーに失敗しました:", err);
    }
  };

  return (
    <button
      className="rounded-lg bg-white hover:shadow-md transition duration-500 border block text-center md:px-4 md:py-6 py-4 px-2"
      onClick={copyLink}
    >
      <div className="flex justify-center">
        {button ? (
          <span className="mb-3 text-4xl">✨</span>
        ) : (
          <AiOutlineLink className="mb-3 text-4xl text-gray-400" />
        )}
      </div>
      <span className="font-bold">
        {button ? "コピーしました" : "リンクをコピー"}
      </span>
    </button>
  );
}
