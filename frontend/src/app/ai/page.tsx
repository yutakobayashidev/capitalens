"use client";

import { useState } from "react";
import FaceDetection from "@src/app/ai/FaceDetection";
import { People } from "@src/types/people";
import Link from "next/link";
import prisma from "@src/lib/prisma";

const IndexPage = () => {
  const [people, setPeople] = useState<People | null>(null);

  const [error, setError] = useState(false);

  const handleFaceDetect = async (name: string) => {
    if (name !== "unknown") {
      try {
        const response = await fetch(`/api/people/${name}`);
        if (response.ok) {
          const foundPeople = await response.json();
          setError(false);
          setPeople(foundPeople as People);
        } else if (response.status === 404) {
          setError(true);
        } else {
          throw new Error("Internal server error");
        }
      } catch (error) {
        console.error(error);
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  return (
    <section>
      <div>
        <FaceDetection onFaceDetect={handleFaceDetect} />
        <div className="mt-10">
          {error === true ? (
            <p className="text-4xl font-bold">見つかりませんでした</p>
          ) : (
            <>
              {people && people.name && (
                <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                  <div className="flex items-center">
                    <img
                      className="rounded-full border w-16 h-16 mr-3 object-cover object-center"
                      src={people.image}
                      alt={people.name}
                    />
                    <div>
                      <h1 className="font-bold text-xl">{people.name}</h1>
                      <p className="text-gray-400 text-sm">{people.role}</p>
                    </div>
                  </div>
                  <p className="my-3 text-gray-700">{people.bio}</p>
                  <h2 className="text-gray-400 font-bold mb-3">データ</h2>
                  {people.group && (
                    <div className="flex items-center mb-3">
                      <div className="w-[55px] h-[55px] mr-2 flex justify-center items-center bg-blue-100 text-2xl rounded-full text-center">
                        <span>🏛️</span>
                      </div>
                      <div className="font-semibold">{people.group}</div>
                    </div>
                  )}
                  {people.win && (
                    <div className="flex items-center mb-3">
                      <div className="w-[55px] h-[55px] mr-2 flex justify-center items-center bg-red-300 text-2xl rounded-full text-center">
                        <span>🎉</span>
                      </div>
                      <div className="font-semibold">{people.win}回の当選</div>
                    </div>
                  )}
                  <Link
                    className="mb-5 block text-[#0f41af]"
                    href={`/people/${people.id}`}
                  >
                    情報を詳しく見る -&gt;
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default IndexPage;
