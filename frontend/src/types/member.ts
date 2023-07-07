export type Group = {
  name: string;
  image: string | null;
};

export type Member = {
  id: string;
  name: string;
  abstract: string | null;
  birthplace: string | null;
  description: string | null;
  group: Group | null;
  house: string | null;
  image: string | null;
  scannedCount: number;
  twitter: string | null;
  website: string | null;
  wikipedia: string | null;
  win: number | null;
  youtube: string | null;
};
