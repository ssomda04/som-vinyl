import Image from "next/image";
import type { Album } from "@/types/album";

type AlbumDetailPanelProps = {
  album: Album;
  onClose: () => void;
  onPlaceOnTurntable: (album: Album) => void;
};

export default function AlbumDetailPanel({
  album,
  onClose,
  onPlaceOnTurntable,
}: AlbumDetailPanelProps) {
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
                Side {side}
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