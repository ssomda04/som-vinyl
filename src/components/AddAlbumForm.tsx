import { useState } from "react";
import type { Album } from "@/types/album";

type AddAlbumFormProps = {
  nextId: number;
  nextShelfOrder: number;
  onAddAlbum: (album: Album) => void;
  onClose: () => void;
};

type DiscogsSearchResult = {
  id: number;
  title: string;
  year?: string;
  genre?: string[];
  thumb?: string;
  cover_image?: string;
};

type DiscogsTrack = {
  position?: string;
  title: string;
  type_?: string;
};

type DiscogsRelease = {
  id: number;
  title: string;
  year?: number;
  artists_sort?: string;
  genres?: string[];
  styles?: string[];
  images?: {
    uri?: string;
    resource_url?: string;
  }[];
  tracklist?: DiscogsTrack[];
};

export default function AddAlbumForm({
  nextId,
  nextShelfOrder,
  onAddAlbum,
  onClose,
}: AddAlbumFormProps) {
  const [discogsQuery, setDiscogsQuery] = useState("");
  const [discogsResults, setDiscogsResults] = useState<DiscogsSearchResult[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tracksText, setTracksText] = useState("");

const parseTracks = (text: string) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string[]>>((acc, line) => {
      const match = line.match(/^([A-Z]+)\d*\s+(.+)$/i);

      if (!match) {
        if (!acc.A) acc.A = [];
        acc.A.push(line);
        return acc;
      }

      const rawSide = match[1].toUpperCase();
      const side = rawSide.replace(/[^A-Z]/g, "");
      const trackTitle = match[2].trim();

      if (!acc[side]) acc[side] = [];
      acc[side].push(trackTitle);

      return acc;
    }, {});
};

const formatDiscogsTracks = (tracklist: DiscogsTrack[] = []) => {
  return tracklist
    .filter((track) => track.type_ !== "heading" && track.title)
    .map((track) => {
      const position = track.position?.trim();

      if (position) {
        return `${position} ${track.title}`;
      }

      return track.title;
    })
    .join("\n");
};

  const handleDiscogsSearch = async () => {
    if (!discogsQuery.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/discogs/search?q=${encodeURIComponent(discogsQuery)}`
      );

      const data = await response.json();
      setDiscogsResults(data.results ?? []);
    } catch (error) {
      console.error(error);
      alert("Discogs 검색에 실패했어요.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDiscogsResult = async (releaseId: number) => {
    try {
      const response = await fetch(`/api/discogs/releases/${releaseId}`);
      const release: DiscogsRelease = await response.json();

      setTitle(release.title ?? "");
      setArtist(release.artists_sort ?? "");
      setYear(release.year ? String(release.year) : "");
      setGenre([...(release.genres ?? []), ...(release.styles ?? [])].join(", "));

      const imageUrl =
        release.images?.[0]?.uri ||
        release.images?.[0]?.resource_url ||
        "/next.svg";

      setCoverImage(imageUrl);
      setTracksText(formatDiscogsTracks(release.tracklist));

      setDiscogsResults([]);
      setDiscogsQuery("");
    } catch (error) {
      console.error(error);
      alert("앨범 상세 정보를 가져오지 못했어요.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAlbum: Album = {
      id: nextId,
      shelfOrder: nextShelfOrder,
      title,
      artist,
      year: Number(year),
      genre: genre
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      coverImage: coverImage || "/next.svg",
      tracks: parseTracks(tracksText),
    };

    onAddAlbum(newAlbum);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#fffaf2] p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              Add Vinyl
            </p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-900">
              새 LP 추가
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-neutral-400 hover:text-neutral-900"
          >
            ×
          </button>
        </div>

        <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
            Search from Discogs
          </p>

          <div className="flex gap-2">
            <input
              placeholder="ex) 검정치마 Team Baby"
              value={discogsQuery}
              onChange={(e) => setDiscogsQuery(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <button
              type="button"
              onClick={handleDiscogsSearch}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
            >
              {isSearching ? "..." : "Search"}
            </button>
          </div>

          {discogsResults.length > 0 && (
            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
              {discogsResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelectDiscogsResult(result.id)}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-neutral-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.thumb || result.cover_image || "/next.svg"}
                    alt={result.title}
                    className="h-12 w-12 rounded object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {result.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {result.year ?? "Unknown year"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <input
            required
            placeholder="Album title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400"
          />

          <input
            required
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400"
          />

          <input
            required
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400"
          />

          <input
            placeholder="Genre, comma separated ex) Rock, Indie"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400"
          />

          <input
            placeholder="Cover image path or URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400"
          />

          <textarea
            placeholder={`Tracks

A1 Track title
A2 Track title
B1 Track title
B2 Track title
C1 Track title`}
            value={tracksText}
            onChange={(e) => setTracksText(e.target.value)}
            className="min-h-40 w-full rounded-xl border px-4 py-3 text-sm"
          />
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Add to Shelf
        </button>
      </form>
    </div>
  );
}