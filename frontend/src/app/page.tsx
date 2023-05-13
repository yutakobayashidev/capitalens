import Link from "next/link";
import Topics from "@src/components/Topics";
import Meetings from "@src/components/Meetings";
import prisma from "@src/lib/prisma";

export const revalidate = 3600;

async function fetchItemsByStatus() {
  const groups = [
    "JIMIN",
    "RIKKEN",
    "KOMEI",
    "KYOSAN",
    "ISHIN",
    "KOKUMIN",
    "REIWA",
  ];

  const queries = groups.map((group) =>
    prisma.member.findMany({
      where: {
        group: {
          equals: group as any,
        },
      },
      take: 12,
    })
  );

  const results = await Promise.all(queries);

  const groupResults: Record<string, any[]> = {};

  for (let i = 0; i < groups.length; i++) {
    groupResults[groups[i]] = results[i];
  }

  return groupResults;
}

async function getTopicViews() {
  const data = await prisma.views.findMany({
    take: 50,
    orderBy: {
      count: "desc",
    },
    select: {
      name: true,
    },
  });

  return data;
}

async function meeting_list() {
  const res = await fetch(
    "https://kokkai.ndl.go.jp/api/meeting?from=2023-04-01&recordPacking=json",
    {
      next: { revalidate: 3600 },
    }
  );

  return res.json();
}

async function getBillWithCommentCounts() {
  const bills = await prisma.bill.findMany({
    include: {
      comments: {
        select: {
          type: true,
        },
      },
    },
  });

  const billsWithCommentCounts = bills.map((bill) => {
    const agreementCount = bill.comments.filter(
      (comment) => comment.type === "AGREEMENT"
    ).length;
    const neutralCount = bill.comments.filter(
      (comment) => comment.type === "NEUTRAL"
    ).length;
    const oppositionCount = bill.comments.filter(
      (comment) => comment.type === "OPPOSITION"
    ).length;

    return {
      ...bill,
      agreementCount,
      neutralCount,
      oppositionCount,
    };
  });

  return billsWithCommentCounts;
}

export default async function Page() {
  const topicsPromise = getTopicViews();
  const meetingPromise = meeting_list();
  const billPromise = getBillWithCommentCounts();

  const membersByGroup = await fetchItemsByStatus();
  const [topics, meetings, bills] = await Promise.all([
    topicsPromise,
    meetingPromise,
    billPromise,
  ]);

  return (
    <>
      {Object.keys(membersByGroup).map((group) => (
        <section key={group} className="py-8">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <h2 className="font-bold text-2xl mb-5">{group}</h2>
            <div className="flex flex-nowrap space-x-3 md:space-x-6 hidden-scrollbar overflow-x-auto">
              {membersByGroup[group].map((member) => (
                <Link href={`/people/${member.id}`} key={member.id}>
                  <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto overflow-hidden rounded-2xl">
                    <img
                      src={member.image}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      alt={member.name}
                    />
                  </div>
                  <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
                    <div className="my-3 font-bold text-xl">{member.name}</div>
                    {member.house && (
                      <span className="text-sm text-gray-500">
                        {member.house == "REPRESENTATIVES"
                          ? "衆議院議員"
                          : "参議院議員"}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="py-8 bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="font-bold text-2xl mb-5">注目のトピック</h2>
          <Topics topics={topics} />
          <Link
            href="/topics"
            className="mt-8 text-center block text-[#0f41af] hover:underline hover:text-[#222]"
          >
            注目のトピックをもっと見る -&gt;
          </Link>
        </div>
      </section>
      <section className="py-8 bg-blue-50">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="font-bold text-2xl mb-5">法案を議論する</h2>
          <div className="grid md:grid-cols-3 grid-cols-2 gap-5">
            {bills.map((bill, i) => (
              <Link
                key={i}
                href={`/bill/${bill.id}`}
                className="block bg-white px-6 py-4 border border-gray-200"
              >
                <div className="text-5xl mb-4">⚖️</div>
                <h2 className="text-xl font-semibold line-clamp-3 mb-5">
                  {bill.name}
                </h2>
                <p className="text-gray-400 line-clamp-3">{bill.reason}</p>
                <div className="mt-3">
                  <span className="bg-blue-400 text-white p-1 mr-2 rounded text-sm">
                    賛成
                    <span className="ml-2 font-bold">
                      {bill.agreementCount}
                    </span>
                  </span>
                  <span className="bg-yellow-400 text-white p-1 mr-2 rounded text-sm">
                    どちらもでない
                    <span className="ml-2 font-bold">{bill.neutralCount}</span>
                  </span>
                  <span className="bg-red-400 text-white py-1 px-2 mr-2 rounded text-sm">
                    反対
                    <span className="ml-2 font-bold">
                      {bill.oppositionCount}
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-8 bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="font-bold text-2xl mb-5">最新の議会</h2>
          <p className="mb-3">
            ChatGPTのAPIを使用して、議会での議論を簡単に要約できます。ただし、必ずしも正確な情報を提供できない可能性があるため、情報の確認や補完が必要です。短時間で議論の概要を把握するのに役立ちます。
          </p>
          <Meetings meetings={meetings} />
        </div>
      </section>
    </>
  );
}
