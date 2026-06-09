import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../../lib/supabase/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase/client";
import { 
  NotebookPen, 
  LogOut, 
  Calendar, 
  Trash2, 
  Star, 
  Plus, 
  SlidersHorizontal,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Search,
  Check,
  Edit2
} from "lucide-react";
import NoteCard, { Note } from "./NoteCard";
import SearchBar from "./SearchBar";
import AddButton from "./AddButton";
import BottomNav, { NavTab } from "./BottomNav";

// List of pre-styled gradient selections with elegant branding names
const GRADIENTS = [
  { id: "cosmic", name: "Cosmic Twilight", class: "bg-gradient-to-br from-blue-600 to-indigo-700" },
  { id: "sunset", name: "Sunset Horizon", class: "bg-gradient-to-br from-orange-400 to-pink-600" },
  { id: "ocean", name: "Ocean Calm", class: "bg-gradient-to-br from-teal-400 to-emerald-600" },
  { id: "lavender", name: "Lavender Oasis", class: "bg-gradient-to-br from-violet-500 to-purple-650" },
  { id: "emerald", name: "Emerald Mint", class: "bg-gradient-to-br from-emerald-500 to-teal-650" },
  { id: "raspberry", name: "Raspberry Wine", class: "bg-gradient-to-br from-rose-400 to-red-600" },
];

const CATEGORIES = ["All", "Starred", "Work", "Personal", "Ideas", "Study"];

const INITIAL_NOTES: Note[] = [
  {
    id: "n-1",
    title: "Workplace Workflow Restructuring",
    description: "Audit our daily operation logs, restructure high-priority task queues in the local database, and design interactive responsive mockup screens for the upcoming client feedback round.",
    date: "Today, 10:42 AM",
    gradientClass: "bg-gradient-to-br from-blue-600 to-indigo-700",
    isStarred: true,
    category: "Work"
  },
  {
    id: "n-2",
    title: "Inspiration: Brand Identity Redesign",
    description: "Aesthetic rules for our custom user workstation interfaces. Use premium typography like 'Space Grotesk' paired with 'JetBrains Mono', generous visual whitespace, and custom reactive elements.",
    date: "Yesterday, 3:15 PM",
    gradientClass: "bg-gradient-to-br from-orange-400 to-pink-600",
    isStarred: true,
    category: "Ideas"
  },
  {
    id: "n-3",
    title: "Weekly Trail Run & Fitness Routine",
    description: "Aim for a 5km outdoor cadence, monitor cardiac limits with offline health metrics, and compile performance statistics directly into local user workstation tables.",
    date: "Jun 07, 7:30 AM",
    gradientClass: "bg-gradient-to-br from-teal-400 to-emerald-600",
    isStarred: false,
    category: "Personal"
  },
  {
    id: "n-4",
    title: "Quantum Superposition & Eigenvalues",
    description: "Brief summary of lecture notes on linear operators in complex Hilbert spaces, matrix trace operations, and probability amplitudes for Schrodinger transition equations.",
    date: "Jun 05, 11:20 AM",
    gradientClass: "bg-gradient-to-br from-violet-500 to-purple-650",
    isStarred: false,
    category: "Study"
  },
  {
    id: "n-5",
    title: "Client-Side Database Replication",
    description: "Design local sync checkpoints, implement background network retry hooks, and configure safe conflict resolution using timestamps to protect high-density task records.",
    date: "Jun 03, 4:55 PM",
    gradientClass: "bg-gradient-to-br from-emerald-500 to-teal-650",
    isStarred: false,
    category: "Ideas"
  },
  {
    id: "n-6",
    title: "Sourdough Starter & Rosemary Bread",
    description: "Ratios for hydration at 74% using premium organic rye flour, natural ambient wild yeast cultivation steps, baking temperature limits, and custom cast-iron dutch oven scoring guidelines.",
    date: "May 28, 8:15 PM",
    gradientClass: "bg-gradient-to-br from-rose-400 to-red-600",
    isStarred: false,
    category: "Personal"
  }
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const supabase = getSupabaseClient();
  
  // Interactive Notes Storage loaded from Supabase or local simulation
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Client search and filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Custom navigation state (for responsive sync)
  const [activeTab, setActiveTab] = useState<NavTab>("all");

  // Notes Modals triggers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  // Creation Form state handlers
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Work");
  const [newGradient, setNewGradient] = useState("bg-gradient-to-br from-blue-600 to-indigo-700");

  // Edit State inside Viewer modal
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("Work");
  const [editGradient, setEditGradient] = useState("");

  // Map database record to UI Note model safely
  const mapSupabaseToNote = (dbNote: any): Note => {
    let description = dbNote.content || "";
    let category = "Work";
    let gradientClass = "bg-gradient-to-br from-blue-600 to-indigo-700";

    if (dbNote.content) {
      try {
        const parsed = JSON.parse(dbNote.content);
        if (parsed && typeof parsed === "object" && "description" in parsed) {
          description = parsed.description || "";
          category = parsed.category || "Work";
          gradientClass = parsed.gradientClass || "bg-gradient-to-br from-blue-600 to-indigo-700";
        }
      } catch (e) {
        description = dbNote.content;
        const titleLower = (dbNote.title || "").toLowerCase();
        if (titleLower.includes("work") || titleLower.includes("job") || titleLower.includes("meeting")) category = "Work";
        else if (titleLower.includes("idea") || titleLower.includes("brainstorm") || titleLower.includes("inspire")) category = "Ideas";
        else if (titleLower.includes("study") || titleLower.includes("math") || titleLower.includes("quantum")) category = "Study";
        else if (titleLower.includes("personal") || titleLower.includes("run") || titleLower.includes("bread") || titleLower.includes("fitness")) category = "Personal";
        
        if (category === "Work") gradientClass = "bg-gradient-to-br from-blue-600 to-indigo-700";
        else if (category === "Ideas") gradientClass = "bg-gradient-to-br from-orange-400 to-pink-600";
        else if (category === "Personal") gradientClass = "bg-gradient-to-br from-teal-400 to-emerald-600";
        else if (category === "Study") gradientClass = "bg-gradient-to-br from-violet-500 to-purple-650";
      }
    }

    let displayDate = "Just now";
    if (dbNote.created_at) {
      try {
        const dateObj = new Date(dbNote.created_at);
        displayDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
      } catch (e) {
        // fallback
      }
    }

    return {
      id: dbNote.id,
      title: dbNote.title || "Untitled",
      description,
      date: displayDate,
      gradientClass,
      isStarred: !!dbNote.favorite,
      category
    };
  };

  // Robust data fetching async handler
  const loadNotes = async () => {
    if (!user) return;
    setNotesLoading(true);
    setErrorMsg("");
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        if (data) {
          setNotes(data.map(mapSupabaseToNote));
        }
      } else {
        // Local sandbox simulation database behavior
        const saved = localStorage.getItem(`my_notes_interactive_list_${user.id}`);
        if (saved) {
          setNotes(JSON.parse(saved));
        } else {
          // Initialize sandbox with curated default notes beautifully
          const seeded = INITIAL_NOTES.map((n, i) => ({
            ...n,
            id: `sand-note-${Date.now()}-${i}`
          }));
          setNotes(seeded);
          localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(seeded));
        }
      }
    } catch (err: any) {
      console.error("Error fetching notes: ", err);
      setErrorMsg(err.message || "Failed to synchronise notes table.");
    } finally {
      setNotesLoading(false);
    }
  };

  // Trigger loads upon user session configuration
  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
      setNotesLoading(false);
    }
  }, [user]);

  // Sync bottom nav clicks to category states
  useEffect(() => {
    if (activeTab === "all") {
      setSelectedCategory("All");
    } else if (activeTab === "starred") {
      setSelectedCategory("Starred");
    } else if (activeTab === "settings") {
      setSelectedCategory("All");
    }
  }, [activeTab]);

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out of your workstation?")) {
      await signOut();
    }
  };

  const handleToggleStar = async (id: string) => {
    if (!user) return;

    // Optimistically update the UI
    const targetNote = notes.find(n => n.id === id);
    if (!targetNote) return;

    const originalStarred = targetNote.isStarred;
    const nextStarred = !originalStarred;

    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isStarred: nextStarred } : note
    ));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(prev => prev ? { ...prev, isStarred: nextStarred } : null);
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("notes")
          .update({
            favorite: nextStarred
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw new Error(error.message);
      } else {
        // Sandbox mode update
        const updatedNotes = notes.map(note => 
          note.id === id ? { ...note, isStarred: nextStarred } : note
        );
        setNotes(updatedNotes);
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }
    } catch (err: any) {
      console.error("Failed to toggle favorite: ", err);
      // Revert optimistic update
      setNotes(prev => prev.map(note => 
        note.id === id ? { ...note, isStarred: originalStarred } : note
      ));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(prev => prev ? { ...prev, isStarred: originalStarred } : null);
      }
      alert("Failed to sync favorite state: " + err.message);
    }
  };

  const handleCreateNoteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !user) return;

    setActionLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("notes")
          .insert({
            user_id: user.id,
            title: newTitle.trim(),
            content: JSON.stringify({
              description: newDesc.trim(),
              category: newCategory,
              gradientClass: newGradient
            }),
            favorite: false
          });

        if (error) throw new Error(error.message);
        await loadNotes();
      } else {
        const formattedTime = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });

        const newNote: Note = {
          id: `sand-note-${Date.now()}`,
          title: newTitle.trim(),
          description: newDesc.trim(),
          date: formattedTime,
          gradientClass: newGradient,
          isStarred: false,
          category: newCategory
        };

        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }

      setIsCreateOpen(false);
      // Clear form
      setNewTitle("");
      setNewDesc("");
      setNewCategory("Work");
      setNewGradient("bg-gradient-to-br from-blue-600 to-indigo-700");
    } catch (err: any) {
      console.error("Error creating note: ", err);
      alert("Failed to create note: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedNote || !editTitle.trim() || !editDesc.trim() || !user) return;

    setActionLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("notes")
          .update({
            title: editTitle.trim(),
            content: JSON.stringify({
              description: editDesc.trim(),
              category: editCategory,
              gradientClass: editGradient
            })
          })
          .eq("id", selectedNote.id)
          .eq("user_id", user.id);

        if (error) throw new Error(error.message);
        await loadNotes();
      } else {
        const updatedNotes = notes.map(note => 
          note.id === selectedNote.id 
            ? { 
                ...note, 
                title: editTitle.trim(), 
                description: editDesc.trim(), 
                category: editCategory, 
                gradientClass: editGradient 
              }
            : note
        );
        setNotes(updatedNotes);
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }

      setIsEditing(false);
      setSelectedNote(null);
    } catch (err: any) {
      console.error("Error saving notes: ", err);
      alert("Failed to update note: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note irreversibly?")) return;
    if (!user) return;

    setActionLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("notes")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw new Error(error.message);
        await loadNotes();
      } else {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }
      setSelectedNote(null);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error deleting note: ", err);
      alert("Failed to delete note: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCardClick = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditDesc(note.description);
    setEditCategory(note.category || "Work");
    setEditGradient(note.gradientClass);
    setIsEditing(false);
  };

  // Filter criteria computation
  const filteredNotes = notes.filter(note => {
    // 1. Text Search matching title or description
    const textFields = `${note.title} ${note.description} ${note.category || ""}`.toLowerCase();
    const matchesSearch = textFields.includes(searchQuery.toLowerCase());

    // 2. Category filters
    let matchesCategory = true;
    if (selectedCategory === "Starred") {
      matchesCategory = note.isStarred;
    } else if (selectedCategory !== "All") {
      matchesCategory = note.category?.toLowerCase() === selectedCategory.toLowerCase();
    }

    // 3. Sync sidebar tab filters for Mobile fallback views
    let matchesTab = true;
    if (activeTab === "starred") {
      matchesTab = note.isStarred;
    }

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div id="dashboard-layout" className="min-h-screen bg-[#fafafa] flex flex-col text-neutral-900 font-sans pb-24 sm:pb-8 selection:bg-blue-100 selection:text-blue-700">
      
      {/* Premium Dashboard Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-650 text-white shadow-md shadow-indigo-150">
            <NotebookPen size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base md:text-lg tracking-tight leading-tight">
              AuraNotes Workspace
            </span>
            <span className="text-[10px] font-mono text-neutral-400 font-semibold uppercase tracking-wider leading-none">
              Modern Dashboard
            </span>
          </div>
        </div>

        {/* User Workspace Profiles / Sign Out Action */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-neutral-800 leading-tight">{user?.name || "Developer Guest"}</span>
            <span className="text-[10px] text-neutral-400 font-mono leading-none">{user?.email || "sandbox@auranotes.co"}</span>
          </div>

          <div className="h-5 w-px bg-neutral-200 hidden sm:block" />

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all focus:outline-none cursor-pointer"
            id="dash-logout-btn"
          >
            <LogOut size={14} className="stroke-[2.2]" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workstation Container */}
      <div className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Panel - Hidden on Mobile */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          
          {/* Active Profile spec review */}
          <div className="bg-white border border-neutral-200/60 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-[-5%] right-[-5%] w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl -z-10" />
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
              <div className="w-12 h-12 bg-gradient-to-tr from-neutral-800 to-neutral-950 text-white flex items-center justify-center rounded-2xl font-bold font-display text-lg shadow-sm">
                {(user?.name?.[0] || "D").toUpperCase()}
              </div>
              <div className="truncate">
                <h3 className="text-sm font-bold text-neutral-900 leading-snug truncate">
                  {user?.name || "Developer"}
                </h3>
                <span className="text-[10px] font-mono text-neutral-400 font-bold tracking-wider uppercase">
                  ACTIVE MEMBER
                </span>
              </div>
            </div>

            <div className="space-y-4" id="profile-specs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Storage Engine
                </span>
                <span className="font-mono text-[9px] font-black bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-lg">
                  {isSupabaseConfigured ? "Supabase" : "Local cache"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? "bg-emerald-500 animate-pulse" : "bg-orange-400"}`} /> Database Link
                </span>
                <span className={`font-mono text-[9px] font-black px-2.5 py-0.5 rounded-lg ${
                  isSupabaseConfigured 
                    ? "bg-emerald-50 text-emerald-800" 
                    : "bg-orange-50 text-orange-850"
                }`}>
                  {isSupabaseConfigured ? "Connected" : "Sandbox Mode"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick tab controller shortcuts */}
          <div className="bg-white border border-neutral-200/60 rounded-3xl p-4 space-y-1 shadow-2xs">
            <div className="px-3 pb-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                Workspace Tabs
              </span>
            </div>
            
            <button
              onClick={() => { setSelectedCategory("All"); setActiveTab("all"); }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                selectedCategory !== "Starred" 
                  ? "bg-neutral-950 text-white shadow-md shadow-neutral-900/10" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span>Explore My Notes</span>
              <FolderOpen size={13} />
            </button>
            
            <button
              onClick={() => { setSelectedCategory("Starred"); setActiveTab("starred"); }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                selectedCategory === "Starred" 
                  ? "bg-neutral-950 text-white shadow-md shadow-neutral-900/10" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span>Favorite Stars</span>
              <Star size={13} />
            </button>
          </div>

          {/* Tips block */}
          <div className="p-5 bg-gradient-to-tr from-indigo-50 via-blue-50/50 to-purple-50/50 border border-indigo-100 rounded-3xl text-xs text-indigo-950 shadow-3xs space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Sparkles size={14} className="text-indigo-600" />
              <span>Pro Tip: Colors!</span>
            </div>
            <p className="leading-relaxed text-indigo-900/80 font-sans">
              Create cards with custom linear gradients depending on project category. Try adding a new note by pressing the floating <strong className="text-indigo-950 font-bold">Add Note</strong> controller.
            </p>
          </div>

        </aside>

        {/* Dashboard Notes Grid - Dynamic main container */}
        <main className="col-span-1 lg:col-span-3 space-y-6">
          
          {/* Top Search bar Integration */}
          <div className="bg-white border border-neutral-200/60 rounded-[2rem] p-5 sm:p-6 shadow-xs">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={CATEGORIES}
            />
          </div>

          {/* Workstation Stat strips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-3xs flex items-center justify-between relative overflow-hidden">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">Total Notes</span>
                <h3 className="font-display font-black text-2xl text-neutral-900 mt-1">{notes.length}</h3>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-3xs flex items-center justify-between relative overflow-hidden">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">Starred</span>
                <h3 className="font-display font-black text-2xl text-amber-500 mt-1">
                  {notes.filter(n => n.isStarred).length}
                </h3>
              </div>
            </div>

            <div className="hidden sm:flex bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-3xs items-center justify-between relative overflow-hidden">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">Sync Status</span>
                <h3 className={`font-display font-black text-sm md:text-base mt-2 flex items-center gap-1.5 ${isSupabaseConfigured ? "text-emerald-600" : "text-orange-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? "bg-emerald-500 animate-ping" : "bg-orange-400 animate-pulse"}`} />
                  {isSupabaseConfigured ? "Supabase Live" : "Local Sandbox"}
                </h3>
              </div>
            </div>
          </div>

          {/* Floating plus on desktop */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="font-display font-black text-xl text-neutral-950 flex items-center gap-2">
              <span>Your Workstation Cards</span>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                {filteredNotes.length} shown
              </span>
            </h2>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-neutral-950 text-white font-bold rounded-2xl text-xs hover:bg-neutral-850 shadow-md shadow-neutral-900/10 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Create Note</span>
            </button>
          </div>

          {/* Notes Grid Display */}
          {notesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="notes-skeleton-grid">
              {[1, 2, 3].map((num) => (
                <div key={num} className="relative overflow-hidden rounded-3xl p-6 bg-white border border-neutral-200/50 shadow-xs flex flex-col justify-between min-h-[190px] animate-pulse">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="h-6 bg-neutral-200 rounded-lg w-3/4" />
                      <div className="w-9 h-9 bg-neutral-100 rounded-2xl shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="h-4 bg-neutral-100 rounded-full w-14" />
                      <div className="h-3 bg-neutral-200 rounded-lg w-20" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-neutral-100 rounded-lg w-full" />
                    <div className="h-3 bg-neutral-100 rounded-lg w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-white border border-neutral-200/50 rounded-[2rem] p-12 text-center shadow-xs" id="notes-empty-state">
              <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                <Search size={24} className="text-neutral-450" />
              </div>
              <h3 className="font-display font-extrabold text-base text-neutral-900">No active notes found</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto font-sans">
                Try clearing search terms, selecting "All" categories, or crafting a new workspace note from scratch right now.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white font-bold rounded-2xl text-xs hover:bg-neutral-850 shadow-md shadow-neutral-900/10 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Plus size={14} className="stroke-[2.5]" />
                  <span>Create Your First Note</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="notes-grid">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id}
                  note={note}
                  onToggleStar={handleToggleStar}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Floating Bottom Navigator for Mobile View */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "settings") {
            alert("This secure prototype resides wholly in localized Sandbox mode. Database settings are accessible inside the Desktop tab view.");
          }
        }}
        centerButton={
          <AddButton onClick={() => setIsCreateOpen(true)} label="Add Workspace Note" />
        }
      />

      {/* MODAL 1: Create New Note */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-neutral-250 p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Corner blur decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -z-10 bg-indigo-100`} />

            <h2 className="font-display font-black text-xl text-neutral-950 mb-1">Create New Note</h2>
            <p className="text-xs text-neutral-500 mb-6 font-sans">
              Enter details below to create an instantly responsive note card.
            </p>

            <form onSubmit={handleCreateNoteSubmit} className="space-y-4">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Strategy Decisions"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* Grid 2 Columns: Category & Gradients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 px-3.5 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Work">💼 Work</option>
                    <option value="Personal">🏡 Personal</option>
                    <option value="Ideas">⚡ Ideas</option>
                    <option value="Study">📚 Study</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Aesthetic Theme</label>
                  <div className="flex gap-1.5 items-center justify-between">
                    {GRADIENTS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setNewGradient(g.class)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${g.class} ${
                          newGradient === g.class ? "ring-2 ring-neutral-950 scale-110 border-white" : "border-transparent opacity-85 hover:opacity-100"
                        }`}
                        title={g.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Content Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Draft your detailed workstation summaries or personal workflow concepts..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200 rounded-xl py-3 px-4 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-neutral-400 resize-none leading-relaxed"
                />
              </div>

              {/* Actions Footer row */}
              <div className="flex gap-3 pt-4 border-t border-neutral-100 justify-end">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-850 shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-70"
                >
                  {actionLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Workspace Note</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View / Edit Note Details */}
      {selectedNote && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-neutral-250 p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
            
            {/* Header Gradient Accent */}
            <div className={`absolute top-0 left-0 right-0 h-2.5 ${selectedNote.gradientClass}`} />

            <div className="overflow-y-auto pr-1 space-y-5">
              
              {!isEditing ? (
                <>
                  {/* Read-Only mode */}
                  <div className="flex items-start justify-between gap-4 pt-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {selectedNote.category && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full">
                            {selectedNote.category}
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {selectedNote.date}
                        </span>
                      </div>
                      <h2 className="font-display font-black text-xl text-neutral-950 tracking-tight pt-1">
                        {selectedNote.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => handleToggleStar(selectedNote.id)}
                      className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/50 hover:bg-neutral-100 transition-all shrink-0 focus:outline-none"
                    >
                      <Star
                        size={16}
                        className={selectedNote.isStarred ? "fill-amber-400 text-amber-400" : "text-neutral-400"}
                      />
                    </button>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-neutral-700 font-sans leading-relaxed whitespace-pre-wrap bg-neutral-50 border border-neutral-100 rounded-2xl p-5">
                      {selectedNote.description}
                    </p>
                  </div>
                </>
              ) : (
                /* Edit Form mode */
                <form onSubmit={handleSaveChanges} className="space-y-4 pt-1" id="edit-form">
                  <h3 className="font-display font-black text-lg text-neutral-900 mb-4">Edit Workspace Note</h3>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Note Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl py-2.5 px-3.5 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-3.5 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Ideas">Ideas</option>
                        <option value="Study">Study</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Card Theme</label>
                      <div className="flex gap-1.5 items-center justify-between pt-1">
                        {GRADIENTS.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setEditGradient(g.class)}
                            className={`w-6 h-6 rounded-full border transition-all ${g.class} ${
                              editGradient === g.class ? "ring-2 ring-neutral-950 scale-110 border-white" : "border-transparent opacity-85 hover:opacity-100"
                            }`}
                            title={g.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Content Body</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Content description"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl py-2.5 px-3.5 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
                    />
                  </div>
                </form>
              )}

            </div>

            {/* Actions footer */}
            <div className="flex gap-3 pt-5 mt-5 border-t border-neutral-100 flex-wrap items-center justify-between">
              
              {!isEditing ? (
                <>
                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-650 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-all mr-auto cursor-pointer font-sans disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    <span>Delete Note</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedNote(null)}
                      disabled={actionLoading}
                      className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans disabled:opacity-50"
                    >
                      Close Card
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-850 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans disabled:opacity-50"
                    >
                      <Edit2 size={12} />
                      <span>Edit Note</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 ml-auto w-full justify-end">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleSaveChanges}
                    className="px-5 py-2.5 bg-neutral-950 text-white font-bold rounded-xl text-xs hover:bg-neutral-850 shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-75"
                  >
                    {actionLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Applying...</span>
                      </>
                    ) : (
                      <span>Apply Changes</span>
                    )}
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
