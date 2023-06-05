import prisma from "@src/lib/prisma";
import Link from "next/link";
import { FaRss, FaTwitter, FaFacebook, FaWikipediaW } from "react-icons/fa";
import { AiOutlineLink } from "react-icons/ai";
import Article from "@src/app/group/Article";
import { notFound } from "next/navigation";
import Members from "@src/app/group/[id]/Members";
import type { Metadata } from "next";
import { config } from "@site.config";

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
    where: { id: params.id },
    include: {
      members: true,
    },
  });

  if (!group) {
    notFound();
  }
  return {
    title: group.name,
    description: group.description,
    twitter: {
      card: "summary",
      title: group.name,
      description:
        group.description ?? group.name + "の情報をチェックしましょう",
      images: [group.image ?? "/noimage.png"],
    },
    openGraph: {
      title: group.name,
      siteName: config.siteMeta.title,
      url: `${config.siteRoot}group/${group.id}`,
      description:
        group.description ?? group.name + "の情報をチェックしましょう",
      locale: "ja-JP",
      images: [
        {
          url: group.image ?? "/noimage.png",
        },
      ],
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
    where: { id: params.id },
    include: {
      members: true,
    },
  });

  if (!group) {
    notFound();
  }

  const timeline = await prisma.timeline.findMany({
    where: {
      member: {
        group: {
          id: params.id,
        },
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

  return (
    <>
      <section className="mt-5 mb-8">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="md:flex block">
            <div className="w-[120px]">
              <img
                className="border rounded-2xl"
                src={group.image ?? "/noimage.png"}
                alt={group.name}
              />
            </div>
            <div className="flex-1 md:pl-5 text-lg mt-5 md:mt-0">
              <h2 className="text-2xl font-semibold">{group.name}</h2>
              <p className="mt-3">{group.description}</p>
              <div className="flex gap-x-3 mt-2">
                {group.twitter && (
                  <Link
                    aria-label={`@${group.twitter}`}
                    className="text-gray-400"
                    href={`https://twitter.com/${group.twitter}`}
                  >
                    <FaTwitter className="text-lg" />
                  </Link>
                )}
                <Link
                  aria-label={`${group.facebook}`}
                  className="text-gray-400"
                  href={`https://www.facebook.com/${group.facebook}`}
                >
                  <FaFacebook className="text-lg" />
                </Link>
                {group.wikipedia && (
                  <Link
                    aria-label="wikipedia"
                    className="text-gray-400"
                    href={group.wikipedia}
                  >
                    <FaWikipediaW className="text-lg" />
                  </Link>
                )}
                {group.website && (
                  <Link
                    aria-label="公式サイト"
                    className="text-gray-400"
                    href={group.website}
                  >
                    <AiOutlineLink className="text-lg" />
                  </Link>
                )}
                <Link
                  aria-label={`${group.name}議員のブログ・動画をRSSで購読する`}
                  className="text-gray-400 text-lg"
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
          <h2 className="md:text-4xl text-2xl font-bold mb-5">
            最新の議員のブログ・動画
          </h2>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
            {timeline.length === 0 ? (
              <p className="mb-5 text-gray-600 text-lg">見つかりませんでした</p>
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
          <h2 className="md:text-4xl text-2xl font-bold mb-3">議員</h2>
          <p className="mb-3 text-gray-600 text-lg">
            {group.members.length}人の議員が見つかりました
          </p>
          <Members members={group.members} />
        </div>
      </section>
    </>
  );
}
