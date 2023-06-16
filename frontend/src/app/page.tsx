import Link from "next/link";
import Topics from "@src/app/_components/Topics";
import Meetings from "@src/app/_components/Meetings";
import prisma from "@src/lib/prisma";
import { FaGithub } from "react-icons/fa";
import { config } from "@site.config";

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
      where: {
        group: {
          name: group,
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
    "https://kokkai.ndl.go.jp/api/meeting?from=2023-05-01&recordPacking=json",
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
  const billPromise = getBillWithCommentCounts();
  const groupsPromise = prisma.group.findMany();

  const membersByGroup = await fetchItemsByStatus();
  const [topics, bills, groups] = await Promise.all([
    topicsPromise,
    billPromise,
    groupsPromise,
  ]);

  return (
    <>
      <section className="bg-[#f9eaeb] py-12">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h1 className="text-3xl font-bold mb-5">国のデータを整理する</h1>
          <p className="text-lg text-gray-500 mb-3">
            本プロジェクトは、国会での議論、提出された法案、国会議員の情報などを整理し、視覚的に表示することを目的としています。
          </p>
          <div className="flex items-center gap-x-3">
            <Link
              className="bg-white rounded-full font-semibold px-4 py-2 inline-flex items-center text-base transition-all duration-500 ease-in-out hover:shadow"
              href={config.SocialLinks.github}
            >
              <FaGithub className="text-xl mr-3 align-middle" />
              開発に貢献する
            </Link>
            <Link
              className="bg-white font-semibold rounded-full px-4 py-2 inline-flex items-center text-base transition-all duration-500 ease-in-out hover:shadow"
              href="https://github.com/users/yutakobayashidev/projects/2"
            >
              <span className="text-xl mr-3 align-middle inline-flex items-center w-6 h-6 justify-center">
                🚀
              </span>
              ロードマップ
            </Link>
          </div>
        </div>
      </section>
      <section className="py-8 bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="font-bold text-2xl mb-5">政党から探す</h2>
          <div className="grid md:grid-cols-4 grid-cols-1 gap-y-5">
            {groups.map((group) => (
              <Link
                href={`/group/${group.id}`}
                className="flex items-center"
                key={group.id}
              >
                <img
                  className="border rounded-2xl"
                  src={group.image ?? "/noimage.png"}
                  alt={group.name}
                  width={100}
                  height={100}
                />
                <p className="font-bold ml-3">{group.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {Object.keys(membersByGroup).map((group) => (
        <section key={group} className="py-8">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <h2 className="font-bold text-2xl mb-5">{group}</h2>
            <div className="flex flex-nowrap space-x-3 md:space-x-6 hidden-scrollbar overflow-x-auto">
              {membersByGroup[group].map((member) => (
                <Link href={`/members/${member.id}`} key={member.id}>
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
      <section className="py-8">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="font-bold text-2xl mb-5">最新の議会</h2>
          <Meetings />
        </div>
      </section>
    </>
  );
}
