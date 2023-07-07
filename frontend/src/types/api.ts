// API Response

export type Meeting = {
  meetingRecord: MeetingRecord[];
  nextRecordPosition: number;
  numberOfRecords: number;
  numberOfReturn: number;
  startRecord: number;
};

export type MeetingRecord = {
  closing: null;
  date: string;
  imageKind: string;
  issue: string;
  issueID: string;
  meetingURL: string;
  nameOfHouse: string;
  nameOfMeeting: string;
  pdfURL: null | string;
  searchObject: number;
  session: number;
  speechCount: number;
  speechRecord: SpeechRecord[];
};

export type SpeechRecord = {
  speaker: string;
  speech: string;
  speechID: string;
  speechOrder: number;
  speechURL: string;
};
