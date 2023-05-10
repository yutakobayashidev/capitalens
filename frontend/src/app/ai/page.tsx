"use client";

import { useState } from "react";
import FaceDetection from "@src/app/ai/FaceDetection";
import { People } from "@src/types/people";
import toast, { Toaster } from "react-hot-toast";
import PersonModal from "./PersonModal";

// カスタムフックを定義
const usePeople = () => {
  const [people, setPeople] = useState<People | null>(null);

  const fetchPeople = async (name: string) => {
    try {
      const response = await fetch(`/api/people/${name}`);
      if (response.ok) {
        const foundPeople = await response.json();
        setPeople(foundPeople as People);
      } else {
        toast.error("問題が発生しました");
      }
    } catch (error) {
      console.error(error);
      toast.error("問題が発生しました");
    }
  };

  const clearPeople = () => setPeople(null);

  return { people, fetchPeople, clearPeople };
};

export default function Page() {
  const { people, fetchPeople, clearPeople } = usePeople();

  const handleFaceDetect = async (name: string) => {
    if (name !== "unknown") {
      await fetchPeople(name);
    } else {
      toast.error("人物を検出できませんでした");
    }
  };

  return (
    <>
      <section>
        <div>
          <FaceDetection onFaceDetect={handleFaceDetect} />
          {people && <PersonModal people={people} onClose={clearPeople} />}
        </div>
      </section>
      <Toaster position="bottom-center" />
    </>
  );
}
