import { motion } from "motion/react";
import { Sparkles, ArrowRight, Play, Star, Plus, Hash, FolderKanban, Search, Trash } from "lucide-react";
import { useState, FormEvent } from "react";
import { SAMPLE_NOTES } from "../data";
import { NoteCard } from "../types";

export default function Hero() {
  const [notes, setNotes] = useState<NoteCard[]>(SAMPLE_NOTES.slice(0, 3));
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...Array.from(new Set(notes.map(n => n.category)))];

  const handleCreateNote = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    // Pick a random style class set for colorful visual gradients typical of modern Apple-style UI
    const styles = [
      {
        color: "bg-amber-50 text-amber-900 border-amber-200",
        gradient: "bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-950 border-amber-200/50 shadow-orange-100/30"
      },
      {
        color: "bg-purple-50 text-purple-900 border-purple-200",
        gradient: "bg-gradient-to-br from-violet-50 to-indigo-100/60 text-indigo-950 border-violet-200/50 shadow-indigo-100/30"
      },
      {
        color: "bg-rose-50 text-rose-900 border-rose-200",
        gradient: "bg-gradient-to-br from-rose-50 to-pink-100/60 text-pink-950 border-rose-200/50 shadow-rose-100/30"
      },
      {
        color: "bg-sky-50 text-sky-900 border-sky-200",
        gradient: "bg-gradient-to-br from-sky-50 to-blue-100/60 text-blue-950 border-sky-200/50 shadow-blue-100/30"
      }
    ];
    const pickedStyle = styles[Math.floor(Math.random() * styles.length)];

    const note: NoteCard = {
      id: `hero-note-${Date.now()}`,
      title: newTitle,
      content: newContent,
      category: "Personal",
      date: "updated just now",
      isFavorite: false,
      color: pickedStyle.color,
      gradient: pickedStyle.gradient,
      tags: ["new-idea"]
    };

    setNotes([note, ...notes]);
    setNewTitle("");
    setNewContent("");
  };

  const toggleFavorite = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note => {
    const matchesCategory = activeCategory === "All" || note.category === activeCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden" id="hero">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-100/40 blur-[130px] -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-[140px] -z-10" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-rose-100/30 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-100/80 shadow-xs text-xs font-semibold text-neutral-800 mb-6"
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
            <Sparkles size={12} className="text-amber-500 fill-amber-400" />
            Introducing My Notes v2.0
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 mb-6 leading-[1.08]"
          >
            Capture Every Idea <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              Before It Disappears
            </span>
          </motion.h1>

          {/* Subheadline text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 font-sans font-light leading-relaxed"
          >
            A beautiful, lightweight notes application designed for your creative thoughts, structured tasks, and everyday mental clarity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            id="hero-ctas-container"
          >
            <a
              href="#cta"
              className="w-full sm:w-auto flex items-center justify-center gap-2 href-[#cta] px-8 py-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-98 text-base"
              id="hero-primary-cta"
            >
              Get Started Free
              <ArrowRight size={18} />
            </a>
            <a
              href="#preview"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-neutral-200/80 text-neutral-800 font-semibold hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-98 text-base"
              id="hero-secondary-cta"
            >
              <Play size={16} className="text-neutral-500 fill-neutral-400" />
              Interactive Demo
            </a>
          </motion.div>
        </div>

        {/* Dashboard Mockup Showcase Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
          id="hero-preview-frame"
        >
          {/* Accent decoration rings for Linear/Apple aesthetic */}
          <div className="absolute top-[-2%] left-[4%] w-[92%] h-[104%] bg-gradient-to-r from-blue-300 to-indigo-300 rounded-[2.5rem] -z-20 blur-xl opacity-20" />
          <div className="absolute inset-0 bg-neutral-200/50 rounded-[2.5rem] -z-10 border border-white/60 p-1 shadow-2xl shadow-neutral-200/80" />

          {/* Application Window Frame */}
          <div className="bg-white rounded-[2.2rem] overflow-hidden border border-neutral-200/60 shadow-lg flex flex-col md:flex-row h-[560px]" id="app-preview-inner">
            {/* Sidebar of notes app */}
            <div className="w-full md:w-60 bg-neutral-50 border-r border-neutral-200/60 p-5 flex flex-col justify-between shrink-0" id="preview-sidebar">
              <div>
                <div className="flex items-center gap-2 px-1 mb-6">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 animate-pulse" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                </div>

                {/* Simulated profiles info */}
                <div className="flex items-center gap-2 px-2 py-1.5 bg-white/70 rounded-xl border border-neutral-200/40 mb-5 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <span className="text-xs font-semibold text-neutral-700 truncate">Workspace (rahmat)</span>
                </div>

                {/* Sidebar Navigation */}
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-200/60 text-neutral-900 group">
                    <span className="flex items-center gap-2">
                      <FolderKanban size={13} className="text-neutral-500" /> All Notes
                    </span>
                    <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-full font-mono font-medium">
                      {notes.length}
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-200/40 hover:text-neutral-900">
                    <span className="flex items-center gap-2">
                      <Star size={13} className="text-neutral-400" /> Starred
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {notes.filter(n => n.isFavorite).length}
                    </span>
                  </button>
                </div>

                {/* Tag list */}
                <div className="mt-8">
                  <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase px-2">Tags</span>
                  <div className="mt-2 space-y-1">
                    {Array.from(new Set(notes.flatMap(n => n.tags))).slice(0, 4).map(tag => (
                      <button key={tag} className="w-full flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-500 hover:bg-neutral-200/40 hover:text-neutral-800">
                        <Hash size={11} className="text-neutral-400" /> {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Version code indicator */}
              <div className="text-[10px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
                <p>Status: Interactive Sandbox</p>
                <p className="mt-0.5 text-green-600 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" /> Synchronized
                </p>
              </div>
            </div>

            {/* Notes content workspace */}
            <div className="flex-1 bg-white p-6 overflow-hidden flex flex-col justify-between" id="preview-panel">
              <div className="overflow-y-auto pr-1 flex-1">
                {/* Search Bar and controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search live mock database..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl pl-9 pr-3 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto py-1">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-transform focus:outline-none focus:scale-95 ${
                          activeCategory === cat
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter output cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="note-grid">
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-4 rounded-2xl border transition-all duration-300 group hover:shadow-lg relative overflow-hidden backdrop-blur-2s ${note.gradient}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-white/75 backdrop-blur-xs text-neutral-700 rounded-full border border-neutral-200/40">
                            {note.category}
                          </span>
                          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleFavorite(note.id)}
                              className="p-1 rounded-lg hover:bg-white/90 text-neutral-600 focus:outline-none"
                              title="Toggle Favorite"
                            >
                              <Star size={12} className={note.isFavorite ? "fill-amber-400 text-amber-500" : ""} />
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="p-1 rounded-lg hover:bg-white/95 text-red-500 focus:outline-none"
                              title="Delete Note"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-display font-semibold text-neutral-900 text-sm mb-1.5 leading-snug">
                          {note.title}
                        </h4>
                        <p className="font-sans text-xs text-neutral-700/90 whitespace-pre-line leading-relaxed line-clamp-4">
                          {note.content}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-neutral-900/[0.04] flex items-center justify-between">
                          <span className="text-[9px] font-mono text-neutral-500 font-light">
                            {note.date}
                          </span>
                          <div className="flex items-center gap-1">
                            {note.tags.map(t => (
                              <span key={t} className="text-[9px] font-medium text-neutral-500">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10">
                      <p className="text-xs text-neutral-400 font-medium">No active notes found matching tags.</p>
                      <button
                        onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                        className="mt-2 text-[10px] text-blue-500 hover:underline font-semibold"
                      >
                        Reset search filters
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Interaction note adding inline form */}
              <form onSubmit={handleCreateNote} className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2 bg-neutral-50/50 p-2.5 rounded-2xl">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    required
                    maxLength={35}
                    placeholder="New Title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-white border border-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    required
                    maxLength={130}
                    placeholder="Note quick description..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="bg-white border border-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  title="Submit Note"
                  className="flex items-center justify-center p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer hover:shadow-xs active:scale-95 transition-all"
                >
                  <Plus size={14} className="stroke-[3]" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
