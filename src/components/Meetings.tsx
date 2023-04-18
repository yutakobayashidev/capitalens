'use client';

import { Meeting } from '@src/types/meeting';
import { SiOpenai } from 'react-icons/si';
import { useState } from 'react';
import { SpeechRecord } from '@src/types/meeting';

interface Props {
  meetings: Meeting;
}

const TopicsGrid: React.FC<Props> = ({ meetings }) => {
  const [summally, SummallyId] = useState('');
  const [response, setResponse] = useState<Record<string, string>>({});
  const [api, SetAPIkey] = useState('');
  const [progress, setProgress] = useState(false);

  const callAI = async (records: SpeechRecord[]) => {
    setProgress(true);

    const speeches = records
      .slice(1)
      .map((record) => JSON.stringify(record.speech));

    const res = await fetch('/api/openai', {
      body: JSON.stringify({
        chat: speeches.join('\n'),
        key: api,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const data = await res.json();
    console.log(data);
    setProgress(false);
    setResponse((prevResponses) => ({
      ...prevResponses,
      [summally]: data.chat,
    }));
  };

  return (
    <>
      {meetings.meetingRecord.map((meeting) => (
        <div key={meeting.issueID}>
          <div className='text-2xl font-semibold mb-5 flex items-center justify-between'>
            <a href={meeting.meetingURL} className='flex-1'>
              <span className='bg-[#007ABB] text-white text-lg rounded-md font-bold mr-3 px-4 py-1'>
                {meeting.nameOfHouse}
              </span>
              {meeting.nameOfMeeting} {meeting.issue}
            </a>
            <button
              onClick={() => SummallyId(meeting.issueID)}
              className='text-lg flex items-center text-white bg-[#74aa9c] px-2 py-1 rounded-lg'
            >
              <SiOpenai className='mr-2' />
              要約
            </button>
          </div>
          {meeting.issueID == summally && (
            <>
              <p className='text-sm mb-3 text-gray-700'>
                ※ OpenAI
                APIに直接アクセスするため、APIトークンの保存などは行っていません。
              </p>
              <input
                onChange={(e) => SetAPIkey(e.target.value)}
                className='w-full mb-3 block resize-none rounded-md border-2 border-gray-200 bg-gray-100 px-4 py-2  '
                placeholder='OpenAIのAPIキーを入力...'
              ></input>
              <button
                disabled={!api}
                onClick={() => {
                  callAI(meeting.speechRecord);
                }}
                className='disabled:bg-gray-200 mb-3 text-lg flex items-center text-white bg-[#74aa9c] py-1 px-2 rounded-sm font-semibold'
              >
                <SiOpenai className='mr-2' />
                要約する
              </button>
              {progress == true ? (
                <div className='flex itmes-center'>
                  <div className='flex justify-center mr-1'>
                    <div className='animate-spin h-5 w-5 border-2  border-blue-500 rounded-full border-t-transparent'></div>
                  </div>
                  <div className='mb-3'>要約しています...</div>
                </div>
              ) : (
                <>
                  {response[meeting.issueID] && (
                    <div className='mb-3'>{response[meeting.issueID]}</div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default TopicsGrid;
