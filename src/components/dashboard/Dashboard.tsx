import { useState, FormEvent, useEffect, MouseEvent } from "react";
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
  Edit2,
  Archive,
  ArchiveRestore,
  Paperclip,
  Download,
  Loader2,
  X,
  Users,
  Share2,
  UserPlus
} from "lucide-react";
import NoteCard, { Note } from "./NoteCard";
import { useCollaboration, Collaborator } from "./useCollaboration";
import SearchBar from "./SearchBar";
import AddButton from "./AddButton";
import BottomNav, { NavTab } from "./BottomNav";
import RichTextEditor from "./RichTextEditor";
import AttachmentThumbnail, { Attachment } from "./AttachmentThumbnail";

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
    category: "Work",
    is_archived: false
  },
  {
    id: "n-2",
    title: "Inspiration: Brand Identity Redesign",
    description: "Aesthetic rules for our custom user workstation interfaces. Use premium typography like 'Space Grotesk' paired with 'JetBrains Mono', generous visual whitespace, and custom reactive elements.",
    date: "Yesterday, 3:15 PM",
    gradientClass: "bg-gradient-to-br from-orange-450 to-pink-600",
    isStarred: true,
    category: "Ideas",
    is_archived: false
  },
  {
    id: "n-3",
    title: "Weekly Trail Run & Fitness Routine",
    description: "Aim for a 5km outdoor cadence, monitor cardiac limits with offline health metrics, and compile performance statistics directly into local user workstation tables.",
    date: "Jun 07, 7:30 AM",
    gradientClass: "bg-gradient-to-br from-teal-400 to-emerald-600",
    isStarred: false,
    category: "Personal",
    is_archived: false
  },
  {
    id: "n-4",
    title: "Quantum Superposition & Eigenvalues",
    description: "Brief summary of lecture notes on linear operators in complex Hilbert spaces, matrix trace operations, and probability amplitudes for Schrodinger transition equations.",
    date: "Jun 05, 11:20 AM",
    gradientClass: "bg-gradient-to-br from-violet-500 to-purple-650",
    isStarred: false,
    category: "Study",
    is_archived: false
  },
  {
    id: "n-5",
    title: "Client-Side Database Replication",
    description: "Design local sync checkpoints, implement background network retry hooks, and configure safe conflict resolution using timestamps to protect high-density task records.",
    date: "Jun 03, 4:55 PM",
    gradientClass: "bg-gradient-to-br from-emerald-500 to-teal-650",
    isStarred: false,
    category: "Ideas",
    is_archived: false
  },
  {
    id: "n-6",
    title: "Sourdough Starter & Rosemary Bread",
    description: "Ratios for hydration at 74% using premium organic rye flour, natural ambient wild yeast cultivation steps, baking temperature limits, and custom cast-iron dutch oven scoring guidelines.",
    date: "May 28, 8:15 PM",
    gradientClass: "bg-gradient-to-br from-rose-400 to-red-600",
    isStarred: false,
    category: "Personal",
    is_archived: false
  }
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const supabase = getSupabaseClient();
  
  // Notes Modals triggers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Collaborative Presence & Cursors Logic
  const { collaborators, sendCursorPosition } = useCollaboration(selectedNote?.id, user);

  // Interactive Notes Storage loaded from Supabase or local simulation
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Client search and filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Custom navigation state (for responsive sync)
  const [activeTab, setActiveTab] = useState<NavTab>("all");

  // Collaborative Note-Sharing states
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState<"editor" | "owner">("editor");
  const [activeShares, setActiveShares] = useState<any[]>([]);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareActionLoading, setShareActionLoading] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  // Attachment state variables
  const [newAttachmentsList, setNewAttachmentsList] = useState<{ file: File; id: string; name: string; size: number }[]>([]);
  const [individualFileUploading, setIndividualFileUploading] = useState<string | null>(null);
  const [attachmentActionLoading, setAttachmentActionLoading] = useState<string | null>(null);
  
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
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");

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
      category,
      is_archived: !!dbNote.is_archived,
      deleted_at: dbNote.deleted_at || null,
      attachments: dbNote.attachments || []
    };
  };

  // Robust data fetching async handler
  const loadNotes = async () => {
    if (!user) return;
    setNotesLoading(true);
    setErrorMsg("");
    try {
      if (isSupabaseConfigured && supabase) {
        // 1. Fetch user's owned notes
        const { data: notesData, error: notesError } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (notesError) {
          throw new Error(notesError.message || "Request rejected by Supabase API Gateway.");
        }

        let ownedNotes: Note[] = [];
        if (notesData) {
          ownedNotes = notesData.map(mapSupabaseToNote).map(n => ({
            ...n,
            is_shared: false,
            shared_permission: 'owner' as const,
            owner_id: user.id,
            owner_email: user.email || ""
          }));
        }

        // 2. Fetch notes shared with the current user as collaborator
        let sharedNotes: Note[] = [];
        try {
          const { data: sharesData, error: sharesError } = await supabase
            .from("note_shares")
            .select("note_id, permission, owner_id")
            .eq("collaborator_id", user.id);

          if (!sharesError && sharesData && sharesData.length > 0) {
            const sharedIds = sharesData.map((s: any) => s.note_id);
            const { data: sharedNotesData, error: sharedNotesError } = await supabase
              .from("notes")
              .select("*")
              .in("id", sharedIds);

            if (!sharedNotesError && sharedNotesData) {
              const sharesByNoteId = sharesData.reduce((acc: any, curr: any) => {
                acc[curr.note_id] = curr;
                return acc;
              }, {});

              sharedNotes = sharedNotesData.map((dbNote: any) => {
                const note = mapSupabaseToNote(dbNote);
                const shareInfo = sharesByNoteId[dbNote.id];
                return {
                  ...note,
                  is_shared: true,
                  shared_permission: shareInfo?.permission || 'editor',
                  owner_id: shareInfo?.owner_id || dbNote.user_id,
                  owner_email: "Shared Collaborator"
                };
              });
            }
          }
        } catch (shareErr) {
          console.warn("Could not load shared notes dynamically:", shareErr);
        }

        let allNotes = [...ownedNotes, ...sharedNotes];

        // 3. Defensively load attachments for both owned and shared active notes
        try {
          const activeNoteIds = allNotes.map(n => n.id);
          if (activeNoteIds.length > 0) {
            const { data: attachmentsData, error: attachmentsError } = await supabase
              .from("attachments")
              .select("*")
              .in("note_id", activeNoteIds);

            if (!attachmentsError && attachmentsData) {
              const attachmentsByNote: Record<string, Attachment[]> = {};
              attachmentsData.forEach((att: any) => {
                if (!attachmentsByNote[att.note_id]) {
                  attachmentsByNote[att.note_id] = [];
                }
                attachmentsByNote[att.note_id].push(att);
              });

              allNotes = allNotes.map(n => ({
                ...n,
                attachments: attachmentsByNote[n.id] || []
              }));
            }
          }
        } catch (attErr) {
          console.warn("Could not load matching attachments from database:", attErr);
        }

        setNotes(allNotes);
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
      console.warn("Supabase rest/fetch connection issue, falling back to local simulation:", err);
      setErrorMsg(`Cloud Sync issue: ${err?.message || "TypeError: Failed to fetch"}.`);
      
      // Fallback silently to LocalStorage so the system functions gracefully
      const saved = localStorage.getItem(`my_notes_interactive_list_${user.id}`);
      if (saved) {
        try {
          setNotes(JSON.parse(saved));
        } catch (e) {
          const seeded = INITIAL_NOTES.map((n, i) => ({
            ...n,
            id: `sand-note-${Date.now()}-${i}`
          }));
          setNotes(seeded);
        }
      } else {
        const seeded = INITIAL_NOTES.map((n, i) => ({
          ...n,
          id: `sand-note-${Date.now()}-${i}`
        }));
        setNotes(seeded);
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(seeded));
      }
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

  // Load existing shares of selectedNote
  const loadSharesForNote = async (noteId: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.rpc("get_note_shares_with_emails", {
          note_id_param: noteId
        });
        if (error) {
          // If RPC is missing initially, fallback to general select
          const { data: rawShares, error: selectErr } = await supabase
            .from("note_shares")
            .select("*")
            .eq("note_id", noteId);
          if (selectErr) throw selectErr;
          
          setActiveShares((rawShares || []).map((s: any) => ({
            share_id: s.id,
            collaborator_id: s.collaborator_id,
            collaborator_email: "Authorized Collaborator",
            permission: s.permission,
            created_at: s.created_at
          })));
        } else {
          setActiveShares(data || []);
        }
      } else {
        // Localstorage mockup
        const raw = localStorage.getItem(`note_shares_mock_${noteId}`);
        setActiveShares(raw ? JSON.parse(raw) : []);
      }
    } catch (e) {
      console.warn("Could not load note shares:", e);
    }
  };

  // Trigger loading shares when notes details display
  useEffect(() => {
    if (selectedNote) {
      loadSharesForNote(selectedNote.id);
    } else {
      setActiveShares([]);
      setShareError(null);
      setShareEmail("");
    }
  }, [selectedNote]);

  const handleInviteCollaborator = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedNote || !shareEmail.trim()) return;
    setShareLoading(true);
    setShareError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.rpc("share_note_by_email", {
          note_id_param: selectedNote.id,
          email_param: shareEmail.trim().toLowerCase(),
          permission_param: sharePermission
        });
        if (error) {
          throw new Error(error.message || "Failed to add collaborator. Verify their email address.");
        }
      } else {
        // Sandbox mockup
        const emailLower = shareEmail.trim().toLowerCase();
        
        const raw = localStorage.getItem(`note_shares_mock_${selectedNote.id}`);
        const currentShares = raw ? JSON.parse(raw) : [];
        
        if (currentShares.some((s: any) => s.collaborator_email === emailLower)) {
          throw new Error("This note is already shared with that email address.");
        }

        const newShare = {
          share_id: `mock-share-${Date.now()}`,
          collaborator_id: `mock-user-${Date.now()}`,
          collaborator_email: emailLower,
          permission: sharePermission,
          created_at: new Date().toISOString()
        };

        const updated = [...currentShares, newShare];
        localStorage.setItem(`note_shares_mock_${selectedNote.id}`, JSON.stringify(updated));
      }

      setShareEmail("");
      setSuccessMsg("Invitation sent successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      
      // Reload shares list
      await loadSharesForNote(selectedNote.id);
    } catch (err: any) {
      console.warn("Sharing failed:", err);
      setShareError(err?.message || "An unexpected error occurred during invite.");
    } finally {
      setShareLoading(false);
    }
  };

  const handleRemoveCollaboratorShare = async (shareId: string) => {
    if (!selectedNote) return;
    if (!window.confirm("Are you sure you want to revoke access for this collaborator?")) return;

    setShareActionLoading(shareId);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("note_shares")
          .delete()
          .eq("id", shareId);
        if (error) throw error;
      } else {
        // Sandbox mockup
        const raw = localStorage.getItem(`note_shares_mock_${selectedNote.id}`);
        const shares = raw ? JSON.parse(raw) : [];
        const filtered = shares.filter((s: any) => s.share_id !== shareId);
        localStorage.setItem(`note_shares_mock_${selectedNote.id}`, JSON.stringify(filtered));
      }
      setSuccessMsg("Collaborator access revoked.");
      setTimeout(() => setSuccessMsg(""), 3000);
      await loadSharesForNote(selectedNote.id);
    } catch (err: any) {
      console.warn("Could not remove share:", err);
      alert("Failed to revoke collaborator access.");
    } finally {
      setShareActionLoading(null);
    }
  };

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
      window.location.hash = ""; // Direct back to landing page
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    sendCursorPosition(x, y);
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
        const query = supabase
          .from("notes")
          .update({
            favorite: nextStarred
          })
          .eq("id", id);

        if (!targetNote.is_shared) {
          query.eq("user_id", user.id);
        }

        const { error } = await query;

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
      console.warn("Failed to toggle favorite on Cloud, syncing locally instead:", err);
      // Fallback: update local storage so changes are registered securely offline
      const updatedNotes = notes.map(note => 
        note.id === id ? { ...note, isStarred: nextStarred } : note
      );
      localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
    }
  };

  const handleToggleArchive = async (id: string) => {
    if (!user) return;

    const targetNote = notes.find(n => n.id === id);
    if (!targetNote) return;

    const originalArchived = !!targetNote.is_archived;
    const nextArchived = !originalArchived;

    // Optimistically update front-end list
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, is_archived: nextArchived } : note
    ));

    // If the note viewer modal is looking at this note, sync or dismiss
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(prev => prev ? { ...prev, is_archived: nextArchived } : null);
    }

    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      if (isSupabaseConfigured && supabase) {
        const query = supabase
          .from("notes")
          .update({
            is_archived: nextArchived
          })
          .eq("id", id);

        if (!targetNote.is_shared) {
          query.eq("user_id", user.id);
        }

        const { error } = await query;

        if (error) throw new Error(error.message);
      } else {
        // Local state updates
        const updatedNotes = notes.map(note =>
          note.id === id ? { ...note, is_archived: nextArchived } : note
        );
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }

      setSuccessMsg(
        nextArchived 
          ? "Note successfully archived and hidden from your main workstation." 
          : "Note successfully unarchived and restored to active workspace."
      );
      
      // Auto-dismiss the success toast
      setTimeout(() => {
        setSuccessMsg("");
      }, 5000);

    } catch (err: any) {
      console.warn("Failed to toggle archive on Cloud, syncing locally instead:", err);
      // Fallback: sync to LocalStorage
      const updatedNotes = notes.map(note =>
        note.id === id ? { ...note, is_archived: nextArchived } : note
      );
      localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      setSuccessMsg(
        nextArchived
          ? "Note archived locally (offline fallback)."
          : "Note restored locally (offline fallback)."
      );
      setTimeout(() => {
        setSuccessMsg("");
      }, 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSilentDescriptionUpdate = async (id: string, updatedHtml: string) => {
    if (!user) return;

    // Update frontend state immediately/optimistically
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, description: updatedHtml } : note
    ));
    setSelectedNote(prev => prev && prev.id === id ? { ...prev, description: updatedHtml } : prev);

    try {
      if (isSupabaseConfigured && supabase) {
        // Fetch current note first to avoid wiping other content fields
        const { data: existing, error: fetchErr } = await supabase
          .from("notes")
          .select("content")
          .eq("id", id)
          .single();

        if (fetchErr) throw fetchErr;

        let parsedContent = { description: "", category: "Work", gradientClass: "" };
        try {
          if (existing?.content) {
            const parsed = JSON.parse(existing.content);
            if (parsed && typeof parsed === "object") {
              parsedContent = { ...parsedContent, ...parsed };
            }
          }
        } catch (e) {
          // fallback fallback
        }

        parsedContent.description = updatedHtml;

        const targetNote = notes.find(n => n.id === id);
        const query = supabase
          .from("notes")
          .update({
            content: JSON.stringify(parsedContent)
          })
          .eq("id", id);

        if (targetNote && !targetNote.is_shared) {
          query.eq("user_id", user.id);
        }

        const { error } = await query;

        if (error) throw error;
      } else {
        // Localstorage sync fallback
        const updatedNotes = notes.map(note =>
          note.id === id ? { ...note, description: updatedHtml } : note
        );
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }
    } catch (e) {
      console.error("Silent description update failed:", e);
    }
  };

  // Autosave of Note changes after stopping typing for 2 seconds
  useEffect(() => {
    if (!isEditing || !selectedNote || !user) {
      setAutosaveStatus("idle");
      return;
    }

    const titleClean = editTitle.trim();
    const descClean = editDesc.trim();

    // Check if there is any actual difference with what is currently stored in the note model
    const isDifferent = 
      titleClean !== (selectedNote.title || "").trim() ||
      descClean !== (selectedNote.description || "").trim() ||
      editCategory !== (selectedNote.category || "Work") ||
      editGradient !== (selectedNote.gradientClass || "");

    if (!isDifferent) {
      return;
    }

    // Set status to "saving" immediately when a change is detected
    setAutosaveStatus("saving");

    const timer = setTimeout(async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const query = supabase
            .from("notes")
            .update({
              title: titleClean,
              content: JSON.stringify({
                description: descClean,
                category: editCategory,
                gradientClass: editGradient
              })
            })
            .eq("id", selectedNote.id);

          if (!selectedNote.is_shared) {
            query.eq("user_id", user.id);
          }

          const { error } = await query;

          if (error) throw error;
        }

        // Quietly update the notes list state in-place to stay synchronized
        setNotes(prevNotes => {
          const updated = prevNotes.map(n => 
            n.id === selectedNote.id 
              ? { 
                  ...n, 
                  title: titleClean, 
                  description: descClean, 
                  category: editCategory, 
                  gradientClass: editGradient 
                }
              : n
          );
          localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updated));
          return updated;
        });

        // Update selectedNote so its display fields match the auto-saved edits
        setSelectedNote(prev => {
          if (prev && prev.id === selectedNote.id) {
            return {
              ...prev,
              title: titleClean,
              description: descClean,
              category: editCategory,
              gradientClass: editGradient
            };
          }
          return prev;
        });

        setAutosaveStatus("saved");
      } catch (err: any) {
        console.warn("Autosave cloud sync issue, saving locally:", err);
        
        setNotes(prevNotes => {
          const updated = prevNotes.map(n => 
            n.id === selectedNote.id 
              ? { 
                  ...n, 
                  title: titleClean, 
                  description: descClean, 
                  category: editCategory, 
                  gradientClass: editGradient 
                }
              : n
          );
          localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updated));
          return updated;
        });

        setSelectedNote(prev => {
          if (prev && prev.id === selectedNote.id) {
            return {
              ...prev,
              title: titleClean,
              description: descClean,
              category: editCategory,
              gradientClass: editGradient
            };
          }
          return prev;
        });

        setAutosaveStatus("saved");
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [editTitle, editDesc, editCategory, editGradient, isEditing, selectedNote?.id, user]);

  // Helper to read file to base64 for offline scenario persistence
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadFileToSupabase = async (noteId: string, file: File) => {
    if (!user || !supabase) return null;
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `uploads/${user.id}/${noteId}/${Date.now()}_${sanitizedName}`;
      
      const { error: uploadErr } = await supabase.storage
        .from("note-attachments")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadErr) throw uploadErr;

      const { data: attData, error: dbErr } = await supabase
        .from("attachments")
        .insert({
          note_id: noteId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type || "application/octet-stream",
          file_size: file.size
        })
        .select()
        .single();

      if (dbErr) throw dbErr;
      return attData as Attachment;
    } catch (err) {
      console.error("Failed to upload file to Supabase storage:", err);
      throw err;
    }
  };

  const handleDownloadAttachment = async (att: Attachment) => {
    try {
      setAttachmentActionLoading(att.id);
      if (att.url) {
        const link = document.createElement("a");
        link.href = att.url;
        link.download = att.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.storage
          .from("note-attachments")
          .createSignedUrl(att.file_path, 60);

        if (error) throw error;
        if (data?.signedUrl) {
          const res = await fetch(data.signedUrl);
          const blob = await res.blob();
          const destUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = destUrl;
          link.download = att.file_name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(destUrl);
        }
      }
    } catch (err: any) {
      console.error("Could not download attachment:", err);
      alert("Encountered connection errors during secure download fetch. Trying indirect tab load...");
      if (isSupabaseConfigured && supabase && !att.url) {
        supabase.storage
          .from("note-attachments")
          .createSignedUrl(att.file_path, 60)
          .then(({ data }) => {
            if (data?.signedUrl) window.open(data.signedUrl, "_blank");
          });
      }
    } finally {
      setAttachmentActionLoading(null);
    }
  };

  const handleDeleteAttachment = async (att: Attachment) => {
    if (!confirm(`Are you sure you want to irreversibly delete "${att.file_name}"?`)) return;
    try {
      setAttachmentActionLoading(att.id);

      if (isSupabaseConfigured && supabase && !att.id.startsWith("sand-")) {
        const { error: storageRemoveErr } = await supabase.storage
          .from("note-attachments")
          .remove([att.file_path]);
        if (storageRemoveErr) console.warn("Notice: file might already be removed from storage bucket.");

        const { error: dbDeleteErr } = await supabase
          .from("attachments")
          .delete()
          .eq("id", att.id);
        if (dbDeleteErr) throw dbDeleteErr;
      }

      setNotes(prev => prev.map(note => {
        if (note.id === att.note_id) {
          return {
            ...note,
            attachments: (note.attachments || []).filter(item => item.id !== att.id)
          };
        }
        return note;
      }));

      if (selectedNote && selectedNote.id === att.note_id) {
        setSelectedNote(prev => prev ? {
          ...prev,
          attachments: (prev.attachments || []).filter(item => item.id !== att.id)
        } : null);
      }

      if (!isSupabaseConfigured || !supabase) {
        const updatedNotes = notes.map(note => {
          if (note.id === att.note_id) {
            return {
              ...note,
              attachments: (note.attachments || []).filter(item => item.id !== att.id)
            };
          }
          return note;
        });
        localStorage.setItem(`my_notes_interactive_list_${user?.id}`, JSON.stringify(updatedNotes));
      }

      setSuccessMsg("Attachment removed successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Could not delete attachment:", err);
      alert("Attachment deletion failed. Please ensure database connection is intact.");
    } finally {
      setAttachmentActionLoading(null);
    }
  };

  const handleAttachFileEditModal = async (e: any) => {
    if (!selectedNote || !e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    
    // Validate size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File exceeds maximum size limit of 10 MB.");
      return;
    }

    setIndividualFileUploading(file.name);
    try {
      if (isSupabaseConfigured && supabase) {
        const uploadedRecord = await uploadFileToSupabase(selectedNote.id, file);
        if (uploadedRecord) {
          setNotes(prev => prev.map(note => {
            if (note.id === selectedNote.id) {
              return {
                ...note,
                attachments: [...(note.attachments || []), uploadedRecord]
              };
            }
            return note;
          }));
          setSelectedNote(prev => prev ? {
            ...prev,
            attachments: [...(prev.attachments || []), uploadedRecord]
          } : null);
        }
      } else {
        // sandbox memory file attaching
        const base64Str = await readFileAsDataURL(file);
        const mockedRecord: Attachment = {
          id: `sand-att-${Date.now()}`,
          note_id: selectedNote.id,
          user_id: user.id,
          file_name: file.name,
          file_path: `local/${file.name}`,
          file_type: file.type || "application/octet-stream",
          file_size: file.size,
          created_at: new Date().toISOString(),
          url: base64Str
        };

        const updatedNotes = notes.map(note => {
          if (note.id === selectedNote.id) {
            return {
              ...note,
              attachments: [...(note.attachments || []), mockedRecord]
            };
          }
          return note;
        });

        setNotes(updatedNotes);
        setSelectedNote(prev => prev ? {
          ...prev,
          attachments: [...(prev.attachments || []), mockedRecord]
        } : null);

        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }
      setSuccessMsg(`File "${file.name}" attached successfully.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Could not attach file:", err);
      alert(`Failed to attach file: ${err.message || err}`);
    } finally {
      setIndividualFileUploading(null);
    }
  };

  const handleRemovePendingAttachment = (tempId: string) => {
    setNewAttachmentsList(prev => prev.filter(f => f.id !== tempId));
  };

  const handleCreateNoteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !user) return;

    setActionLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Use select().single() to receive the generated row (including id)
        const { data: insertedData, error } = await supabase
          .from("notes")
          .insert({
            user_id: user.id,
            title: newTitle.trim(),
            content: JSON.stringify({
              description: newDesc.trim(),
              category: newCategory,
              gradientClass: newGradient
            }),
            favorite: false,
            is_archived: false
          })
          .select()
          .single();

        if (error) throw new Error(error.message);

        // If files are attached, upload them iteratively
        if (insertedData?.id && newAttachmentsList.length > 0) {
          for (const item of newAttachmentsList) {
            try {
              await uploadFileToSupabase(insertedData.id, item.file);
            } catch (uErr) {
              console.error(`Pending attachment upload failed for file "${item.name}":`, uErr);
            }
          }
        }

        await loadNotes();
      } else {
        const formattedTime = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });

        const noteId = `sand-note-${Date.now()}`;
        const sandAttachments: Attachment[] = [];

        if (newAttachmentsList.length > 0) {
          for (let i = 0; i < newAttachmentsList.length; i++) {
            const item = newAttachmentsList[i];
            const base64Url = await readFileAsDataURL(item.file);
            sandAttachments.push({
              id: `sand-att-${Date.now()}-${i}`,
              note_id: noteId,
              user_id: user.id,
              file_name: item.name,
              file_path: `local/${item.name}`,
              file_type: item.file.type || "application/octet-stream",
              file_size: item.size,
              created_at: new Date().toISOString(),
              url: base64Url
            });
          }
        }

        const newNote: Note = {
          id: noteId,
          title: newTitle.trim(),
          description: newDesc.trim(),
          date: formattedTime,
          gradientClass: newGradient,
          isStarred: false,
          category: newCategory,
          is_archived: false,
          attachments: sandAttachments
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
      setNewAttachmentsList([]);
    } catch (err: any) {
      console.warn("Failed to sync note creation to cloud, creating local note instead:", err);
      
      const formattedTime = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      const noteId = `sand-note-${Date.now()}`;
      const sandAttachments: Attachment[] = [];

      if (newAttachmentsList.length > 0) {
        for (let i = 0; i < newAttachmentsList.length; i++) {
          const item = newAttachmentsList[i];
          try {
            const base64Url = await readFileAsDataURL(item.file);
            sandAttachments.push({
              id: `sand-att-${Date.now()}-${i}`,
              note_id: noteId,
              user_id: user.id,
              file_name: item.name,
              file_path: `local/${item.name}`,
              file_type: item.file.type || "application/octet-stream",
              file_size: item.size,
              created_at: new Date().toISOString(),
              url: base64Url
            });
          } catch (e) {}
        }
      }

      const newNote: Note = {
        id: noteId,
        title: newTitle.trim(),
        description: newDesc.trim(),
        date: formattedTime,
        gradientClass: newGradient,
        isStarred: false,
        category: newCategory,
        is_archived: false,
        attachments: sandAttachments
      };

      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      setIsCreateOpen(false);
      setNewTitle("");
      setNewDesc("");
      setNewCategory("Work");
      setNewGradient("bg-gradient-to-br from-blue-600 to-indigo-700");
      setNewAttachmentsList([]);
      setErrorMsg(`Note saved locally (offline storage fallback).`);
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
        const query = supabase
          .from("notes")
          .update({
            title: editTitle.trim(),
            content: JSON.stringify({
              description: editDesc.trim(),
              category: editCategory,
              gradientClass: editGradient
            })
          })
          .eq("id", selectedNote.id);

        if (!selectedNote.is_shared) {
          query.eq("user_id", user.id);
        }

        const { error } = await query;

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
      console.warn("Failed to sync note edit to cloud, saving local edit instead:", err);
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
      setIsEditing(false);
      setSelectedNote(null);
      setErrorMsg(`Changes saved locally (offline storage fallback).`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!user) return;

    const currentIsoString = new Date().toISOString();

    // Optimistically remove from main dashboard view by setting deleted_at
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, deleted_at: currentIsoString } : note
    ));

    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
    setIsEditing(false);

    setActionLoading(true);
    setSuccessMsg("Note moved to Trash successfully.");
    setTimeout(() => setSuccessMsg(""), 4000);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("notes")
          .update({
            deleted_at: currentIsoString
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw new Error(error.message);
      } else {
        // Local state updates
        const updatedNotes = notes.map(note =>
          note.id === id ? { ...note, deleted_at: currentIsoString } : note
        );
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }
    } catch (err: any) {
      console.warn("Failed to soft-delete note on Cloud, performing local update:", err);
      const updatedNotes = notes.map(note =>
        note.id === id ? { ...note, deleted_at: currentIsoString } : note
      );
      localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreNote = async (id: string) => {
    if (!user) return;

    // Optimistically update frontend state back to active notes list
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, deleted_at: null } : note
    ));

    setActionLoading(true);
    setSuccessMsg("Note restored back to active workspace.");
    setTimeout(() => setSuccessMsg(""), 4000);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("notes")
          .update({
            deleted_at: null
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw new Error(error.message);
      } else {
        const updatedNotes = notes.map(note =>
          note.id === id ? { ...note, deleted_at: null } : note
        );
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }
    } catch (err: any) {
      console.warn("Failed to restore note on Cloud, performing local update:", err);
      const updatedNotes = notes.map(note =>
        note.id === id ? { ...note, deleted_at: null } : note
      );
      localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this note? This action is irreversible.")) return;
    if (!user) return;

    // Optimistically delete from notes array
    setNotes(prev => prev.filter(note => note.id !== id));

    setActionLoading(true);
    setSuccessMsg("Note permanently deleted.");
    setTimeout(() => setSuccessMsg(""), 4000);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("notes")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw new Error(error.message);
      } else {
        const updatedNotes = notes.filter(note => note.id !== id);
        localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
      }
    } catch (err: any) {
      console.warn("Failed to delete note from Cloud, removing locally:", err);
      const updatedNotes = notes.filter(note => note.id !== id);
      localStorage.setItem(`my_notes_interactive_list_${user.id}`, JSON.stringify(updatedNotes));
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
    // If the active tab is trash, only display soft-deleted notes
    if (activeTab === "trash") {
      const isDeleted = !!note.deleted_at;
      if (!isDeleted) return false;

      const textFields = `${note.title} ${note.description} ${note.category || ""}`.toLowerCase();
      return textFields.includes(searchQuery.toLowerCase());
    }

    // For other tabs, completely exclude soft-deleted notes
    if (note.deleted_at) {
      return false;
    }

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

    // 3. Archive toggle filters:
    // Display archived notes only if activeTab is "archive". Otherwise, only display active notes.
    const isNoteArchived = !!note.is_archived;
    const matchesArchive = (activeTab === "archive") ? isNoteArchived : !isNoteArchived;

    // 4. Sync sidebar tab filters for Mobile fallback views
    let matchesTab = true;
    if (activeTab === "starred") {
      matchesTab = note.isStarred;
    } else if (activeTab === "shared") {
      matchesTab = !!note.is_shared;
    }

    return matchesSearch && matchesCategory && matchesTab && matchesArchive;
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
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "all" 
                  ? "bg-neutral-950 text-white shadow-md shadow-neutral-900/10" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span>Explore My Notes</span>
              <FolderOpen size={13} />
            </button>
            
            <button
              onClick={() => { setSelectedCategory("Starred"); setActiveTab("starred"); }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "starred" 
                  ? "bg-neutral-950 text-white shadow-md shadow-neutral-900/10" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span>Favorite Stars</span>
              <Star size={13} />
            </button>

            <button
              onClick={() => { setSelectedCategory("All"); setActiveTab("shared"); }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "shared" 
                  ? "bg-neutral-950 text-white shadow-md shadow-neutral-900/10" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Shared with Me</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-black ${
                  activeTab === "shared" 
                    ? "bg-white/20 text-white" 
                    : "bg-neutral-100 text-neutral-500"
                }`}>
                  {notes.filter(n => n.is_shared && !n.deleted_at).length}
                </span>
              </div>
              <Users size={13} />
            </button>

             <button
              onClick={() => { setSelectedCategory("All"); setActiveTab("archive"); }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "archive" 
                  ? "bg-neutral-950 text-white shadow-md shadow-neutral-900/10" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Archived Notes</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-black ${
                  activeTab === "archive" 
                    ? "bg-white/20 text-white" 
                    : "bg-neutral-100 text-neutral-500"
                }`}>
                  {notes.filter(n => n.is_archived && !n.deleted_at).length}
                </span>
              </div>
              <Archive size={13} />
            </button>

            <button
              onClick={() => { setSelectedCategory("All"); setActiveTab("trash"); }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "trash" 
                  ? "bg-neutral-950 text-white shadow-md shadow-neutral-900/10" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Trash Bin</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-black ${
                  activeTab === "trash" 
                    ? "bg-white/20 text-white" 
                    : "bg-neutral-100 text-neutral-550"
                }`}>
                  {notes.filter(n => n.deleted_at).length}
                </span>
              </div>
              <Trash2 size={13} />
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
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">Total Active</span>
                <h3 className="font-display font-black text-2xl text-neutral-900 mt-1">{notes.filter(n => !n.is_archived).length}</h3>
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

          {successMsg && (
            <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-3xl p-5 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs animate-in slide-in-from-top-4 duration-300" id="success-notification-banner">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-650 text-white font-bold text-xs shrink-0 select-none">✓</span>
                <p className="font-sans font-medium text-emerald-900 leading-relaxed">{successMsg}</p>
              </div>
              <button 
                type="button"
                onClick={() => setSuccessMsg("")}
                className="px-3 py-1.5 hover:bg-emerald-100/70 text-emerald-850 hover:text-emerald-950 rounded-xl transition-all font-bold text-[10px] cursor-pointer self-end sm:self-auto"
              >
                Dismiss
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 text-xs text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-3xs animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Workspace Database Connection Info</span>
                </div>
                <p className="text-amber-800/85 leading-relaxed font-sans">
                  {errorMsg} AuraNotes has safely stored your records in local storage as a fallback.
                </p>
              </div>
              <div className="shrink-0 flex gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    alert(`To connect multi-user collaboration & sharing, please execute the SQL statements inside the "supabase_migration.sql" file (located at the root directory of this workspace) inside your Supabase SQL Editor dashboard.\n\nThis script sets up the note_shares schemas, configures Row-Level Security permissions, and enables secure search procedures based on email addresses.`);
                  }}
                  className="px-3.5 py-1.5 bg-amber-900/10 hover:bg-amber-900/25 text-amber-900 border border-amber-950/10 rounded-xl font-bold transition-all text-[10px] cursor-pointer"
                >
                  View SQL Guide
                </button>
                <button 
                  type="button"
                  onClick={() => setErrorMsg("")}
                  className="px-2.5 py-1.5 hover:bg-amber-900/15 text-amber-800 rounded-xl transition-all font-bold text-[10px] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

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
            <div className="bg-white border border-neutral-200/50 rounded-[2rem] p-12 text-center shadow-xs animate-in fade-in duration-300" id="notes-empty-state">
              {activeTab === "trash" ? (
                <>
                  <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                    <Trash2 size={24} className="text-neutral-400" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-neutral-900">Your Trash is Clean</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
                    There are no deleted notes in your trash bin right now. When you delete a note, you'll find it here to restore or delete permanently.
                  </p>
                </>
              ) : activeTab === "archive" ? (
                <>
                  <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                    <Archive size={24} className="text-neutral-400" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-neutral-900">Your Archive is Empty</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
                    You haven’t archived any workspace cards yet. Archiving lets you declutter your primary workstation without losing precious note logs.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                    <Search size={24} className="text-neutral-450" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-neutral-900">No active notes found</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
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
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="notes-grid">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id}
                  note={note}
                  onToggleStar={handleToggleStar}
                  onToggleArchive={handleToggleArchive}
                  onDelete={handleDeleteNote}
                  onClick={handleCardClick}
                  onRestore={handleRestoreNote}
                  onPermanentDelete={handlePermanentDelete}
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
                <RichTextEditor
                  value={newDesc}
                  onChange={(val) => setNewDesc(val)}
                  placeholder="Draft your detailed workstation summaries or personal workflow concepts..."
                />
              </div>

              {/* File Attachments Section */}
              <div className="space-y-2 pt-1">
                <span className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">File Attachments</span>
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-150 border border-neutral-200 rounded-xl text-neutral-700 text-xs font-bold transition-all cursor-pointer select-none">
                    <Paperclip size={13} className="text-neutral-500" />
                    <span>Attach Files</span>
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files) {
                          const filesArr = Array.from(e.target.files);
                          const formatted = filesArr.map((file: any) => ({
                            file,
                            id: `temp-att-${Date.now()}-${Math.random()}`,
                            name: file.name,
                            size: file.size
                          }));
                          const overLimit = formatted.some(f => f.size > 10 * 1024 * 1024);
                          if (overLimit) {
                            alert("One or more files exceed the maximum 10 MB limit.");
                            return;
                          }
                          setNewAttachmentsList(prev => [...prev, ...formatted]);
                        }
                      }}
                    />
                  </label>
                  <span className="text-[9px] text-neutral-400 font-sans">Max size: 10MB (Images, PDFs, Docs, TXT)</span>
                </div>

                {newAttachmentsList.length > 0 && (
                  <div className="bg-neutral-50 rounded-2xl border border-neutral-150 p-3 space-y-2 max-h-[125px] overflow-y-auto animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {newAttachmentsList.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between gap-2 bg-white border border-neutral-200/80 p-2 rounded-xl text-[11px] hover:border-neutral-300 transition-all shadow-3xs"
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <Paperclip size={11} className="text-neutral-400 shrink-0" />
                            <span className="truncate flex-1 font-sans font-bold text-neutral-700 leading-tight" title={item.name}>{item.name}</span>
                            <span className="text-[8px] font-mono text-neutral-400 block tracking-normal shrink-0">{(item.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePendingAttachment(item.id)}
                            className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-red-500 transition-all cursor-pointer shrink-0"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
          <div 
            onMouseMove={handleMouseMove}
            className="bg-white w-full max-w-lg rounded-3xl border border-neutral-250 p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[90vh]"
          >
            
            {/* Header Gradient Accent */}
            <div className={`absolute top-0 left-0 right-0 h-2.5 ${selectedNote.gradientClass}`} />

            {/* Realtime Collaborate Presence Avatars Bar */}
            {collaborators.length > 0 && (
              <div className="pt-3 flex items-center justify-between border-b border-neutral-100 pb-2 mb-2 z-10 shrink-0 select-none" id="presence-observers-panel">
                <div className="flex items-center gap-1.5 text-left">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[10px] font-sans font-extrabold text-neutral-500 uppercase tracking-tight">
                    {collaborators.length} active observer{collaborators.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                  {collaborators.map((member) => {
                    const initials = (member.name || "U").split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
                    return (
                      <div
                        key={member.user_id}
                        style={{ borderColor: "#ffffff", backgroundColor: member.color }}
                        className="inline-block h-6 w-6 rounded-full border-2 text-[9px] font-extrabold text-white flex items-center justify-center transition-all cursor-pointer relative group shrink-0 shadow-sm"
                      >
                        <span>{initials}</span>
                        
                        {/* Custom visual hover user tag tooltip */}
                        <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover:block bg-neutral-950 text-white text-[9px] py-1 px-2 rounded-lg font-bold whitespace-nowrap shadow-lg z-50 pointer-events-none border border-neutral-800">
                          {member.name} {member.user_id === user?.id ? "(You)" : ""}
                          <span className="block text-[8px] font-mono text-neutral-400 font-normal">{member.email}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Share Button (only if not a shared note owned by someone else) */}
                      {!selectedNote.is_shared && (
                        <button
                          onClick={() => {
                            setIsShareOpen(true);
                          }}
                          className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/50 hover:bg-neutral-100 text-neutral-600 hover:text-blue-600 transition-all shrink-0 focus:outline-none cursor-pointer flex items-center justify-center"
                          title="Share Note with Collaborators"
                        >
                          <Share2 size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleStar(selectedNote.id)}
                        className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/50 hover:bg-neutral-100 transition-all shrink-0 focus:outline-none cursor-pointer"
                      >
                        <Star
                          size={16}
                          className={selectedNote.isStarred ? "fill-amber-400 text-amber-400" : "text-neutral-400"}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div 
                      className="rich-text-content text-xs bg-neutral-50 border border-neutral-100 rounded-2xl p-5 min-h-[140px] max-h-[350px] overflow-y-auto leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedNote.description || "" }}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target && target.tagName === "INPUT" && (target as HTMLInputElement).type === "checkbox") {
                          const checkbox = target as HTMLInputElement;
                          const nextChecked = checkbox.checked;
                          if (nextChecked) {
                            checkbox.setAttribute("checked", "true");
                          } else {
                            checkbox.removeAttribute("checked");
                          }
                          const container = e.currentTarget as HTMLDivElement;
                          handleSilentDescriptionUpdate(selectedNote.id, container.innerHTML);
                        }
                      }}
                    />
                  </div>

                  {/* Read-Only Attachments viewer details */}
                  {selectedNote.attachments && selectedNote.attachments.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-neutral-100 animate-in fade-in duration-300">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
                        File Attachments ({selectedNote.attachments.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedNote.attachments.map((att) => (
                          <div 
                            key={att.id}
                            className="flex items-center justify-between gap-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/85 p-2 rounded-xl transition-all shadow-3xs group"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <AttachmentThumbnail attachment={att} />
                              <div className="min-w-0 flex-1">
                                <p className="font-sans font-bold text-neutral-850 text-[11px] truncate leading-tight block text-left" title={att.file_name}>
                                  {att.file_name}
                                </p>
                                <p className="text-[9px] font-mono text-neutral-400 text-left font-semibold">
                                  {(att.file_size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDownloadAttachment(att)}
                              className="p-2 bg-white hover:bg-indigo-50 border border-neutral-200 hover:border-indigo-200 text-neutral-500 hover:text-indigo-600 rounded-xl transition-all cursor-pointer shadow-3xs shrink-0 flex items-center justify-center mr-0.5"
                              title="Download attachment"
                              disabled={attachmentActionLoading === att.id}
                            >
                              {attachmentActionLoading === att.id ? (
                                <Loader2 size={13} className="animate-spin text-indigo-500" />
                              ) : (
                                <Download size={13} />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Edit Form mode */
                <form onSubmit={handleSaveChanges} className="space-y-4 pt-1" id="edit-form">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="font-display font-black text-lg text-neutral-900">Edit Workspace Note</h3>
                    {autosaveStatus !== "idle" && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-250/20 text-[9px] font-mono font-black transition-all animate-in fade-in duration-300">
                        {autosaveStatus === "saving" ? (
                          <>
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                            </span>
                            <span className="text-amber-750 tracking-tight">Saving...</span>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 animate-pulse"></span>
                            <span className="text-emerald-700 tracking-tight">Saved</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
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
                    <RichTextEditor
                      value={editDesc}
                      onChange={(val) => setEditDesc(val)}
                      placeholder="Content description"
                    />
                  </div>

                  {/* Edit Form Attachments Container */}
                  <div className="space-y-2 pt-3 border-t border-neutral-150">
                    <div className="flex items-center justify-between ">
                      <span className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">File Attachments</span>
                      {individualFileUploading && (
                        <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold font-mono animate-pulse">
                          <Loader2 size={11} className="animate-spin" />
                          <span>Uploading {individualFileUploading}...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-150 border border-neutral-200 rounded-xl text-neutral-700 text-xs font-bold transition-all cursor-pointer select-none">
                        <Paperclip size={13} className="text-neutral-500" />
                        <span>Add Attachment</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleAttachFileEditModal}
                          disabled={individualFileUploading !== null}
                        />
                      </label>
                      <span className="text-[9px] text-neutral-400 font-sans">Max size: 10MB</span>
                    </div>

                    {selectedNote.attachments && selectedNote.attachments.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pt-1 animate-in fade-in duration-300">
                        {selectedNote.attachments.map((att) => (
                          <div 
                            key={att.id}
                            className="flex items-center justify-between gap-2 bg-neutral-50 border border-neutral-200/80 p-2 rounded-xl text-[11px] shadow-3xs"
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <AttachmentThumbnail attachment={att} mini={true} />
                              <span className="truncate flex-1 font-sans font-bold text-neutral-700 leading-tight block text-left" title={att.file_name}>{att.file_name}</span>
                              <span className="text-[8px] font-mono text-neutral-400 block tracking-normal shrink-0">{(att.file_size / 1024).toFixed(1)} KB</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteAttachment(att)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-500 transition-all cursor-pointer shrink-0"
                              disabled={attachmentActionLoading === att.id}
                              title="Delete attachment permanently"
                            >
                              {attachmentActionLoading === att.id ? (
                                <Loader2 size={12} className="animate-spin text-red-500" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-650 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-all mr-2 cursor-pointer font-sans disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    <span>Delete Note</span>
                  </button>

                  <button
                    onClick={async () => {
                      await handleToggleArchive(selectedNote.id);
                      setSelectedNote(null);
                    }}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-650 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all mr-auto cursor-pointer font-sans disabled:opacity-50"
                  >
                    {selectedNote.is_archived ? (
                      <>
                        <ArchiveRestore size={13} />
                        <span>Unarchive Note</span>
                      </>
                    ) : (
                      <>
                        <Archive size={13} />
                        <span>Archive Note</span>
                      </>
                    )}
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

            {/* Live Floating cursors */}
            {collaborators.map((member) => {
              if (member.user_id === user?.id || !member.cursor) return null;
              return (
                <div
                  key={`cursor-${member.user_id}`}
                  style={{
                    left: `${member.cursor.x}%`,
                    top: `${member.cursor.y}%`,
                    transform: "translate(-2px, -2px)",
                    pointerEvents: "none",
                  }}
                  className="absolute z-50 transition-all duration-150 ease-out flex flex-col items-start gap-1"
                >
                  <svg
                    width="14"
                    height="19"
                    viewBox="0 0 14 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 1.5V17.5L5.0 13.0H12.5L0.5 1.5Z"
                      fill={member.color}
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div
                    style={{ backgroundColor: member.color }}
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-md select-none whitespace-nowrap leading-tight backdrop-blur-[1px]"
                  >
                    {member.name}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* MODAL 3: Manage Collaborators & Sharing */}
      {isShareOpen && selectedNote && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl border border-neutral-250 p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[85vh]">
            {/* Header top edge color */}
            <div className={`absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600`} />
            
            <div className="space-y-5 flex-1 flex flex-col min-h-0">
              {/* Title Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-left">
                  <div className="p-2 bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl text-blue-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-neutral-950 tracking-tight leading-tight">
                      Share Note Settings
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                      Grant viewing & editing access to others
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsShareOpen(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer focus:outline-none"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Note Details summary */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150 text-left">
                <h4 className="text-xs font-bold text-neutral-800 font-sans truncate" title={selectedNote.title}>
                  {selectedNote.title}
                </h4>
                <p className="text-[10px] text-neutral-450 font-mono mt-0.5">
                  Category: {selectedNote.category || "General"}
                </p>
              </div>

              {/* Form to Invite */}
              <form onSubmit={handleInviteCollaborator} className="space-y-3 shrink-0">
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Collaborator Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="collaborator@example.com"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      className="flex-1 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl py-2.5 px-3.5 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 transition-all"
                    />
                    
                    <select
                      value={sharePermission}
                      onChange={(e: any) => setSharePermission(e.target.value)}
                      className="bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 px-3 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer shrink-0"
                    >
                      <option value="editor">Editor</option>
                      <option value="owner">Viewer</option>
                    </select>
                  </div>
                </div>

                {shareError && (
                  <div className="p-2.5 bg-red-50 text-red-650 rounded-xl text-[10px] font-sans font-semibold border border-red-100 text-left">
                    {shareError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={shareLoading || !shareEmail}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {shareLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Verifying user email...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} />
                      <span>Send Invitation</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="h-[1px] bg-neutral-200/60 shrink-0" />

              {/* List of collaborators */}
              <div className="flex-1 flex flex-col min-h-0 text-left">
                <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 shrink-0">
                  Active Access List ({activeShares.length})
                </span>
                
                <div className="overflow-y-auto flex-1 space-y-2 pr-1 max-h-[180px]">
                  {activeShares.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-neutral-400 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
                      <Users size={20} className="stroke-[1.5] text-neutral-350" />
                      <p className="text-[10px] font-sans mt-1.5 font-medium">No external users have access currently.</p>
                      <p className="text-[9px] text-neutral-400 mt-0.5">Use the search box above to add people.</p>
                    </div>
                  ) : (
                    activeShares.map((share) => (
                      <div 
                        key={share.share_id}
                        className="flex items-center justify-between gap-3 bg-neutral-50 border border-neutral-150 p-2.5 rounded-xl text-xs hover:bg-neutral-100 transition-all shrink-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-neutral-800 text-[11px] truncate leading-tight block" title={share.collaborator_email}>
                            {share.collaborator_email}
                          </p>
                          <p className="text-[9px] font-sans text-neutral-400 mt-0.5 font-medium">
                            Status: <span className="text-blue-600 capitalize font-bold">{share.permission === "editor" ? "Editor" : "Viewer"}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCollaboratorShare(share.share_id)}
                          disabled={shareActionLoading === share.share_id}
                          className="p-2 bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-150 text-neutral-400 hover:text-red-500 rounded-xl transition-all font-sans text-[10px] font-bold cursor-pointer shrink-0 animate-in fade-in duration-300"
                          title="Revoke access"
                        >
                          {shareActionLoading === share.share_id ? (
                            <Loader2 size={11} className="animate-spin text-red-500" />
                          ) : (
                            "Revoke"
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Modal footer close */}
            <div className="flex justify-end pt-4 mt-4 border-t border-neutral-150 shrink-0">
              <button
                onClick={() => setIsShareOpen(false)}
                className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-250 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
