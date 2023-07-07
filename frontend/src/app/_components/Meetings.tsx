import Meeting from "@src/app/_components/Meeting";
import prisma from "@src/lib/prisma";

import { auth } from "@/auth";

export default async function Meetings() {
  const meetingsPromise = prisma.video.findMany({
    orderBy: [
      {
        date: "desc",
      },
    ],
  });
  const sessionPromise = auth();

  const [session, meetings] = await Promise.all([
    sessionPromise,
    meetingsPromise,
  ]);

  return <Meeting user={session?.user} meetings={meetings} />;
}
