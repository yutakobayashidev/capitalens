"use client";
import React, { useState } from "react";
import FaceDetection from "@src/app/ai/FaceDetection";

const IndexPage = () => {
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  const handleFaceDetect = (age: number, gender: string) => {
    setAge(age);
    setGender(gender);
  };

  return (
    <section className="py-8">
      <div className="mx-auto max-w-md px-4 md:px-8">
        <h1 className="text-4xl font-bold mb-6">Face API × Next.js</h1>
        <FaceDetection onFaceDetect={handleFaceDetect} />
        {age !== null && gender !== null && (
          <div className="mt-4">
            <p>Age: {age.toFixed(0)}</p>
            <p>Gender: {gender}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default IndexPage;
