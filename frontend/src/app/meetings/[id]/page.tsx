import { config } from "@site.config";
import SetPlaceHolder from "@src/hooks/placeholder";
import prisma from "@src/lib/prisma";
import { Meeting } from "@src/types/meeting";
import dayjs from "dayjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { auth } from "@/auth";

import Video from "./Video";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  const meeting = await getMeeting(params.id);

  if (!meeting) {
    notFound();
  }

  return {
    title:
      (meeting.house === "COUNCILLORS" ? "参議院 " : "衆議院 ") +
      meeting.meeting_name +
      " " +
      dayjs(meeting.date).format("YY/MM/DD"),
    description: meeting.summary,
    openGraph: {
      title:
        (meeting.house === "COUNCILLORS" ? "参議院 " : "衆議院 ") +
        meeting.meeting_name,
      locale: "ja-JP",
      siteName: config.siteMeta.title,
      url: `${config.siteRoot}meetings/${meeting.id}`,
    },
    twitter: {
      title:
        (meeting.house === "COUNCILLORS" ? "参議院 " : "衆議院 ") +
        meeting.meeting_name,
      description:
        meeting.summary ??
        `${dayjs(meeting.date).format("YYYY年MM月DD日")}の${
          meeting.house === "COUNCILLORS" ? "参議院 " : "衆議院 "
        } ${meeting.meeting_name}の情報をチェックする`,
    },
  };
}

async function getMeeting(id: string) {
  const meeting = await prisma.video.findFirst({
    include: {
      annotations: {
        include: {
          member: {
            include: {
              group: true,
            },
          },
        },
      },
      questions: true,
      utterances: {
        include: {
          words: {
            include: {
              member: {
                include: {
                  group: true,
                },
              },
            },
          },
        },
      },
      videoComments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    where: { id },
  });

  const json: Meeting = JSON.parse(JSON.stringify(meeting));

  return json;
}

export default async function Page({ params }: { params: { id: string } }) {
  const meetingPromise = getMeeting(params.id);
  const sessionPromise = auth();

  const [session, meeting] = await Promise.all([
    sessionPromise,
    meetingPromise,
  ]);

  if (!meeting) {
    notFound();
  }

  return (
    <>
      <section className="mx-auto max-w-screen-xl px-4 md:px-8">
        <Video user={session?.user} meeting={meeting} />
      </section>
      <SetPlaceHolder
        placeholder={`${meeting.meeting_name}の最近の会議を教えてください`}
      />
    </>
  );
}
