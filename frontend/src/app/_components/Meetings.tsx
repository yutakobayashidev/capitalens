import prisma from "@src/lib/prisma";
import Meeting from "@src/app/_components/Meeting";
import { auth } from "@/auth";

export default async function Meetings() {
  const meetingsPromise = prisma.video.findMany();
  const sessionPromise = auth();

  const [session, meetings] = await Promise.all([
    sessionPromise,
    meetingsPromise,
  ]);

  return <Meeting user={session?.user} meetings={meetings} />;
}
