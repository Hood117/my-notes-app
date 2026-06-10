import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SAMPLE_NOTES } from "../data";
import { NoteCard } from "../types";
import { Palette, Search, Star, Smartphone, Laptop, Sparkles, Pin, CheckCircle, Users, MousePointer, Paperclip } from "lucide-react";

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"cards" | "search" | "favorites" | "sync" | "collaboration">("cards");
  const [localNotes, setLocalNotes] = useState<NoteCard[]>(SAMPLE_NOTES);
  const [previewSearch, setPreviewSearch] = useState("");

  const tabs = [
    { id: "cards", label: "Colorful Cards", icon: <Palette size={14} />, desc: "Color-graded templates" },
    { id: "search", label: "Smart Search", icon: <Search size={14} />, desc: "Find words instantly" },
    { id: "favorites", label: "Favorites & Pins", icon: <Star size={14} />, desc: "Pin key actions" },
    { id: "sync", label: "Multi-Device", icon: <Smartphone size={14} />, desc: "Cloud synced frames" },
    { id: "collaboration", label: "Real-time Collab", icon: <Users size={14} />, desc: "Shared note session" },
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
        
        {/* Intro header content */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            Interactive Tour
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-4 mb-3">
            Interact with the Dashboard
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-sans">
            Don't just take our word for it. Click the tabs below to test-drive specific features of our signature workspace right from this browser.
          </p>
        </div>

        {/* Responsive Tab bar selectors */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" id="preview-tabs">
          {tabs.map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "search") setPreviewSearch("");
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold transition-all border outline-none ${
                  isSelected
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-md shadow-neutral-950/10 scale-102"
                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200/50 hover:border-neutral-200"
                }`}
              >
                {tab.icon}
                <div className="text-left">
                  <span className="block">{tab.label}</span>
                  <span className={`block text-[9px] font-normal leading-none mt-0.5 ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>
                    {tab.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Stage */}
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-[2.5rem] p-5 md:p-10 shadow-sm relative overflow-hidden" id="tour-stage">
          
          <AnimatePresence mode="wait">
            {activeTab === "cards" && (
              <motion.div
                key="cards-tour"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 p-5 rounded-2xl border border-neutral-100 mb-2">
                  <div>
                    <h3 className="font-display font-bold text-neutral-900 text-lg flex items-center gap-1.5">
                      <Sparkles size={16} className="text-amber-500 fill-amber-300" />
                      Visual Color templates
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Choose cozy gradients that help your memory retain concepts quickly. Color stimulates productivity.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                    💡 Click the tags below
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {localNotes.slice(0, 3).map(note => (
                    <div
                      key={note.id}
                      className={`p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group ${note.gradient}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-white/70 rounded-full text-neutral-700">
                          {note.category}
                        </span>
                        <button
                          onClick={() => handleFavoriteToggle(note.id)}
                          className="p-1 rounded-lg hover:bg-white text-neutral-500 focus:outline-none transition-transform active:scale-90"
                        >
                          <Star size={14} className={note.isFavorite ? "fill-amber-400 text-amber-500 stroke-[2.5]" : ""} />
                        </button>
                      </div>
                      <h4 className="font-display font-bold text-neutral-900 text-base mb-2">{note.title}</h4>
                      <p className="font-sans text-xs text-neutral-800 leading-relaxed line-clamp-3">{note.content}</p>
                      
                      <div className="mt-5 pt-3 border-t border-neutral-900/[0.04] flex gap-1 items-center">
                        {note.tags.map(t => (
                          <span key={t} className="text-[10px] bg-white/40 px-2 py-0.5 rounded-full text-neutral-600 font-medium">#{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "search" && (
              <motion.div
                key="search-tour"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white/60 p-5 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-neutral-900 text-lg flex items-center gap-1.5">
                      <Search size={16} className="text-indigo-600" />
                      Dynamic Sub-string Indexing
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Start typing below to search titles, body texts, or specific category metadata instantly.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                    <input
                      type="text"
                      placeholder="Type code, SaaS, or plan..."
                      value={previewSearch}
                      onChange={(e) => setPreviewSearch(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentFiltered.length > 0 ? (
                    currentFiltered.map(note => (
                      <div key={note.id} className={`p-5 rounded-2xl border bg-white border-neutral-100 flex gap-4 transition-all hover:shadow-md`}>
                        <div className="text-indigo-500 shrink-0 mt-0.5">
                          <CheckCircle size={15} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-neutral-400">{note.category}</span>
                          <h4 className="font-display font-semibold text-neutral-950 text-sm mt-0.5">{note.title}</h4>
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{note.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-neutral-100">
                      <p className="text-sm font-semibold text-neutral-500">No notes found matching "{previewSearch}"</p>
                      <button onClick={() => setPreviewSearch("")} className="text-xs text-blue-500 hover:underline mt-1">Reset filter query</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "favorites" && (
              <motion.div
                key="favorites-tour"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white/60 p-5 rounded-2xl border border-neutral-100">
                  <h3 className="font-display font-bold text-neutral-900 text-lg flex items-center gap-1.5">
                    <Pin size={15} className="text-amber-500 rotate-45" />
                    Starred Items Priority List
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Your most critical reminders and workflow boards pins live directly at the top row. Toggle stars to custom-group them.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localNotes.map(note => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        note.isFavorite 
                          ? "bg-amber-50/70 border-amber-200" 
                          : "bg-white border-neutral-100 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <button
                          onClick={() => handleFavoriteToggle(note.id)}
                          className="p-1 rounded-lg text-amber-500 focus:outline-none hover:bg-neutral-100"
                        >
                          <Star size={15} className={note.isFavorite ? "fill-amber-400" : "text-neutral-300"} />
                        </button>
                        <div className="truncate">
                          <h4 className="font-display font-semibold text-neutral-900 text-xs truncate">{note.title}</h4>
                          <p className="text-[10px] text-neutral-400 truncate">{note.content}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-400 shrink-0 ml-1 bg-white/80 border border-neutral-200/30 px-1.5 py-0.5 rounded">
                        {note.category}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "sync" && (
              <motion.div
                key="sync-tour"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white/100 p-6 rounded-3xl border border-neutral-200/80 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 shadow-sm">
                  {/* Laptop wireframe representation in premium vectors */}
                  <div className="flex-1 flex justify-center scale-95 md:scale-100">
                    <div className="relative w-64 h-40 bg-neutral-900 rounded-lg p-1.5 shadow-2xl flex flex-col justify-between border-2 border-neutral-700">
                      <div className="bg-white rounded-md h-[90%] p-2 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          </div>
                          <span className="text-[8px] text-neutral-400 font-mono">Sync active</span>
                        </div>
                        <div className="space-y-1.5 my-3">
                          <div className="h-3 w-3/4 bg-violet-100 rounded" />
                          <div className="h-2 w-full bg-neutral-100 rounded" />
                        </div>
                        <div className="h-1 bg-neutral-100 rounded-full" />
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full w-full" />
                    </div>

                    <div className="-ml-8 mt-12 relative w-16 h-28 bg-neutral-950 rounded-[1.2rem] p-1 shadow-2xl flex flex-col justify-between border-2 border-neutral-800 shrink-0">
                      <div className="bg-white rounded-[0.9rem] h-full p-1.5 flex flex-col justify-between">
                        <div className="w-4 h-0.5 bg-neutral-200 mx-auto rounded-full mb-1" />
                        <div className="h-4 w-full bg-violet-100 rounded" />
                        <div className="h-1.5 bg-neutral-100 rounded-full my-1" />
                        <div className="w-2 h-2 rounded-full bg-neutral-300 mx-auto" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <span className="text-[10px] font-bold tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase">
                      Automated replication
                    </span>
                    <h4 className="font-display font-bold text-neutral-900 text-lg">
                      Consistent offline fallback
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                      Write ideas in a plane, train, or underground tube. Our local IndexedDB technology saves state locally and auto-synchronizes the millisecond a cloud connection is detected. No data is ever dropped.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-mono text-neutral-400">Conflict-free resolution enabled</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "collaboration" && (
              <motion.div
                key="collaboration-tour"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 p-5 rounded-2xl border border-neutral-100 mb-2">
                  <div>
                    <h3 className="font-display font-bold text-neutral-900 text-lg flex items-center gap-1.5">
                      <Users size={16} className="text-blue-600 animate-pulse" />
                      Live Shared Notes Session
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      See collaborator cursors, rich text revisions, and attachments working in perfect sync with zero-latency Supabase channels.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                    ⚡ Live Collaboration Mockup
                  </span>
                </div>

                <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-md relative overflow-hidden max-w-2xl mx-auto min-h-[340px]">
                  {/* Top Bar with Collaborator Avatars */}
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4 select-none">
                    <div className="flex items-center gap-1.5 text-left">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                        3 collaborators active
                      </span>
                    </div>

                    {/* Avatar Stacks */}
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <div className="inline-block h-6 w-6 rounded-full border-2 border-white bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs" title="John Doe">JD</div>
                      <div className="inline-block h-6 w-6 rounded-full border-2 border-white bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs" title="Jane Smith">JS</div>
                      <div className="inline-block h-6 w-6 rounded-full border-2 border-white bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs" title="Alice Carter">AC</div>
                    </div>
                  </div>

                  {/* Editors Format Options Bar */}
                  <div className="flex items-center gap-4 py-1.5 px-3 bg-neutral-50 rounded-xl border border-neutral-200/60 mb-4 text-xs text-neutral-400 font-mono">
                    <span className="font-bold text-neutral-700">H1</span>
                    <span className="font-bold text-neutral-700">H2</span>
                    <span className="font-bold text-neutral-700">B</span>
                    <span className="italic text-neutral-700">I</span>
                    <span className="underline text-neutral-700">U</span>
                    <span className="text-neutral-300">|</span>
                    <span className="flex items-center gap-1 text-[10px] text-neutral-600 font-sans font-semibold">
                      <Paperclip size={11} /> 2 Files Attached
                    </span>
                  </div>

                  {/* Document Body with Live Cursors representation */}
                  <div className="text-left space-y-4 relative min-h-[160px]">
                    <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full">
                      Strategy Briefing
                    </span>
                    <h4 className="font-display font-extrabold text-neutral-900 text-lg leading-tight">
                      🚀 Q3 Launch Strategy Briefing
                    </h4>
                    
                    <div className="text-xs text-neutral-800 leading-relaxed font-sans space-y-3">
                      <p>
                        We are launching our referral reward campaign across 4 key channels. Please make sure to download the attached brief!
                      </p>
                      
                      {/* Rich Text Representation - Bullet points */}
                      <ul className="list-disc pl-4 space-y-1.5 text-neutral-700">
                        <li>Ensure all brand graphics are exported in high-res format.</li>
                        <li>Sync the Google Auth flow with early beta subscribers.</li>
                      </ul>
                    </div>

                    {/* Floating labeled text cursors for presentation */}
                    {/* Live Cursor 1 */}
                    <div className="absolute top-[35%] left-[45%] pointer-events-none flex flex-col items-start gap-1">
                      <svg width="12" height="15" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 1.5V17.5L5.0 13.0H12.5L0.5 1.5Z" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
                      </svg>
                      <div className="bg-blue-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-md shadow">
                        John Doe
                      </div>
                    </div>

                    {/* Live Cursor 2 */}
                    <div className="absolute top-[75%] left-[80%] pointer-events-none flex flex-col items-start gap-1">
                      <svg width="12" height="15" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 1.5V17.5L5.0 13.0H12.5L0.5 1.5Z" fill="#10B981" stroke="white" strokeWidth="1.5" />
                      </svg>
                      <div className="bg-emerald-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-md shadow">
                        Jane Smith (Typing...)
                      </div>
                    </div>
                  </div>

                  {/* Attachment Preview representation */}
                  <div className="mt-6 pt-4 border-t border-neutral-150 text-left">
                    <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Attachments (1)
                    </span>
                    <div className="flex items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-2.5 rounded-xl text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                          <Paperclip size={12} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-neutral-800 text-[11px] truncate leading-tight">
                            q3_launch_deck_presentation.pdf
                          </p>
                          <p className="text-[9px] text-neutral-450 font-mono mt-0.5">
                            3.8 MB
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 cursor-pointer">
                        Download
                      </span>
                    </div>
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
