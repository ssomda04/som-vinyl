import Image from "next/image";
import type { Album } from "@/types/album";

type VinylCardProps = {
  album: Album;
};

export default function VinylCard({ album }: VinylCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-200 shadow-md transition duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
        <Image
          src={album.coverImage}
          alt={album.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="mt-2">
        <h2 className="truncate text-sm font-semibold text-neutral-900">
          {album.title}
        </h2>
        <p className="truncate text-xs text-neutral-500">{album.artist}</p>
      </div>
    </div>
  );
}