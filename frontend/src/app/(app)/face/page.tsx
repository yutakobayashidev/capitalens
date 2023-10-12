"use client";

import FaceDetection from "@src/app/(app)/face/FaceDetection";
import PersonModal from "@src/app/(app)/face/PersonModal";
import { getMember } from "@src/app/actions";
import { Member } from "@src/types/member";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const useMember = () => {
  const [member, setMember] = useState<Member | null>(null);

  const fetchMember = async (name: string) => {
    getMember(name)
      .then((res) => {
        console.log(res);
        setMember(res);

        if (!res) {
          toast.error("人物が見つかりませんでした");
        }
      })
      .catch((e) => {
        toast.error("問題が発生しました");
      });
  };

  const clearMember = () => setMember(null);

  return { clearMember, fetchMember, member };
};

export default function Page() {
  const { clearMember, fetchMember, member } = useMember();

  const handleFaceDetect = async (name: string) => {
    console.log(name);
    await fetchMember("岸田文雄");
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
