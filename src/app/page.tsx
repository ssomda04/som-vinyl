"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import VinylShelf from "@/components/VinylShelf";
import { albums } from "@/data/albums";
import type { Album } from "@/types/album";

type SortOption = "default" | "title" | "artist" | "year";

export default function Home() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [onTurntableAlbum, setOnTurntableAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const filteredAlbums = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return albums;

    return albums.filter((album) => {
      return (
        album.title.toLowerCase().includes(query) ||
        album.artist.toLowerCase().includes(query) ||
        album.genre.some((genre) => genre.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  const sortedAlbums = useMemo(() => {
    const copiedAlbums = [...filteredAlbums];

    if (sortOption === "title") {
      return copiedAlbums.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortOption === "artist") {
      return copiedAlbums.sort((a, b) => a.artist.localeCompare(b.artist));
    }

    if (sortOption === "year") {
      return copiedAlbums.sort((a, b) => a.year - b.year);
    }

    return copiedAlbums;
  }, [filteredAlbums, sortOption]);

  return (
    <main className="min-h-screen bg-[#f5efe6] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Som&apos;s Collection
            </p>
            <h1 className="mt-2 text-4xl font-bold text-neutral-900">
              Vinyl Archive
            </h1>
            <p className="mt-3 text-neutral-600">
              내가 수집한 LP 바이닐을 한눈에 보는 개인 아카이브
            </p>
          </div>

          <div className="relative rounded-2xl border border-neutral-200 bg-[#fffaf2] p-4 shadow-sm">
  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-400">
    On Turntable
  </p>

  {onTurntableAlbum ? (
    <div className="flex items-center justify-center gap-5">
      <div className="relative h-28 w-28 shrink-0">
        <div className="absolute left-[68%] top-[58%] z-10 h-[2px] w-12 -translate-y-1/2 rotate-[-28deg] rounded-full bg-neutral-500 shadow-sm">
          <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-neutral-400 bg-neutral-300" />
        </div>
        <div className="absolute inset-0 animate-spin-slow overflow-hidden rounded-full bg-neutral-950 shadow-xl">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,rgba(255,255,255,0.22),transparent_18%,rgba(255,255,255,0.08)_28%,transparent_42%,rgba(255,255,255,0.16)_58%,transparent_72%,rgba(255,255,255,0.06)_84%,transparent)]" />
          <div className="absolute inset-2 rounded-full border border-neutral-800" />
          <div className="absolute inset-4 rounded-full border border-neutral-800" />
          <div className="absolute inset-6 rounded-full border border-neutral-700" />
          <div className="absolute inset-8 rounded-full border border-neutral-800" />
          <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5efe6]" />
        </div>
      </div>

      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-200 shadow-md">
        <Image
          src={onTurntableAlbum.coverImage}
          alt={onTurntableAlbum.title}
          fill
          className="object-cover"
        />
      </div>

      <button
        type="button"
        onClick={() => setOnTurntableAlbum(null)}
        className="absolute right-4 top-4 text-xs text-neutral-400 transition hover:text-neutral-900"
        aria-label="Remove record from turntable"
      >
        ×
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-neutral-950 shadow-inner">
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,rgba(255,255,255,0.18),transparent_18%,rgba(255,255,255,0.06)_32%,transparent_48%,rgba(255,255,255,0.12)_65%,transparent_80%)]" />
        <div className="absolute inset-2 rounded-full border border-neutral-800" />
        <div className="absolute inset-4 rounded-full border border-neutral-800" />
        <div className="absolute inset-6 rounded-full border border-neutral-700" />
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5efe6]" />
      </div>
    </div>
  )}
</div>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search vinyls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-400"
          >
            <option value="default">Default</option>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="year">Year</option>
          </select>
        </div>

        {filteredAlbums.length === 0 && (
          <p className="mb-4 text-sm text-neutral-500">검색 결과가 없어요.</p>
        )}

        <div
          className={`grid gap-8 transition-all duration-300 ${
            selectedAlbum ? "lg:grid-cols-[1fr_360px]" : "lg:grid-cols-1"
          }`}
        >
          <div className={selectedAlbum ? "" : "mx-auto w-full max-w-6xl"}>
            <VinylShelf
              albums={sortedAlbums}
              selectedAlbumId={selectedAlbum?.id}
              onAlbumClick={setSelectedAlbum}
            />
          </div>

          {selectedAlbum && (
            <aside className="rounded-2xl border border-neutral-200 bg-[#fffaf2] p-6 shadow-lg">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                    Selected Vinyl
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-neutral-900">
                    {selectedAlbum.title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {selectedAlbum.artist}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAlbum(null)}
                  className="rounded-full px-2 text-xl text-neutral-400 transition hover:text-neutral-900"
                  aria-label="Close detail panel"
                >
                  ×
                </button>
              </div>

              <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-200">
                <Image
                  src={selectedAlbum.coverImage}
                  alt={selectedAlbum.title}
                  fill
                  className="object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => setOnTurntableAlbum(selectedAlbum)}
                className="mt-5 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Place on Turntable
              </button>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-neutral-600">
                <span className="rounded-full bg-neutral-100 px-3 py-1">
                  {selectedAlbum.year}
                </span>
                {selectedAlbum.genre.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-neutral-100 px-3 py-1"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Tracklist
                </h3>

                <div className="mt-3 space-y-4 text-sm text-neutral-700">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
                      Side A
                    </p>
                    <ol className="space-y-1">
                      {selectedAlbum.tracks.sideA.map((track, index) => (
                        <li key={track}>
                          {index + 1}. {track}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
                      Side B
                    </p>
                    <ol className="space-y-1">
                      {selectedAlbum.tracks.sideB.map((track, index) => (
                        <li key={track}>
                          {index + 1}. {track}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}