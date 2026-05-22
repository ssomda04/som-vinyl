import type { Album } from "@/types/album";

type AlbumRow = {
  id: number;
  shelf_order: number;
  title: string;
  artist: string;
  year: number;
  genre: string[];
  cover_image: string | null;
  tracks: Record<string, string[]>;
  memo: string | null;
};

export function rowToAlbum(row: AlbumRow): Album {
  return {
    id: row.id,
    shelfOrder: row.shelf_order,
    title: row.title,
    artist: row.artist,
    year: row.year,
    genre: row.genre ?? [],
    coverImage: row.cover_image ?? "/next.svg",
    tracks: row.tracks ?? {},
    memo: row.memo ?? undefined,
  };
}

export function albumToRow(album: Album) {
  return {
    shelf_order: album.shelfOrder,
    title: album.title,
    artist: album.artist,
    year: album.year,
    genre: album.genre,
    cover_image: album.coverImage,
    tracks: album.tracks,
    memo: album.memo ?? null,
  };
}