import { auth } from "@auth";
import { config } from "@site.config";
import Meetings from "@src/components/meetings/meetings";
import Topics from "@src/components/topics/topics";
import prisma from "@src/lib/prisma";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export const revalidate = 3600;

async function fetchItemsByStatus() {
  const groups = [
    "自由民主党",
    "立憲民主党",
    "公明党",
    "日本共産党",
    "日本維新の会",
    "国民民主党",
    "れいわ新選組",
  ];

  const queries = groups.map((group) =>
    prisma.member.findMany({
      take: 12,
      where: {
        group: {
          name: group,
        },
      },
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
    orderBy: {
      count: "desc",
    },
    select: {
      name: true,
    },
    take: 50,
  });

  return data;
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
  const billPromise = getBillWithCommentCounts();
  const groupsPromise = prisma.group.findMany();
  const meetingsPromise = prisma.video.findMany({
    orderBy: [
      {
        date: "desc",
      },
    ],
  });
  const membersByGroup = await fetchItemsByStatus();
  const sessionPromise = auth();

  const [topics, bills, groups, meetings, session] = await Promise.all([
    topicsPromise,
    billPromise,
    groupsPromise,
    meetingsPromise,
    sessionPromise,
  ]);

  return (
    <>
      <section className="bg-[#f9eaeb] py-12">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h1 className="mb-5 text-3xl font-bold">国のデータを整理する</h1>
          <p className="mb-3 text-lg text-gray-500">
            本プロジェクトは、国会での議論、提出された法案、国会議員の情報などを整理し、視覚的に表示することを目的としています。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-base font-semibold transition-all duration-500 ease-in-out hover:shadow"
              href={config.SocialLinks.github}
            >
              <FaGithub className="mr-3 align-middle text-xl" />
              開発に貢献する
            </a>
            <a
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-base font-semibold transition-all duration-500 ease-in-out hover:shadow"
              href="https://github.com/users/yutakobayashidev/projects/2"
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center align-middle text-xl">
                🚀
              </span>
              ロードマップ
            </a>
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-5 text-2xl font-bold">最新の会議</h2>
          <Meetings user={session?.user} meetings={meetings} />
        </div>
      </section>
      <section className="bg-gray-100 py-8">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-5 text-2xl font-bold">政党から探す</h2>
          <div className="grid grid-cols-1 gap-y-5 md:grid-cols-4">
            {groups.map((group) => (
              <Link
                href={`/group/${group.id}`}
                className="flex items-center"
                key={group.id}
              >
                <img
                  className="rounded-2xl border"
                  src={group.image ?? "/noimage.png"}
                  alt={group.name}
                  width={100}
                  height={100}
                />
                <p className="ml-3 font-bold">{group.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {Object.keys(membersByGroup).map((group) => (
        <section key={group} className="py-8">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <h2 className="mb-5 text-2xl font-bold">{group}</h2>
            <div className="hidden-scrollbar flex flex-nowrap space-x-3 overflow-x-auto md:space-x-6">
              {membersByGroup[group].map((member) => (
                <Link href={`/members/${member.id}`} key={member.id}>
                  <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl md:h-36 md:w-36">
                    <img
                      src={member.image}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      alt={member.name}
                    />
                  </div>
                  <div className="w-full truncate text-center">
                    <div className="my-3 text-xl font-bold">{member.name}</div>
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
      <section className="bg-gray-100 py-8">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-5 text-2xl font-bold">注目のトピック</h2>
          <Topics topics={topics} />
          <Link
            href="/topics"
            className="mt-8 block text-center text-[#0f41af] hover:text-[#222] hover:underline"
          >
            注目のトピックをもっと見る -&gt;
          </Link>
        </div>
      </section>
      <section className="bg-blue-50 py-8">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-5 text-2xl font-bold">法案を議論する</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {bills.map((bill, i) => (
              <Link
                key={i}
                href={`/bill/${bill.id}`}
                className="block border border-gray-200 bg-white px-6 py-4"
              >
                <div className="mb-4 text-5xl">⚖️</div>
                <h2 className="mb-5 line-clamp-3 text-xl font-semibold">
                  {bill.name}
                </h2>
                <p className="line-clamp-3 text-gray-400">{bill.reason}</p>
                <div className="mt-3">
                  <span className="mr-2 rounded bg-blue-400 p-1 text-sm text-white">
                    賛成
                    <span className="ml-2 font-bold">
                      {bill.agreementCount}
                    </span>
                  </span>
                  <span className="mr-2 rounded bg-yellow-400 p-1 text-sm text-white">
                    どちらもでない
                    <span className="ml-2 font-bold">{bill.neutralCount}</span>
                  </span>
                  <span className="mr-2 rounded bg-red-400 px-2 py-1 text-sm text-white">
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
    </>
  );
}
