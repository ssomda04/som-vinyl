import { useState } from "react";
import Image from "next/image";
import type { Album } from "@/types/album";

type AlbumDetailPanelProps = {
  album: Album;
  isAdminMode: boolean;
  onClose: () => void;
  onPlaceOnTurntable: (album: Album) => void;
  onUpdateMemo: (albumId: number, memo: string) => void;
};

export default function AlbumDetailPanel({
  album,
  isAdminMode,
  onClose,
  onPlaceOnTurntable,
  onUpdateMemo,
}: AlbumDetailPanelProps) {
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(album.memo ?? "");

  const handleSaveMemo = () => {
    onUpdateMemo(album.id, memoText.trim());
    setIsEditingMemo(false);
  };

  return (
    <aside className="rounded-2xl border border-neutral-200 bg-[#fffaf2] p-6 shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Selected Vinyl
          </p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900">
            {album.title}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">{album.artist}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 text-xl text-neutral-400 transition hover:text-neutral-900"
          aria-label="Close detail panel"
        >
          ×
        </button>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-200">
        <Image
          src={album.coverImage}
          alt={album.title}
          fill
          className="object-cover"
        />
      </div>

      <button
        type="button"
        onClick={() => onPlaceOnTurntable(album)}
        className="mt-5 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
      >
        Place on Turntable
      </button>

      {(album.memo || isAdminMode) && (
        <div className="mt-5 rounded-xl border border-neutral-200 bg-[#f3eee4] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Curator Note
            </p>

            {isAdminMode && !isEditingMemo && (
              <button
                type="button"
                onClick={() => {
                  setMemoText(album.memo ?? "");
                  setIsEditingMemo(true);
                }}
                className="text-xs text-neutral-400 transition hover:text-neutral-900"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingMemo ? (
            <div>
              <textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                placeholder="이 앨범에 대한 짧은 큐레이션 메모를 남겨보세요."
                className="min-h-24 w-full resize-none rounded-lg border border-neutral-200 bg-[#fffaf2] px-3 py-2 text-sm leading-6 text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
              />

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMemoText(album.memo ?? "");
                    setIsEditingMemo(false);
                  }}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-500 transition hover:border-neutral-400"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveMemo}
                  className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white transition hover:bg-neutral-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : album.memo ? (
            <p className="text-sm leading-6 text-neutral-700">
              “{album.memo}”
            </p>
          ) : (
            <p className="text-sm leading-6 text-neutral-400">
              아직 남긴 메모가 없어요.
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-3 py-1">
          {album.year}
        </span>
        {album.genre.map((genre) => (
          <span key={genre} className="rounded-full bg-neutral-100 px-3 py-1">
            {genre}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-neutral-900">Tracklist</h3>

        <div className="mt-3 space-y-4 text-sm text-neutral-700">
          {Object.entries(album.tracks).map(([side, tracks]) => (
            <div key={side}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
                {side.startsWith("Side") ? side : `Side ${side}`}
              </p>

              <ol className="space-y-1">
                {tracks.map((track, index) => (
                  <li key={`${side}-${track}`}>
                    {index + 1}. {track}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}