import { notFound } from "next/navigation";
import prisma from "@src/lib/prisma";
import Form from "./Form";
import type { Metadata } from "next";
import { config } from "@site.config";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  const member = await getMember(params.id);

  if (!member) {
    notFound();
  }

  const ogImage = member.image ?? `${config.siteRoot}opengraph.jpg`;

  return {
    title: member.name + "議員の情報を更新",
    description: member.description,
    twitter: {
      card: member.image ? "summary" : "summary_large_image",
      title: member.name,
      images: [ogImage],
    },
    openGraph: {
      title: member.name,
      siteName: config.siteRoot,
      url: `${config.siteRoot}people/${member.id}`,
      locale: "ja-JP",
      images: [
        {
          url: ogImage,
        },
      ],
    },
  };
}

async function getMember(id: string) {
  const member = await prisma.member.findUnique({
    where: { id },
  });

  if (!member) {
    notFound();
  }

  return member;
}

export default async function Page({ params }: { params: { id: string } }) {

  const MemberPromise = getMember(params.id);
  const GroupsePromise = prisma.group.findMany();

  const [member, groups] = await Promise.all([
    MemberPromise,
    GroupsePromise,
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-8">
      <Form member={member} groups={groups} />
    </div>
  );
}
