"use client";

import { useState } from "react";
import FaceDetection from "@src/app/face/FaceDetection";
import { Member } from "@src/types/member";
import toast, { Toaster } from "react-hot-toast";
import PersonModal from "./PersonModal";

// カスタムフックを定義
const useMember = () => {
  const [member, setMember] = useState<Member | null>(null);

  const fetchMember = async (name: string) => {
    try {
      const response = await fetch(`/api/member/${name}`);
      if (response.ok) {
        const foundMember = await response.json();
        setMember(foundMember as Member);
      } else {
        toast.error("問題が発生しました");
      }
    } catch (error) {
      console.error(error);
      toast.error("問題が発生しました");
    }
  };

  const clearMember = () => setMember(null);

  return { member, fetchMember, clearMember };
};

export default function Page() {
  const { member, fetchMember, clearMember } = useMember();

  const handleFaceDetect = async (name: string) => {
    if (name !== "unknown") {
      await fetchMember(name);
    } else {
      toast.error("人物を検出できませんでした");
    }
  };

  return (
    <>
      <section>
        <div>
          <FaceDetection onFaceDetect={handleFaceDetect} />
          {member && <PersonModal member={member} onClose={clearMember} />}
        </div>
      </section>
      <Toaster position="bottom-center" />
    </>
  );
}
