import Form from "@src/app/bill/[id]/form";
import { FaTwitter } from "react-icons/fa";
import { BsLine } from "react-icons/bs";
import { Clipboard } from "@src/app/bill/[id]/actions";
import prisma from "@src/lib/prisma";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

async function getBill(id: string) {
  const bill = await prisma.bill.findUnique({
    where: { id },
  });

  if (!bill) {
    notFound();
  }

  return bill;
}

type CommentType = "AGREEMENT" | "NEUTRAL" | "OPPOSITION";

type CountObject = {
  [key in CommentType]: number;
};

async function getDiscussion(id: string) {
  const data = await prisma.comment.findMany({
    where: { bill: { id } },
    include: {
      _count: { select: { votes: true } },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const json = JSON.parse(JSON.stringify(data));

  return json;
}

type Bill = {
  id: string;
  name: string;
  reason: string;
};

type ShareSectionProps = {
  bill: Bill;
};

type ShareButtonProps = {
  href: string;
  icon: JSX.Element;
  label: string;
};

async function getCount(id: string) {
  const count = await prisma.comment.groupBy({
    by: ["type"],
    where: { billId: id },
    _count: { type: true },
  });

  const initialCount: CountObject = {
    AGREEMENT: 0,
    NEUTRAL: 0,
    OPPOSITION: 0,
  };

  return count.reduce((acc: CountObject, curr) => {
    acc[curr.type] = curr._count.type;
    return acc;
  }, initialCount);
}

function ShareSection({ bill }: ShareSectionProps) {
  const tweet = `https://twitter.com/share?url=https://parliament-data.vercel.app/bill/${
    bill.id
  }&text=${"📑" + bill.name + "について議論しましょう"}&hashtags=国会発言分析`;

  const line = `https://social-plugins.line.me/lineit/share?url=https://parliament-data.vercel.app/bill/${bill.id}`;

  return (
    <section className="bg-gray-100 py-12">
      <div className="mx-auto max-w-screen-md px-4 md:px-8">
        <h1 className="text-center text-3xl md:text-4xl font-bold mb-5">
          この議論をシェアしよう
        </h1>
        <div className="grid grid-cols-3 gap-x-4">
          <ShareButton
            href={tweet}
            icon={<FaTwitter className="text-[#1da1f2] mb-3 text-4xl" />}
            label="ツイートする"
          />
          <ShareButton
            href={line}
            icon={<BsLine className="text-[#06C755] mb-3 text-4xl" />}
            label="シェアする"
          />
          <Clipboard />
        </div>
      </div>
    </section>
  );
}

function ShareButton({ href, icon, label }: ShareButtonProps) {
  return (
    <a
      href={href}
      className="rounded-lg bg-white hover:shadow-md transition duration-500 border block text-center md:px-4 md:py-6 py-4 px-2"
    >
      <div className="flex justify-center">{icon}</div>
      <span className="font-bold">{label}</span>
    </a>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  const bill = await getBill(params.id);

  const ogImage = `https://parliament-data.vercel.app/opengraph.jpg`;

  return {
    title: bill.name,
    description: bill.reason,
    twitter: {
      card: "summary_large_image",
      title: bill.name,
      description: bill.reason,
      images: [ogImage],
    },
    openGraph: {
      title: bill.name,
      siteName: "国会発言分析",
      url: `https://parliament-data.vercel.app/bill/${bill.id}`,
      description: bill.reason,
      locale: "ja-JP",
      images: [
        {
          url: ogImage,
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const bill = await getBill(params.id);
  const discussion = await getDiscussion(params.id);
  const count = await getCount(params.id);

  return (
    <>
      <section className="my-8">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="md:flex">
            <div className="flex-1 md:mr-6">
              <Form discussion={discussion} bill={bill} count={count} />
            </div>
            <div className="flex-1 mt-5 md:mt-0">
              <h1 className="text-3xl font-bold mb-3">{bill.name}</h1>
              <p className="leading-7">{bill.reason}</p>
            </div>
          </div>
        </div>
      </section>
      <ShareSection bill={bill} />
    </>
  );
}
