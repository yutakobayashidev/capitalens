import prisma from "@src/lib/prisma";
import { notFound } from "next/navigation";
import Video from "./Video";
import type { Metadata } from "next";
import dayjs from "dayjs";
import Summarize from "./Summarize";
import { config } from "@site.config";

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
    twitter: {
      description:
        meeting.summary ??
        `${dayjs(meeting.date).format("YYYY年MM月DD日")}の${
          meeting.house === "COUNCILLORS" ? "参議院 " : "衆議院 "
        } ${meeting.meeting_name}の情報をチェックする`,
      title:
        (meeting.house === "COUNCILLORS" ? "参議院 " : "衆議院 ") +
        meeting.meeting_name,
    },
    openGraph: {
      title:
        (meeting.house === "COUNCILLORS" ? "参議院 " : "衆議院 ") +
        meeting.meeting_name,
      siteName: config.siteMeta.title,
      url: `${config.siteRoot}diet`,
      locale: "ja-JP",
    },
  };
}

async function getMeeting(id: string) {
  const meeting = await prisma.video.findFirst({
    where: { id },
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
    },
  });

  return meeting;
}

export default async function Page({ params }: { params: { id: string } }) {
  const meeting = await getMeeting(params.id);

  if (!meeting) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-screen-xl px-4 md:px-8">
      <div className="md:flex block justify-center">
        <div className="md:w-[calc(65%)] md:mr-5">
          <Video meeting={meeting} />
        </div>
        <div className="flex-1">
          {meeting.apiURL && meeting.meetingURL && (
            <Summarize meeting={meeting} />
          )}
        </div>
      </div>
    </section>
  );
}
