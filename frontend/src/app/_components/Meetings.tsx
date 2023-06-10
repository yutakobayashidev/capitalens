import prisma from "@src/lib/prisma";
import Meeting from "@src/app/_components/Meeting";

export default async function Meetings() {
  const meetings = await prisma.video.findMany();

  return <Meeting meetings={meetings} />;
}
