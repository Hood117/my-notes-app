import React from "react";
import { Star, Archive, ArchiveRestore, Trash2, Users } from "lucide-react";
import AttachmentThumbnail, { Attachment } from "./AttachmentThumbnail";

export interface Note {
  id: string;
  title: string;
  description: string;
  date: string;
  gradientClass: string;
  isStarred: boolean;
  category?: string;
  is_archived: boolean;
  deleted_at?: string | null;
  attachments?: Attachment[];
  is_shared?: boolean;
  shared_permission?: 'owner' | 'editor';
  owner_id?: string;
  owner_email?: string;
}

interface NoteCardProps {
  key?: string;
  note: Note;
  onToggleStar: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick: (note: Note) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

export default function NoteCard({ note, onToggleStar, onToggleArchive, onDelete, onClick, onRestore, onPermanentDelete }: NoteCardProps) {
  return (
    <div
      id={`note-card-${note.id}`}
      className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-lg transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-neutral-200/40 cursor-pointer flex flex-col justify-between min-h-[190px] group ${note.gradientClass}`}
      onClick={() => {
        if (!note.deleted_at) {
          onClick(note);
        }
      }}
    >
      {/* Subtle overlay reflection for a premium look */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -z-10 transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl -z-10" />

      {/* Header with Title and action buttons */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display font-black text-lg tracking-tight line-clamp-2 md:text-xl leading-snug drop-shadow-sm group-hover:text-amber-50/95 transition-colors">
            {note.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {note.deleted_at ? (
              <>
                {/* Restore */}
                {onRestore && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore(note.id);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-emerald-500/30 active:scale-90 transition-all focus:outline-none"
                    aria-label="Restore note"
                    title="Restore note"
                  >
                    <ArchiveRestore size={14} className="text-white hover:text-emerald-200" />
                  </button>
                )}

                {/* Permanent Delete */}
                {onPermanentDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPermanentDelete(note.id);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-rose-650/45 active:scale-90 transition-all focus:outline-none"
                    aria-label="Permanently delete note"
                    title="Permanently delete note"
                  >
                    <Trash2 size={14} className="text-rose-200 hover:text-rose-100" />
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Favorite (Star) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(note.id);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition-all focus:outline-none"
                  aria-label={note.isStarred ? "Unstar note" : "Star note"}
                  title={note.isStarred ? "Unstar note" : "Star note"}
                >
                  <Star
                    size={14}
                    className={`transition-colors duration-300 stroke-[2] ${
                      note.isStarred ? "fill-amber-300 text-amber-300" : "text-white/80"
                    }`}
                  />
                </button>

                {/* Archive / Unarchive */}
                {!note.is_shared && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleArchive(note.id);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition-all focus:outline-none"
                    aria-label={note.is_archived ? "Unarchive note" : "Archive note"}
                    title={note.is_archived ? "Unarchive note" : "Archive note"}
                  >
                    {note.is_archived ? (
                      <ArchiveRestore size={14} className="text-white/80" />
                    ) : (
                      <Archive size={14} className="text-white/80" />
                    )}
                  </button>
                )}

                {/* Delete (Soft Delete) */}
                {onDelete && !note.is_shared && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note.id);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-red-500/30 active:scale-90 transition-all focus:outline-none"
                    aria-label="Delete note"
                    title="Delete note"
                  >
                    <Trash2 size={14} className="text-white/80" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Date and optional category label */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {note.category && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md">
              {note.category}
            </span>
          )}
          {note.is_shared && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-1 border border-white/10" title={`Shared by note creator`}>
              <Users size={10} className="stroke-[2.5]" />
              <span>{note.shared_permission === "editor" ? "Editor" : "Collaborator"}</span>
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
          {(() => {
            if (!note.description) return "";
            try {
              const doc = new DOMParser().parseFromString(note.description, "text/html");
              return doc.body.textContent || "";
            } catch (e) {
              return note.description.replace(/<[^>]*>/g, " ");
            }
          })()}
        </p>
      </div>

      {/* Attachments Section summary */}
      {note.attachments && note.attachments.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap gap-1.5 animate-in fade-in duration-300">
          {note.attachments.map((att) => (
            <div 
              key={att.id}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2 py-1 rounded-lg text-[9px] text-white select-none transition-all duration-200 border border-white/5"
              title={`${att.file_name} (${(att.file_size / 1024).toFixed(1)} KB)`}
            >
              <AttachmentThumbnail attachment={att} mini={true} />
              <span className="truncate max-w-[75px] font-sans font-bold">{att.file_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
