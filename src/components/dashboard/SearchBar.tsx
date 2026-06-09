import { Search, X, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function SearchBar({
  value,
  onChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: SearchBarProps) {
  return (
    <div id="search-bar-container" className="space-y-4">
      {/* Input container */}
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors"
          size={18}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search note titles, tags, or descriptions..."
          className="w-full bg-white hover:bg-neutral-50/50 focus:bg-white border border-neutral-200/80 rounded-2xl py-3.5 pl-12 pr-10 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all placeholder:text-neutral-400"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all focus:outline-none"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Categories Horizontal Scrolling Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-neutral-400 mr-1.5 shrink-0">
          <SlidersHorizontal size={13} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Filters:</span>
        </div>
        
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border focus:outline-none ${
                isActive
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                  : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:border-neutral-300"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
