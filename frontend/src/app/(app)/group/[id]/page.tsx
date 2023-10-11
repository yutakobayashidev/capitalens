import { config } from "@site.config";
import Members from "@src/app/(app)/group/[id]/Members";
import Article from "@src/components/article/article";
import prisma from "@src/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiOutlineLink } from "react-icons/ai";
import { FaFacebook, FaRss, FaTwitter, FaWikipediaW } from "react-icons/fa";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { id: keyof typeof Group };
}): Promise<Metadata | undefined> {
  if (!Object.keys(Group).includes(params.id)) {
    notFound();
  }

  const group = await prisma.group.findUnique({
    include: {
      members: true,
    },
    where: { id: params.id },
  });

  if (!group) {
    notFound();
  }
  return {
    title: group.name,
    description: group.description,
    openGraph: {
      title: group.name,
      description:
        group.description ?? group.name + "の情報をチェックしましょう",
      images: [
        {
          url: group.image ?? "/noimage.png",
        },
      ],
      locale: "ja-JP",
      siteName: config.siteMeta.title,
      url: `${config.siteRoot}group/${group.id}`,
    },
    twitter: {
      title: group.name,
      card: "summary",
      description:
        group.description ?? group.name + "の情報をチェックしましょう",
      images: [group.image ?? "/noimage.png"],
    },
  };
}

enum Group {
  JIMIN,
  RIKKEN,
  KOMEI,
  KYOSAN,
  ISHIN,
  KOKUMIN,
  REIWA,
}

export default async function Page({
  params,
}: {
  params: { id: keyof typeof Group };
}) {
  if (!Object.keys(Group).includes(params.id)) {
    notFound();
  }

  const group = await prisma.group.findUnique({
    include: {
      members: true,
    },
    where: { id: params.id },
  });

  if (!group) {
    notFound();
  }

  const timeline = await prisma.timeline.findMany({
    include: {
      member: true,
    },
    orderBy: {
      isoDate: "desc",
    },
    take: 51,
    where: {
      member: {
        group: {
          id: params.id,
        },
      },
    },
  });

  return (
    <>
      <section className="mb-8 mt-5">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="block md:flex">
            <div className="w-[120px]">
              <img
                className="rounded-2xl border"
                src={group.image ?? "/noimage.png"}
                alt={group.name}
              />
            </div>
            <div className="mt-5 flex-1 text-lg md:mt-0 md:pl-5">
              <h2 className="text-2xl font-semibold">{group.name}</h2>
              <p className="mt-3">{group.description}</p>
              <div className="mt-2 flex gap-x-3">
                {group.twitter && (
                  <Link
                    aria-label={`@${group.twitter}`}
                    className="text-gray-400"
                    href={`https://twitter.com/${group.twitter}`}
                  >
                    <FaTwitter className="text-lg" />
                  </Link>
                )}
                {group.facebook && (
                  <Link
                    aria-label={`${group.facebook}`}
                    className="text-gray-400"
                    href={`https://www.facebook.com/${group.facebook}`}
                  >
                    <FaFacebook className="text-lg" />
                  </Link>
                )}
                {group.wikipedia && (
                  <a
                    aria-label="wikipedia"
                    className="text-gray-400"
                    href={group.wikipedia}
                  >
                    <FaWikipediaW className="text-lg" />
                  </a>
                )}
                {group.website && (
                  <a
                    aria-label="公式サイト"
                    className="text-gray-400"
                    href={group.website}
                  >
                    <AiOutlineLink className="text-lg" />
                  </a>
                )}
                <Link
                  aria-label={`${group.name}議員のブログ・動画をRSSで購読する`}
                  className="text-lg text-gray-400"
                  href={`/group/${group.id}/feed`}
                >
                  <FaRss className="text-lg" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-5">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-5 text-2xl font-bold md:text-4xl">
            最新の議員のブログ・動画
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {timeline.length === 0 ? (
              <p className="mb-5 text-lg text-gray-600">見つかりませんでした</p>
            ) : (
              <>
                {timeline.map((item) => (
                  <Article item={item} key={item.id} />
                ))}
              </>
            )}
          </div>
        </div>
      </section>
      <section className="mb-5">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="mb-3 text-2xl font-bold md:text-4xl">議員</h2>
          <p className="mb-3 text-lg text-gray-600">
            {group.members.length}人の議員が見つかりました
          </p>
          <Members members={group.members} />
        </div>
      </section>
    </>
  );
}
