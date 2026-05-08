import type { Album } from "@/types/album";
import VinylCard from "./VinylCard";

type VinylShelfProps = {
  albums: Album[];
  selectedAlbumId?: number;
  onAlbumClick: (album: Album) => void;
};

export default function VinylShelf({
  albums,
  selectedAlbumId,
  onAlbumClick,
}: VinylShelfProps) {
  return (
    <div className="rounded-2xl bg-[#8b5e3c] p-6 shadow-2xl">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {albums.map((album) => (
          <button
            key={album.id}
            type="button"
            onClick={() => onAlbumClick(album)}
            className="text-left"
          >
            <VinylCard
              album={album}
              isSelected={selectedAlbumId === album.id}
            />
          </button>
        ))}
      </div>
    </div>
  );
}