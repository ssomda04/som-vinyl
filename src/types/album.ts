export type Album = {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre: string[];
  coverImage: string;
  tracks: {
    sideA: string[];
    sideB: string[];
  };
  memo?: string;
};