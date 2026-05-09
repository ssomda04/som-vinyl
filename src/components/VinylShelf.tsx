import type { Album } from "@/types/album";
import VinylCard from "./VinylCard";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type VinylShelfProps = {
  albums: Album[];
  selectedAlbumId?: number;
  onAlbumClick: (album: Album) => void;
  isAdminMode: boolean;
  onReorder: (activeId: number, overId: number) => void;
};

export default function VinylShelf({
  albums,
  selectedAlbumId,
  onAlbumClick,
  isAdminMode,
  onReorder,
}: VinylShelfProps) {
  const albumIds = albums.map((album) => album.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    onReorder(Number(active.id), Number(over.id));
  };

  if (!isAdminMode) {
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

  return (
    <div className="rounded-2xl bg-[#8b5e3c] p-6 shadow-2xl">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={albumIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {albums.map((album) => (
              <SortableVinylItem
                key={album.id}
                album={album}
                isSelected={selectedAlbumId === album.id}
                onAlbumClick={onAlbumClick}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

type SortableVinylItemProps = {
  album: Album;
  isSelected: boolean;
  onAlbumClick: (album: Album) => void;
};

function SortableVinylItem({
  album,
  isSelected,
  onAlbumClick,
}: SortableVinylItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: album.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={() => onAlbumClick(album)}
      className={`text-left ${isDragging ? "z-10 opacity-70" : ""}`}
      {...attributes}
      {...listeners}
    >
      <VinylCard album={album} isSelected={isSelected} />
    </button>
  );
}