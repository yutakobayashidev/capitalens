import prisma from "@src/lib/prisma";
import Link from "next/link";
import { FaRss, FaTwitter, FaFacebook, FaWikipediaW } from "react-icons/fa";
import { AiOutlineLink } from "react-icons/ai";
import Article from "@src/app/group/Article";

export const revalidate = 3600;

export default async function Page() {
  const timeline = await prisma.timeline.findMany({
    where: {
      member: {
        group: "JIMIN",
      },
    },
    include: {
      member: true,
    },
    orderBy: {
      isoDate: "desc",
    },
    take: 51,
  });

  const group = {
    name: "自由民主党",
    twitter: "jimin_koho",
    facebook: "jimin.official",
    wikipedia:
      "https://ja.wikipedia.org/wiki/%E8%87%AA%E7%94%B1%E6%B0%91%E4%B8%BB%E5%85%9A_(%E6%97%A5%E6%9C%AC)",
    website: "https://www.jimin.jp",
    image:
      "https://pbs.twimg.com/profile_images/1532645750521606145/CQPpEZtc_400x400.jpg",
    description:
      "自由民主党（じゆうみんしゅとう、英: Liberal Democratic Party[54]、英文略称: LDP[55] / Lib Dems[56]）は、日本の政党。自由主義を掲げ、つねに改革を進める保守政党を標榜している[36][38]。",
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 md:px-8">
      <div className="md:flex block mt-5 mb-8">
        <div className="w-[120px]">
          <img
            className="border rounded-2xl"
            src={group.image}
            alt={group.name}
          />
        </div>
        <div className="flex-1 md:pl-5 text-lg mt-5 md:mt-0">
          <h2 className="text-2xl font-semibold">{group.name}</h2>
          <p className="mt-3">{group.description}</p>
          <div className="flex gap-x-3 mt-2">
            <Link
              aria-label={`@${group.twitter}`}
              className="text-gray-400"
              href={`https://twitter.com/${group.twitter}`}
            >
              <FaTwitter className="text-lg" />
            </Link>
            <Link
              aria-label={`${group.facebook}`}
              className="text-gray-400"
              href={`https://www.facebook.com/${group.facebook}`}
            >
              <FaFacebook className="text-lg" />
            </Link>
            <Link
              aria-label="wikipedia"
              className="text-gray-400"
              href={group.wikipedia}
            >
              <FaWikipediaW className="text-lg" />
            </Link>
            <Link
              aria-label="公式サイト"
              className="text-gray-400"
              href={group.website}
            >
              <AiOutlineLink className="text-lg" />
            </Link>
            <Link
              aria-label={`${group.name}議員のブログ・動画をRSSで購読する`}
              className="text-gray-400 text-lg"
              href="/group/feed"
            >
              <FaRss className="text-lg" />
            </Link>
          </div>
        </div>
      </div>
      <h2 className="md:text-4xl text-2xl font-bold mb-5">データ</h2>
      <h2 className="md:text-4xl text-2xl font-bold mb-5">
        最新の議員のブログ・動画
      </h2>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-8 mb-5">
        {timeline.map((item) => (
          <Article item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
