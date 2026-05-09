"use client";

import { arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import AlbumDetailPanel from "@/components/AlbumDetailPanel";
import SearchSortBar from "@/components/SearchSortBar";
import TurntableCard from "@/components/TurntableCard";
import VinylShelf from "@/components/VinylShelf";
import { albums } from "@/data/albums";
import type { Album } from "@/types/album";
import type { SortOption } from "@/types/sort";

export default function Home() {
  const [collectionAlbums, setCollectionAlbums] = useState<Album[]>(albums);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [onTurntableAlbum, setOnTurntableAlbum] = useState<Album | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("shelf");

  const filteredAlbums = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return collectionAlbums;

    return collectionAlbums.filter((album) => {
      return (
        album.title.toLowerCase().includes(query) ||
        album.artist.toLowerCase().includes(query) ||
        album.genre.some((genre) => genre.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, collectionAlbums]);

  const sortedAlbums = useMemo(() => {
    const copiedAlbums = [...filteredAlbums];

    if (sortOption === "shelf") {
      return copiedAlbums.sort((a, b) => a.shelfOrder - b.shelfOrder);
    }

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

  const handleReorderAlbums = (activeId: number, overId: number) => {
    setCollectionAlbums((prevAlbums) => {
      const oldIndex = prevAlbums.findIndex((album) => album.id === activeId);
      const newIndex = prevAlbums.findIndex((album) => album.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prevAlbums;

      return arrayMove(prevAlbums, oldIndex, newIndex).map((album, index) => ({
        ...album,
        shelfOrder: index + 1,
      }));
    });
  };

  const handleToggleAdminMode = () => {
    setIsAdminMode((prev) => !prev);
    setSortOption("shelf");
    setSearchQuery("");
  };

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

          <TurntableCard
            album={onTurntableAlbum}
            onRemove={() => setOnTurntableAlbum(null)}
          />
        </div>

        <SearchSortBar
          searchQuery={searchQuery}
          sortOption={sortOption}
          isAdminMode={isAdminMode}
          onSearchChange={setSearchQuery}
          onSortChange={setSortOption}
          onToggleAdminMode={handleToggleAdminMode}
        />

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
              isAdminMode={isAdminMode && sortOption === "shelf"}
              onReorder={handleReorderAlbums}
            />
          </div>

          {selectedAlbum && (
            <AlbumDetailPanel
              album={selectedAlbum}
              onClose={() => setSelectedAlbum(null)}
              onPlaceOnTurntable={setOnTurntableAlbum}
            />
          )}
        </div>
      </section>
    </main>
  );
}