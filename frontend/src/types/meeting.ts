export interface Meeting {
  numberOfRecords: number;
  numberOfReturn: number;
  startRecord: number;
  nextRecordPosition: number;
  meetingRecord: MeetingRecord[];
}

export interface MeetingRecord {
  issueID: string;
  imageKind: string;
  searchObject: number;
  session: number;
  nameOfHouse: string;
  nameOfMeeting: string;
  issue: string;
  date: string;
  closing: null;
  speechRecord: SpeechRecord[];
  meetingURL: string;
  pdfURL: null | string;
}

export interface SpeechRecord {
  speechID: string;
  speechOrder: number;
  speaker: string;
  speech: string;
  speechURL: string;
}
