'use client';

import { Meeting } from '@src/types/meeting';
import { SiOpenai } from 'react-icons/si';
import { useState } from 'react';
import { SpeechRecord } from '@src/types/meeting';
import { fetchEventSource } from '@microsoft/fetch-event-source';

interface Props {
  meetings: Meeting;
}

class APIError extends Error {}

const Meetings: React.FC<Props> = ({ meetings }) => {
  const [summally, SummallyId] = useState('');
  const [api, SetAPIkey] = useState('');
  const [translatedSummaries, setTranslatedSummaries] = useState<{
    [issueID: string]: string;
  }>({});

  const [start, Setstart] = useState(false);

  const callAI = async (records: SpeechRecord[], issueID: string) => {
    if (!api) {
      alert('No API Key');
    }

    const speeches = records
      .slice(1)
      .map((record) => JSON.stringify(record.speech));

    Setstart(true);

    try {
      await fetchEventSource('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                '入力された国会の議事録を要約してください。\n制約条件\n・文章は簡潔にわかりやすく。\n・重要なキーワードは取り逃がさない。',
            },
            { role: 'user', content: speeches.join('\n') },
          ],
          stream: true,
        }),
        async onopen(response) {
          if (response.status >= 400) {
            const res = await response.json();
            const errMessage =
              res.error?.message || response.statusText || response.status;

            throw new APIError(errMessage);
          }
        },
        onmessage(ev) {
          if (ev.data === '[DONE]') {
            Setstart(false);
            return;
          }

          const data = JSON.parse(ev.data);
          const content = data.choices?.[0]?.delta?.content;
          if (content) {
            setTranslatedSummaries((prevState) => ({
              ...prevState,
              [issueID]: prevState[issueID]
                ? prevState[issueID] + content
                : content,
            }));
          }
        },
        onerror(err) {
          throw err;
        },
      });
    } catch (err: any) {
      alert(err.message);
    }

    Setstart(false);
  };

  return (
    <>
      <input
        onChange={(e) => SetAPIkey(e.target.value)}
        className='w-full mb-3 block resize-none rounded-md border-2 border-gray-200 bg-gray-100 px-4 py-2  '
        placeholder='OpenAIのAPIキーを入力...'
      ></input>
      {meetings.meetingRecord.map((meeting) => (
        <div key={meeting.issueID}>
          <div className='text-2xl font-semibold mb-5 flex items-center justify-between'>
            <a href={meeting.meetingURL} className='flex-1'>
              <span
                className={`${
                  meeting.nameOfHouse === '参議院'
                    ? 'bg-[#007ABB]'
                    : 'bg-[#EA5433]'
                } text-white text-lg rounded-md font-bold mr-3 px-4 py-1`}
              >
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
              <button
                disabled={!api || start}
                onClick={() => {
                  callAI(meeting.speechRecord, meeting.issueID);
                }}
                className='disabled:bg-gray-200 mb-3 text-lg flex items-center text-white bg-[#74aa9c] py-1 px-2 rounded-sm font-semibold'
              >
                <SiOpenai className='mr-2' />
                要約する
              </button>
              <>
                <div className='mb-3'>
                  {translatedSummaries[meeting.issueID]}
                </div>
              </>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default Meetings;
