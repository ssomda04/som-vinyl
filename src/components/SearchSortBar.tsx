import type { SortOption } from "@/types/sort";

type SearchSortBarProps = {
  searchQuery: string;
  sortOption: SortOption;
  isAdminMode: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onToggleAdminMode: () => void;
};

export default function SearchSortBar({
  searchQuery,
  sortOption,
  isAdminMode,
  onSearchChange,
  onSortChange,
  onToggleAdminMode,
}: SearchSortBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        placeholder="Search vinyls..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-400"
      />

      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-400"
      >
        <option value="shelf">Shelf Order</option>
        <option value="title">Title</option>
        <option value="artist">Artist</option>
        <option value="year">Year</option>
      </select>

      <button
        type="button"
        onClick={onToggleAdminMode}
        className={`rounded-xl border px-4 py-3 text-sm transition ${
          isAdminMode
            ? "border-neutral-900 bg-neutral-900 text-white"
            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
        }`}
      >
        {isAdminMode ? "Editing Shelf" : "Edit Shelf"}
      </button>
    </div>
  );
}