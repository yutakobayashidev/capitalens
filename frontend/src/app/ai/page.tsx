'use client';

import { useState } from 'react';
import FaceDetection from '@src/app/ai/FaceDetection';
import { getPeopleByName } from '@src/helper/people';
import { People } from '@src/types/people';
import Link from 'next/link';

const IndexPage = () => {
  const [name, setName] = useState<People | null>(null);

  const [error, setError] = useState(false);

  const handleFaceDetect = (name: string) => {
    if (name !== 'unknown') {
      const people = getPeopleByName(name);
      if (people) {
        setName(people);
      } else {
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
        <div className='mt-10'>
          {error === true ? (
            <p className='text-4xl font-bold'>見つかりませんでした</p>
          ) : (
            <>
              {name && name.name && (
                <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
                  <div className='flex items-center'>
                    <img
                      className='rounded-full mr-3'
                      height={60}
                      width={60}
                      src={name.image}
                      alt={name.name}
                    />
                    <h1 className='text-2xl font-bold'>{name.name}</h1>
                  </div>
                  <p className='my-3'>{name.bio}</p>
                  <Link
                    className='mb-5 block text-[#0f41af]'
                    href={`/people/${name.id}`}
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
