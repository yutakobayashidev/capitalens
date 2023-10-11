import { auth } from "@auth";
import { config } from "@site.config";
import prisma from "@src/lib/prisma";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Form from "./Form";

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
    openGraph: {
      title: member.name,
      images: [
        {
          url: ogImage,
        },
      ],
      locale: "ja-JP",
      siteName: config.siteRoot,
      url: `${config.siteRoot}people/${member.id}`,
    },
    twitter: {
      title: member.name,
      card: member.image ? "summary" : "summary_large_image",
      images: [ogImage],
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
  const sessionPromise = auth();

  const [member, groups, session] = await Promise.all([
    MemberPromise,
    GroupsePromise,
    sessionPromise,
  ]);

  if (!session?.user) {
    redirect(`/`);
  }

  return (
    <section className="my-12">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <Form user={session?.user} member={member} groups={groups} />
      </div>
    </section>
  );
}
