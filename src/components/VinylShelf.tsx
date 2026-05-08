import type { Album } from "@/types/album";
import VinylCard from "./VinylCard";

type VinylShelfProps = {
  albums: Album[];
};

export default function VinylShelf({ albums }: VinylShelfProps) {
  return (
    <div className="rounded-2xl bg-[#8b5e3c] p-6 shadow-2xl">
      <div className="grid grid-cols-2 gap-6 border-b-8 border-[#5c3a24] pb-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {albums.map((album) => (
          <VinylCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}