"use client";

import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import AlbumDetailPanel from "@/components/AlbumDetailPanel";
import SearchSortBar from "@/components/SearchSortBar";
import TurntableCard from "@/components/TurntableCard";
import VinylShelf from "@/components/VinylShelf";
import AddAlbumForm from "@/components/AddAlbumForm";
import { albums } from "@/data/albums";
import type { Album } from "@/types/album";
import type { SortOption } from "@/types/sort";
import { supabase } from "@/lib/supabase";
import { albumToRow, rowToAlbum } from "@/lib/albumMapper";
const STORAGE_KEY = "som-vinyl-collection";
const TURNTABLE_STORAGE_KEY = "som-vinyl-turntable";
const ADMIN_STORAGE_KEY = "som-vinyl-admin";


export default function Home() {
  const [collectionAlbums, setCollectionAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [onTurntableAlbum, setOnTurntableAlbum] = useState<Album | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("shelf");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data, error } = await supabase
        .from("albums")
        .select("*")
        .order("shelf_order", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setCollectionAlbums(data.map(rowToAlbum));
    };

    fetchAlbums();

    const savedTurntableAlbum = localStorage.getItem(
      TURNTABLE_STORAGE_KEY
    );

    if (savedTurntableAlbum) {
      setOnTurntableAlbum(JSON.parse(savedTurntableAlbum));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, String(isAdminMode));
  }, [isAdminMode]);

  
  useEffect(() => {
    if (onTurntableAlbum) {
      localStorage.setItem(
        TURNTABLE_STORAGE_KEY,
        JSON.stringify(onTurntableAlbum)
      );
    } else {
      localStorage.removeItem(TURNTABLE_STORAGE_KEY);
    }
  }, [onTurntableAlbum]);

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

const handleReorderAlbums = async (activeId: number, overId: number) => {
  const oldIndex = collectionAlbums.findIndex((album) => album.id === activeId);
  const newIndex = collectionAlbums.findIndex((album) => album.id === overId);

  if (oldIndex === -1 || newIndex === -1) return;

  const reorderedAlbums = arrayMove(collectionAlbums, oldIndex, newIndex).map(
    (album, index) => ({
      ...album,
      shelfOrder: index + 1,
    })
  );

  setCollectionAlbums(reorderedAlbums);

  const updates = reorderedAlbums.map((album) =>
    supabase
      .from("albums")
      .update({ shelf_order: album.shelfOrder })
      .eq("id", album.id)
  );

  await Promise.all(updates);
};

  const handleAdminAccess = async () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setAdminPassword("");
      return;
    }

    const password = window.prompt("Enter admin password");

    if (!password) return;

    const response = await fetch("/api/admin/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      alert("Wrong password");
      return;
    }

    setIsAdminMode(true);
    setAdminPassword(password);
    setSortOption("shelf");
    setSearchQuery("");
  };

  const handleAddAlbum = (album: Album) => {
    setCollectionAlbums((prevAlbums) => [...prevAlbums, album]);
    setSortOption("shelf");
  };

const handleUpdateAlbumMemo = async (albumId: number, memo: string) => {
  const response = await fetch("/api/admin/albums", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({
      id: albumId,
      memo,
    }),
  });

  if (!response.ok) {
    console.error(await response.json());
    alert("메모 저장에 실패했어요.");
    return;
  }

  const updatedAlbum = rowToAlbum(await response.json());

  setCollectionAlbums((prevAlbums) =>
    prevAlbums.map((album) =>
      album.id === albumId ? updatedAlbum : album
    )
  );

  setSelectedAlbum((prevAlbum) =>
    prevAlbum?.id === albumId ? updatedAlbum : prevAlbum
  );

  setOnTurntableAlbum((prevAlbum) =>
    prevAlbum?.id === albumId ? updatedAlbum : prevAlbum
  );
};

const handleSaveAlbum = async (album: Album) => {
  const normalizedAlbum: Album = {
    ...album,
    shelfOrder:
      album.shelfOrder ??
      Math.max(0, ...collectionAlbums.map((item) => item.shelfOrder ?? 0)) + 1,
  };

  const exists = collectionAlbums.some(
    (item) => item.id === normalizedAlbum.id
  );

  if (exists) {
    const response = await fetch("/api/admin/albums", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPassword,
      },
      body: JSON.stringify({
        id: normalizedAlbum.id,
        ...albumToRow(normalizedAlbum),
      }),
    });

    if (!response.ok) {
      alert("앨범 수정에 실패했어요.");
      return;
    }

    const updatedAlbum = rowToAlbum(await response.json());

    setCollectionAlbums((prevAlbums) =>
      prevAlbums.map((item) =>
        item.id === updatedAlbum.id ? updatedAlbum : item
      )
    );

    setSelectedAlbum(updatedAlbum);
  } else {
    const response = await fetch("/api/admin/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPassword,
      },
      body: JSON.stringify(albumToRow(normalizedAlbum)),
    });

    if (!response.ok) {
      alert("앨범 추가에 실패했어요.");
      return;
    }

    const addedAlbum = rowToAlbum(await response.json());

    setCollectionAlbums((prevAlbums) => [...prevAlbums, addedAlbum]);
    setSelectedAlbum(addedAlbum);
  }

  setEditingAlbum(null);
  setIsAddFormOpen(false);
  setSortOption("shelf");
};

const handleEditAlbum = (album: Album) => {
  setEditingAlbum(album);
  setIsAddFormOpen(true);
};

const handleDeleteAlbum = async (albumId: number) => {
  const ok = window.confirm("이 앨범을 삭제할까요?");

  if (!ok) return;

  const response = await fetch("/api/admin/albums", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({ id: albumId }),
  });

  if (!response.ok) {
    alert("앨범 삭제에 실패했어요.");
    return;
  }

  setCollectionAlbums((prevAlbums) =>
    prevAlbums.filter((album) => album.id !== albumId)
  );

  setSelectedAlbum(null);

  setOnTurntableAlbum((prevAlbum) =>
    prevAlbum?.id === albumId ? null : prevAlbum
  );
};
  return (
    <main className="min-h-screen bg-[#f5efe6] px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
          <div className="relative">
            <button
              type="button"
              onClick={handleAdminAccess}
              className="absolute right-0 top-0 text-sm text-neutral-300 transition hover:text-neutral-500"
              aria-label="Admin access"
            >
              •••
            </button>

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
          onAdminAccess={handleAdminAccess}
        />
      {isAdminMode && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsAddFormOpen(true)}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 transition hover:border-neutral-400"
          >
            + Add Vinyl
          </button>
        </div>
      )}
      
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
              isAdminMode={isAdminMode}
              onClose={() => setSelectedAlbum(null)}
              onPlaceOnTurntable={setOnTurntableAlbum}
              onUpdateMemo={handleUpdateAlbumMemo}
              onEditAlbum={handleEditAlbum}
              onDeleteAlbum={handleDeleteAlbum}
            />
          )}
        </div>
      {isAddFormOpen && (
        <AddAlbumForm
          nextId={Math.max(0, ...collectionAlbums.map((album) => album.id ?? 0)) + 1}
          nextShelfOrder={
            Math.max(0, ...collectionAlbums.map((album) => album.shelfOrder ?? 0)) + 1
          }
          initialAlbum={editingAlbum}
          onAddAlbum={handleSaveAlbum}
          onClose={() => {
            setEditingAlbum(null);
            setIsAddFormOpen(false);
          }}
        />
      )}  
      </section>
    </main>
  );
}