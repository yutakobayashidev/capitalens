'use client';

import React, { useState } from 'react';
import FaceDetection from '@src/app/ai/FaceDetection';

const IndexPage = () => {
  const [name, setName] = useState<string | null>(null);

  const handleFaceDetect = (name: string) => {
    setName(name);
  };

  return (
    <section className='py-8'>
      <div className='mx-auto max-w-md px-4 md:px-8'>
        <h1 className='text-4xl font-bold mb-6 text-center'>
          Face API × Next.js
        </h1>
        <FaceDetection onFaceDetect={handleFaceDetect} />
        {name !== null && (
          <div className='mt-10 text-center'>
            {name === 'unknown' ? (
              <p className='text-4xl font-bold'>見つかりませんでした</p>
            ) : (
              <p className='text-4xl font-bold'>{name}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default IndexPage;
