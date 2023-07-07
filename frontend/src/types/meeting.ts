// Database Type

import { Member } from "@src/types/member";

export type Meeting = {
  id: string;
  annotations: Annotation[];
  apiURL: string | null;
  date: string;
  house: string | null;
  kids: string | null;
  m3u8_url: string;
  meeting_name: string;
  meetingURL: string | null;
  page_url: string;
  questions: Question[];
  summary: string | null;
  utterances: Utterance[];
  videoComments: videoComment[];
};

type Question = {
  id: number;
  title: string;
  end: number;
  start: number;
};

export type Word = {
  end: number;
  start: number;
  text: string;
};

export type Utterance = {
  id: number;
  end: number;
  start: number;
  words: Word[];
};

export type videoComment = {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type Annotation = {
  id: string;
  member: Member | null;
  speaker_info: string;
  speaker_name: string;
  start_sec: number;
  time: string;
};
