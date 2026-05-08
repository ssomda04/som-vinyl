"use client";

import { useState } from "react";
import Image from "next/image";
import VinylShelf from "@/components/VinylShelf";
import { albums } from "@/data/albums";
import type { Album } from "@/types/album";

export default function Home() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  return (
    <main className="min-h-screen bg-[#f5efe6] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
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

        <div
          className={`grid gap-8 transition-all duration-300 ${
            selectedAlbum ? "lg:grid-cols-[1fr_360px]" : "lg:grid-cols-1"
          }`}
        >
          <div className={selectedAlbum ? "" : "mx-auto w-full max-w-6xl"}>
            <VinylShelf
              albums={albums}
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