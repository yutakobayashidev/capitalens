import Settings from "./Settings";
import prisma from "@src/lib/prisma";

export default async function Page() {
  const prefectures = await prisma.prefecture.findMany();

  return <Settings prefectures={prefectures} />;
}
