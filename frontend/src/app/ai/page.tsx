'use client';

import { useState } from 'react';
import FaceDetection from '@src/app/ai/FaceDetection';
import { getPeopleByName } from '@src/helper/people';
import { People } from '@src/types/people';
import Link from 'next/link';

const IndexPage = () => {
  const [people, setPeople] = useState<People | null>(null);

  const [error, setError] = useState(false);

  const handleFaceDetect = (name: string) => {
    if (name !== 'unknown') {
      const people = getPeopleByName(name);
      if (people) {
        setError(false);
        setPeople(people);
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
              {people && people.name && (
                <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
                  <div className='flex items-center'>
                    <img
                      className='rounded-full mr-3'
                      height={60}
                      width={60}
                      src={people.image}
                      alt={people.name}
                    />
                    <div>
                      <h1 className='font-bold text-xl'>{people.name}</h1>
                      <p className='text-gray-400 text-sm'>{people.role}</p>
                    </div>
                  </div>
                  <p className='my-3 text-gray-700'>{people.bio}</p>
                  <h2 className='text-gray-400 font-bold mb-3'>データ</h2>
                  <div className='flex items-center mb-3'>
                    <div className='w-[55px] h-[55px] mr-2 flex justify-center items-center bg-blue-100 text-2xl rounded-full text-center'>
                      <span>🏛️</span>
                    </div>
                    <div className='font-semibold'>自由民主党</div>
                  </div>
                  <div className='flex items-center mb-3'>
                    <div className='w-[55px] h-[55px] mr-2 flex justify-center items-center bg-red-300 text-2xl rounded-full text-center'>
                      <span>🎉</span>
                    </div>
                    <div className='font-semibold'>N回の当選</div>
                  </div>
                  <Link
                    className='mb-5 block text-[#0f41af]'
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
