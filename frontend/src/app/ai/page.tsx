'use client';

import React, { useState } from 'react';
import FaceDetection from '@src/app/ai/FaceDetection';

const IndexPage = () => {
  const [name, setName] = useState<string | null>(null);

  const handleFaceDetect = (name: string) => {
    setName(name);
  };

  return (
    <section>
      <div>
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
