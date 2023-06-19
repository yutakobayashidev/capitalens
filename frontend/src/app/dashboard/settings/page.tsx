import Settings from "./Settings";
import prisma from "@src/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アカウント設定",
};

export default async function Page() {
  const prefectures = await prisma.prefecture.findMany();

  return <Settings prefectures={prefectures} />;
}
