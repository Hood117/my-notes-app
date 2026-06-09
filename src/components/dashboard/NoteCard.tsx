import React from "react";
import { Star } from "lucide-react";

export interface Note {
  id: string;
  title: string;
  description: string;
  date: string;
  gradientClass: string;
  isStarred: boolean;
  category?: string;
}

interface NoteCardProps {
  key?: string;
  note: Note;
  onToggleStar: (id: string) => void;
  onClick: (note: Note) => void;
}

export default function NoteCard({ note, onToggleStar, onClick }: NoteCardProps) {
  return (
    <div
      id={`note-card-${note.id}`}
      className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-neutral-200/40 cursor-pointer flex flex-col justify-between min-h-[190px] group ${note.gradientClass}`}
      onClick={() => onClick(note)}
    >
      {/* Subtle overlay reflection for a premium look */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -z-10 transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl -z-10" />

      {/* Header with Title and Star button */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display font-black text-lg tracking-tight line-clamp-2 md:text-xl leading-snug drop-shadow-sm group-hover:text-amber-50/95 transition-colors">
            {note.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(note.id);
            }}
            className="shrink-0 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-90 transition-all focus:outline-none"
            aria-label={note.isStarred ? "Unstar note" : "Star note"}
          >
            <Star
              size={18}
              className={`transition-colors duration-300 stroke-[2] ${
                note.isStarred ? "fill-amber-300 text-amber-300" : "text-white/80"
              }`}
            />
          </button>
        </div>

        {/* Date and optional category label */}
        <div className="flex items-center gap-2 mt-2">
          {note.category && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md">
              {note.category}
            </span>
          )}
          <span className="text-[11px] text-white/75 font-mono drop-shadow-sm">
            {note.date}
          </span>
        </div>
      </div>

      {/* Description / Content Body */}
      <div className="mt-4">
        <p className="text-xs text-white/90 font-sans leading-relaxed line-clamp-3 drop-shadow-xs">
          {note.description}
        </p>
      </div>
    </div>
  );
}
