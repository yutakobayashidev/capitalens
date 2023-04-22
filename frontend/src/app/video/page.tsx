import { SiOpenai } from 'react-icons/si';
import { FaTwitter, FaHourglassEnd } from 'react-icons/fa';
import { BiLinkExternal } from 'react-icons/bi';
import Video from '@src/app/video/Video';

async function getMinutes() {
  const url =
    'https://kokkai.ndl.go.jp/api/meeting_list?nameOfMeeting=国土交通委員会&recordPacking=json&maximumRecords=1&nameOfHouse=参議院&from=2023-04-04&until=2023-04-04';

  const res = await fetch(url);

  if (!res.ok) return null;

  const data = await res.json();

  return data.meetingRecord[0];
}

export default async function IndexPage() {
  const minutes = await getMinutes();

  return (
    <section className='mx-auto max-w-screen-xl px-4 md:px-8'>
      <div className='md:flex block'>
        <div>
          <Video />
          <h1 className='text-3xl font-bold my-3 items-center flex'>
            <span
              className={`bg-[#007ABB] text-white rounded-md font-bold mr-3 text-xl py-1.5 px-4`}
            >
              参議院
            </span>
            国土交通委員会 第5号 23/04/04
          </h1>
          <div className='flex items-center mb-3 justify-between'>
            <div className='flex itmes-center text-lg'>
              <p className='mr-2'>2023年4月4日</p>
              <p className='flex items-center'>
                <FaHourglassEnd className='text-gray-400 mr-1' />
                5分
              </p>
            </div>
            <a
              href='https://twitter.com/intent/tweet?text=参議院 国土交通委員会 第5号 23/04/04&url=http://localhost:3000/video'
              className='bg-[#00acee] text-white inline-flex items-center font-semibold px-4 py-2 rounded-full'
            >
              <FaTwitter className='mr-1' />
              Twitterでシェア
            </a>
          </div>
          <h2 className='text-2xl font-bold my-3'>サマリー</h2>
          <button className='flex font-bold rounded-md items-center text-white bg-[#74aa9c] px-2 py-1.5 text-lg'>
            <SiOpenai className='mr-2' />
            ChatGPTで要約
          </button>
          <div className='bg-gray-50 leading-7 mt-5 border mb-3 rounded-lg ext-base p-4'>
            「ChatGPTで要約」ボタンをタップしてください。
          </div>
          <h2 className='text-2xl font-bold'>発言を行った議員</h2>
          <h2 className='text-2xl font-bold mb-3'>関連リンク</h2>
          <p className='mb-3'>
            本ページは、インターネット審議中継と国会会議録検索システムからデータを引用しています。
          </p>
          <div className='grid gap-5 grid-cols-2'>
            {minutes.meetingURL && (
              <a
                href={minutes.meetingURL}
                className='p-10 text-gray-800 shadow-lg flex font-bold items-center border rounded-lg'
              >
                国会会議録検索システム
                <BiLinkExternal className='ml-2' />
              </a>
            )}
            <a className='p-10 text-gray-800 shadow-lg flex font-bold items-center border rounded-lg'>
              参議院インターネット審議中継
              <BiLinkExternal className='ml-2' />
            </a>
          </div>
        </div>
        <div>
          <h2 className='text-2xl font-bold'>トランスクリプト</h2>
          <h1>関連する国会中継アーカイブ</h1>
        </div>
      </div>
    </section>
  );
}
