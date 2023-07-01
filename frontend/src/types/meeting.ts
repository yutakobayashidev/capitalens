// Database Type

import { Member } from "@src/types/member";

export type Meeting = {
  house: string | null;
  m3u8_url: string;
  id: string;
  meeting_name: string;
  page_url: string;
  date: string;
  summary: string | null;
  meetingURL: string | null;
  apiURL: string | null;
  kids: string | null;
  videoComments: videoComment[];
  annotations: Annotation[];
  utterances: Utterance[];
};

export type Word = {
  start: number;
  end: number;
  text: string;
};

export type Utterance = {
  id: number;
  start: number;
  end: number;
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
  start_sec: number;
  speaker_name: string;
  speaker_info: string;
  time: string;
  member: Member | null;
};
