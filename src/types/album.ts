export type Album = {
  id: number;
  shelfOrder: number;
  title: string;
  artist: string;
  year: number;
  genre: string[];
  coverImage: string;
  tracks: Record<string, string[]>;
  memo?: string;
};