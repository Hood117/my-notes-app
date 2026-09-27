import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SAMPLE_NOTES } from "../data";
import { NoteCard } from "../types";
import { Palette, Search, Star, Users, Paperclip } from "lucide-react";

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"cards" | "search" | "favorites" | "collaboration">("cards");
  const [localNotes, setLocalNotes] = useState<NoteCard[]>(SAMPLE_NOTES);
  const [previewSearch, setPreviewSearch] = useState("");

  const tabs = [
    { id: "cards", label: "Notes Grid", icon: <Palette size={14} /> },
    { id: "search", label: "Instant Search", icon: <Search size={14} /> },
    { id: "favorites", label: "Starred", icon: <Star size={14} /> },
    { id: "collaboration", label: "Collaboration", icon: <Users size={14} /> },
  ] as const;

  const handleFavoriteToggle = (id: string) => {
    setLocalNotes(localNotes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  };

  const currentFiltered = localNotes.filter(n => {
    if (activeTab === "favorites") return n.isFavorite;
    if (activeTab === "search" && previewSearch) {
      return n.title.toLowerCase().includes(previewSearch.toLowerCase()) || 
             n.content.toLowerCase().includes(previewSearch.toLowerCase());
    }
    return true;
  });

  return (
    <section className="py-24 bg-white" id="preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Preview
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-2 mb-3">
            Experience the Workspace
          </h2>
          <p className="text-base text-neutral-500 font-sans font-light">
            Fast, intuitive note-taking built for deep focus and smooth team collaboration.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" id="preview-tabs">
          {tabs.map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "search") setPreviewSearch("");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border outline-none ${
                  isSelected
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200/60"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Display Stage */}
        <div className="bg-neutral-50/70 border border-neutral-200/70 rounded-3xl p-6 md:p-8 relative overflow-hidden" id="tour-stage">
          
          <AnimatePresence mode="wait">
            {activeTab === "cards" && (
              <motion.div
                key="cards-tour"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {localNotes.slice(0, 3).map(note => (
                    <div
                      key={note.id}
                      className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-md relative ${note.gradient}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                          {note.category}
                        </span>
                        <button
                          onClick={() => handleFavoriteToggle(note.id)}
                          className="p-1 rounded-lg hover:bg-white/80 text-neutral-400 focus:outline-none transition-colors"
                        >
                          <Star size={14} className={note.isFavorite ? "fill-amber-400 text-amber-500" : ""} />
                        </button>
                      </div>
                      <h4 className="font-display font-bold text-neutral-900 text-sm mb-1.5">{note.title}</h4>
                      <p className="font-sans text-xs text-neutral-700 leading-relaxed line-clamp-3">{note.content}</p>
                      
                      <div className="mt-4 pt-2.5 border-t border-neutral-900/[0.04] flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{note.date}</span>
                        <div className="flex gap-1.5">
                          {note.tags.map(t => (
                            <span key={t} className="text-neutral-500">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "search" && (
              <motion.div
                key="search-tour"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="max-w-md mx-auto relative mb-6">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                  <input
                    type="text"
                    placeholder="Search note titles or content..."
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {currentFiltered.length > 0 ? (
                    currentFiltered.map(note => (
                      <div key={note.id} className="p-4 rounded-xl border bg-white border-neutral-200/80 transition-all hover:shadow-xs">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                          <span className="font-medium text-neutral-600">{note.category}</span>
                          <span>{note.date}</span>
                        </div>
                        <h4 className="font-display font-semibold text-neutral-900 text-sm">{note.title}</h4>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 bg-white rounded-xl border border-neutral-200/60">
                      <p className="text-xs text-neutral-400">No notes found matching "{previewSearch}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "favorites" && (
              <motion.div
                key="favorites-tour"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl mx-auto space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {localNotes.map(note => (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        note.isFavorite 
                          ? "bg-amber-50/60 border-amber-200/80" 
                          : "bg-white border-neutral-200/60 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <button
                          onClick={() => handleFavoriteToggle(note.id)}
                          className="p-1 rounded-lg text-amber-500 focus:outline-none"
                        >
                          <Star size={14} className={note.isFavorite ? "fill-amber-400" : "text-neutral-300"} />
                        </button>
                        <div className="truncate">
                          <h4 className="font-display font-semibold text-neutral-900 text-xs truncate">{note.title}</h4>
                          <p className="text-[11px] text-neutral-500 truncate">{note.content}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400 ml-2 shrink-0">
                        {note.category}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "collaboration" && (
              <motion.div
                key="collaboration-tour"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
                  {/* Top Bar with Collaborator Avatars */}
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4 select-none">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-neutral-600">
                        3 editors active
                      </span>
                    </div>

                    <div className="flex -space-x-1.5">
                      <div className="h-6 w-6 rounded-full border-2 border-white bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">JD</div>
                      <div className="h-6 w-6 rounded-full border-2 border-white bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">AL</div>
                      <div className="h-6 w-6 rounded-full border-2 border-white bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">MK</div>
                    </div>
                  </div>

                  {/* Document Body */}
                  <div className="text-left space-y-3 relative min-h-[140px]">
                    <h4 className="font-display font-bold text-neutral-900 text-base">
                      Q3 Product Release Plan
                    </h4>
                    
                    <div className="text-xs text-neutral-700 leading-relaxed space-y-2">
                      <p>
                        Reviewing core architecture and finalizing responsive design guidelines.
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                        <li>High-resolution asset export verification</li>
                        <li>Sync offline-first changes with cloud database</li>
                      </ul>
                    </div>

                    {/* Live Cursors */}
                    <div className="absolute top-[25%] left-[50%] pointer-events-none flex flex-col items-start gap-0.5">
                      <svg width="10" height="13" viewBox="0 0 14 19" fill="none">
                        <path d="M0.5 1.5V17.5L5.0 13.0H12.5L0.5 1.5Z" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
                      </svg>
                      <span className="bg-blue-600 text-[8px] font-medium text-white px-1.5 py-0.5 rounded shadow-xs">
                        John Doe
                      </span>
                    </div>

                    <div className="absolute top-[65%] left-[75%] pointer-events-none flex flex-col items-start gap-0.5">
                      <svg width="10" height="13" viewBox="0 0 14 19" fill="none">
                        <path d="M0.5 1.5V17.5L5.0 13.0H12.5L0.5 1.5Z" fill="#10B981" stroke="white" strokeWidth="1.5" />
                      </svg>
                      <span className="bg-emerald-600 text-[8px] font-medium text-white px-1.5 py-0.5 rounded shadow-xs">
                        Alice Lee
                      </span>
                    </div>
                  </div>

                  {/* Attachment Preview */}
                  <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Paperclip size={13} className="text-neutral-400" />
                      <span className="font-medium text-xs">release-roadmap.pdf</span>
                      <span className="text-[11px] text-neutral-400 font-mono">(2.4 MB)</span>
                    </div>
                    <span className="text-[11px] text-blue-600 font-medium">Attached</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
