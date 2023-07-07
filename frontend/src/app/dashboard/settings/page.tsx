import prisma from "@src/lib/prisma";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import Settings from "./Settings";

export const metadata: Metadata = {
  title: "アカウント設定",
};

export default async function Page() {
  const prefecturesPromise = prisma.prefecture.findMany();
  const sessionPromise = auth();

  const [session, prefectures] = await Promise.all([
    sessionPromise,
    prefecturesPromise,
  ]);

  if (!session?.user) {
    redirect(`/`);
  }

  return <Settings user={session?.user} prefectures={prefectures} />;
}
