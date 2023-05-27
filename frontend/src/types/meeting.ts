export type Meeting = {
  numberOfRecords: number;
  numberOfReturn: number;
  startRecord: number;
  nextRecordPosition: number;
  meetingRecord: MeetingRecord[];
};

export type MeetingRecord = {
  issueID: string;
  imageKind: string;
  searchObject: number;
  session: number;
  nameOfHouse: string;
  nameOfMeeting: string;
  issue: string;
  date: string;
  closing: null;
  speechCount: number;
  speechRecord: SpeechRecord[];
  meetingURL: string;
  pdfURL: null | string;
};

export type SpeechRecord = {
  speechID: string;
  speechOrder: number;
  speaker: string;
  speech: string;
  speechURL: string;
};
