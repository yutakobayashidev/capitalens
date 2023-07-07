import { auth } from "@auth";
import { config } from "@site.config";
import Clipboard from "@src/app/bill/[id]/Clipboard";
import Form from "@src/app/bill/[id]/form";
import prisma from "@src/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BsLine } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";

async function getBill(id: string) {
  const bill = await prisma.bill.findUnique({
    include: {
      comments: {
        include: {
          _count: { select: { votes: true } },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      supportedBills: {
        include: {
          member: true,
        },
      },
    },
    where: { id },
  });

  if (!bill) {
    notFound();
  }

  const json = JSON.parse(JSON.stringify(bill));

  return json;
}

type CommentType = "AGREEMENT" | "NEUTRAL" | "OPPOSITION";

type CountObject = {
  [key in CommentType]: number;
};

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
    _count: { type: true },
    by: ["type"],
    where: { billId: id },
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
  const tweet = `https://twitter.com/share?url=${config.siteRoot}bill/${
    bill.id
  }&text=${"📑" + bill.name + "について議論しましょう"}&hashtags=${
    config.siteMeta.title
  }`;

  const line = `https://social-plugins.line.me/lineit/share?url=${config.siteRoot}bill/${bill.id}`;

  return (
    <section className="bg-gray-100 py-12">
      <div className="mx-auto max-w-screen-md px-4 md:px-8">
        <h1 className="mb-5 text-center text-3xl font-bold md:text-4xl">
          この議論をシェアしよう
        </h1>
        <div className="grid grid-cols-3 gap-x-4">
          <ShareButton
            href={tweet}
            icon={<FaTwitter className="mb-3 text-4xl text-[#1da1f2]" />}
            label="ツイートする"
          />
          <ShareButton
            href={line}
            icon={<BsLine className="mb-3 text-4xl text-[#06C755]" />}
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
      className="block rounded-lg border bg-white px-2 py-4 text-center transition duration-500 hover:shadow-md md:px-2 md:py-6"
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

  const ogImage = `${config.siteRoot}opengraph.jpg`;

  return {
    title: bill.name,
    description: bill.reason,
    openGraph: {
      title: bill.name,
      description: bill.reason,
      images: [
        {
          url: ogImage,
        },
      ],
      locale: "ja-JP",
      siteName: config.siteMeta.title,
      url: `${config.siteRoot}bill/${bill.id}`,
    },
    twitter: {
      title: bill.name,
      card: "summary_large_image",
      description: bill.reason,
      images: [ogImage],
    },
  };
}

type supportedBill = {
  id: string;
  member: {
    id: string;
    name: string;
    image: string;
  };
};

export default async function Page({ params }: { params: { id: string } }) {
  const billPromise = getBill(params.id);
  const countPromise = getCount(params.id);
  const sessionPromise = auth();

  const [bill, count, session] = await Promise.all([
    billPromise,
    countPromise,
    sessionPromise,
  ]);

  return (
    <>
      <section className="my-5">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h1 className="mb-5 text-3xl font-bold">{bill.name}</h1>
          <div className="md:flex">
            <div className="flex-1 md:mr-6">
              <Form user={session?.user} bill={bill} count={count} />
            </div>
            <div className="mt-5 flex-1 md:mt-0">
              <h2 className="mb-3 text-2xl font-bold">提出理由</h2>
              <p className="mb-5 leading-7">{bill.reason}</p>
              <h2 className="mb-3 text-2xl font-bold">賛成している議員</h2>
              <div className="grid grid-cols-6">
                {bill.supportedBills.map((item: supportedBill) => (
                  <Link
                    href={`/members/${item.member.id}`}
                    className="mb-3"
                    key={item.id}
                  >
                    <img
                      src={item.member.image}
                      className="h-20 w-20 rounded-full border border-gray-200 object-cover object-center"
                      alt={item.member.name}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ShareSection bill={bill} />
    </>
  );
}
