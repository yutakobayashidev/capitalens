"use client";

import FaceDetection from "@src/app/face/FaceDetection";
import { Member } from "@src/types/member";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import PersonModal from "./PersonModal";

const useMember = () => {
  const [member, setMember] = useState<Member | null>(null);

  const fetchMember = async (name: string) => {
    try {
      const response = await fetch(`/api/members/${name}`);
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

  return { clearMember, fetchMember, member };
};

export default function Page() {
  const { clearMember, fetchMember, member } = useMember();

  const handleFaceDetect = async (name: string) => {
    if (name !== "unknown") {
      await fetchMember(name);
    } else {
      toast.error("人物を検出できませんでした");
    }
  };

  return (
    <>
      <section className="my-7">
        <FaceDetection onFaceDetect={handleFaceDetect} />
        <AnimatePresence>
          {member && <PersonModal member={member} onClose={clearMember} />}
        </AnimatePresence>
      </section>
    </>
  );
}
