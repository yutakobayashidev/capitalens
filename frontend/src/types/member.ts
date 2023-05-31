export type Group = {
  name: string;
  image: string | null;
};

export type Member = {
  name: string;
  description: string | null;
  id: string;
  image: string | null;
  scannedCount: number;
  group: Group | null;
  win: number | null;
  youtube: string | null;
  house: string | null;
  twitter: string | null;
  birthplace: string | null;
  abstract: string | null;
};
