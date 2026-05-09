import { useState } from "react";
import type { Album } from "@/types/album";

type AddAlbumFormProps = {
  nextId: number;
  nextShelfOrder: number;
  onAddAlbum: (album: Album) => void;
  onClose: () => void;
};

export default function AddAlbumForm({
  nextId,
  nextShelfOrder,
  onAddAlbum,
  onClose,
}: AddAlbumFormProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAlbum: Album = {
      id: nextId,
      shelfOrder: nextShelfOrder,
      title,
      artist,
      year: Number(year),
      genre: genre.split(",").map((item) => item.trim()).filter(Boolean),
      coverImage: coverImage || "/next.svg",
      tracks: {
        sideA: sideA.split("\n").map((item) => item.trim()).filter(Boolean),
        sideB: sideB.split("\n").map((item) => item.trim()).filter(Boolean),
      },
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

        <div className="space-y-3">
          <input
            required
            placeholder="Album title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />

          <input
            required
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />

          <input
            required
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />

          <input
            placeholder="Genre, comma separated ex) Rock, Indie"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />

          <input
            placeholder="Cover image path ex) /covers/album.jpg"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          />

          <textarea
            placeholder="Side A tracks, one per line"
            value={sideA}
            onChange={(e) => setSideA(e.target.value)}
            className="min-h-28 w-full rounded-xl border px-4 py-3 text-sm"
          />

          <textarea
            placeholder="Side B tracks, one per line"
            value={sideB}
            onChange={(e) => setSideB(e.target.value)}
            className="min-h-28 w-full rounded-xl border px-4 py-3 text-sm"
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