import { People } from '@src/types/people';
import { peoples } from '@peoples';
import Link from 'next/link';
import Topics from '@src/components/Topics';
import prisma from '@src/lib/prisma';
import { MeetingRecord } from '@src/types/meeting';

type GroupedPeoples = {
  [key: string]: People[];
};

export const revalidate = 3600;

async function getTopicViews() {
  const data = await prisma.views.findMany({
    take: 50,
    orderBy: {
      count: 'desc',
    },
    select: {
      name: true,
    },
  });

  return data;
}

async function meeting_list() {
  const res = await fetch(
    'https://kokkai.ndl.go.jp/api/meeting_list?from=2023-04-01&recordPacking=json',
    {
      next: { revalidate: 3600 },
    }
  );

  return res.json();
}

const groupPeoples = (peoples: People[]): GroupedPeoples => {
  return peoples.reduce((groups: GroupedPeoples, person: People) => {
    const party = person.party || '無所属';
    if (!groups[party]) {
      groups[party] = [];
    }
    groups[party].push(person);
    return groups;
  }, {});
};

export default async function Page() {
  const groupedPeoples = groupPeoples(peoples);
  const topicsPromise = getTopicViews();
  const meetingPromise = meeting_list();

  const [topics, meetings] = await Promise.all([topicsPromise, meetingPromise]);

  return (
    <>
      {Object.entries(groupedPeoples).map(([party, members]) => (
        <section key={party} className='py-8'>
          <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
            <h2 className='font-bold text-2xl mb-5'>{party}</h2>
            <div className='grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-6'>
              {members.map((member) => (
                <Link
                  className='flex items-center justify-content flex-wrap text-center '
                  href={`people/${member.id}`}
                  key={member.id}
                >
                  <img
                    src={member.image}
                    className='rounded-2xl'
                    alt={member.name}
                  />
                  <div className='w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                    <div className='my-3 font-bold text-xl'>{member.name}</div>
                    <span className='text-sm text-gray-500'>{member.role}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className='py-8 bg-gray-100'>
        <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
          <h2 className='font-bold text-2xl mb-5'>注目のトピック</h2>
          <Topics topics={topics} />
          <Link
            href='/topics'
            className='mt-8 text-center block text-[#0f41af] hover:underline hover:text-[#222]'
          >
            注目のトピックをもっと見る -&gt;
          </Link>
        </div>
      </section>
      <section className='py-8 bg-gray-50'>
        <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
          <h2 className='font-bold text-2xl mb-5'>最新の議会</h2>
          {meetings.meetingRecord.map((meeting: MeetingRecord) => (
            <a
              key={meeting.session}
              href={meeting.meetingURL}
              className='text-2xl font-semibold mb-5 flex items-center'
            >
              <span className='bg-[#007ABB] text-white text-lg rounded-md font-bold mr-3 px-4 py-1'>
                {meeting.nameOfHouse}
              </span>
              {meeting.nameOfMeeting} {meeting.issue}
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
