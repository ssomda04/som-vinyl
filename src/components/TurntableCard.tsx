import Image from "next/image";
import type { Album } from "@/types/album";

type TurntableCardProps = {
  album: Album | null;
  onRemove: () => void;
};

export default function TurntableCard({ album, onRemove }: TurntableCardProps) {
  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-[#fffaf2] p-4 shadow-sm">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-400">
        On Turntable
      </p>

      {album ? (
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
              src={album.coverImage}
              alt={album.title}
              fill
              className="object-cover"
            />
          </div>

          <button
            type="button"
            onClick={onRemove}
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
  );
}