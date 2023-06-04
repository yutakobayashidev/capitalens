import prisma from "@src/lib/prisma";
import { notFound } from "next/navigation";
import Video from "./Video";
import type { Metadata } from "next";
import dayjs from "dayjs";
import Summarize from "./Summarize";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const meeting = await getMeeting();

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
      siteName: "CapitaLens",
      url: `https://parliament-data.vercel.app/diet`,
      locale: "ja-JP",
    },
  };
}

async function getMeeting() {
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
    },
  });

  return meeting;
}

export default async function IndexPage() {
  const meeting = await getMeeting();

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
          {meeting.apiURL && <Summarize meeting={meeting} />}
        </div>
      </div>
    </section>
  );
}
