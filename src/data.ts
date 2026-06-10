import { NoteCard, FeatureItem, PricingTier } from "./types";

export const SAMPLE_NOTES: NoteCard[] = [
  {
    id: "note-1",
    title: "💡 SaaS Growth Plan",
    content: "Launch viral referral program, build interactive user playgrounds, and optimize page load speed under 1.2s. Partner with creators.",
    category: "Strategy",
    date: "updated just now",
    isFavorite: true,
    color: "bg-amber-50 text-amber-900 border-amber-200",
    gradient: "bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-950 border-amber-200/50 shadow-orange-100/30",
    tags: ["growth", "q3", "product"]
  },
  {
    id: "note-2",
    title: "⚡ Deep Work Principles",
    content: "1. No notifications during 9 AM - 12 PM.\n2. Keep notes visual and structured.\n3. Keep phone in another room.",
    category: "Habits",
    date: "updated 2 hrs ago",
    isFavorite: true,
    color: "bg-purple-50 text-purple-900 border-purple-200",
    gradient: "bg-gradient-to-br from-violet-50 to-indigo-100/60 text-indigo-950 border-violet-200/50 shadow-indigo-100/30",
    tags: ["productivity", "habits"]
  },
  {
    id: "note-3",
    title: "🎨 Design Inspiration & System",
    content: "Explore bento-grid patterns, light-mode micro-gradients, card layouts with extremely thin strokes (1px rgba(0,0,0,0.06)) and huge interactive elements.",
    category: "Design",
    date: "updated yesterday",
    isFavorite: false,
    color: "bg-rose-50 text-rose-900 border-rose-200",
    gradient: "bg-gradient-to-br from-rose-50 to-pink-100/60 text-pink-950 border-rose-200/50 shadow-pink-100/30",
    tags: ["ui-ux", "inspiration"]
  },
  {
    id: "note-4",
    title: "🌱 Kitchen Remodeling Ideas",
    content: "Sleek dark oak shelves, warm spotlight fixtures, off-white quartz countertop, and integrated magnetic key racks near the entryway.",
    category: "Personal",
    date: "updated 3 days ago",
    isFavorite: false,
    color: "bg-emerald-50 text-emerald-900 border-emerald-200",
    gradient: "bg-gradient-to-br from-emerald-50 to-teal-100/60 text-teal-950 border-teal-200/50 shadow-teal-100/30",
    tags: ["home", "ideas"]
  },
  {
    id: "note-5",
    title: "🚀 App Launch Checklist",
    content: "Submit to ProductHunt, send previews to early newsletter subscribers, audit accessible colors, and verify Firestore secure rule updates.",
    category: "Marketing",
    date: "updated 4 days ago",
    isFavorite: false,
    color: "bg-sky-50 text-sky-900 border-sky-200",
    gradient: "bg-gradient-to-br from-sky-50 to-blue-100/60 text-blue-950 border-sky-200/50 shadow-blue-100/30",
    tags: ["marketing", "launch"]
  }
];

export const FEATURES: FeatureItem[] = [
  {
    id: "feat-organize",
    title: "Organize Seamlessly",
    description: "Group and tag related ideas, tasks, and journals instantly. Color-code notes to maintain visual clarity and visual comfort.",
    badge: "Smart Tags",
    category: "Structure"
  },
  {
    id: "feat-search",
    title: "Smart Fast Search",
    description: "Find any sentence or keyword instantly across all files with local indexing. Matches tags, titles, and note history in milliseconds.",
    badge: "Ultrastroke Speed",
    category: "Navigation"
  },
  {
    id: "feat-favorites",
    title: "Pin Important Ideas",
    description: "Star or pin your high-priority notes for immediate dashboard access. Keep key tasks visible so they never escape your daily focus.",
    badge: "Favorites Bar",
    category: "Priority"
  },
  {
    id: "feat-sync",
    title: "Secure Cloud Sync",
    description: "Access your thoughts on phone, tablet, or web browser. Automatic offline drafts with background syncing to prevent data loss.",
    badge: "Cloud Sync",
    category: "Cloud"
  },
  {
    id: "feat-responsive",
    title: "Lightweight & Fast",
    description: "Designed strictly with light and fast load times. Built with keyboard shortcut support, touch-optimized gestures, and standard offline-first architecture.",
    badge: "Responsive Design",
    category: "Performance"
  },
  {
    id: "feat-google-auth",
    title: "Google Sign-In",
    description: "Instantly sign in securely with your Google account. Zero passwords to remember, zero registration friction.",
    badge: "Seamless Auth",
    category: "Security"
  },
  {
    id: "feat-collaboration",
    title: "Multi-User Collaboration",
    description: "Share notes with team members or friends in seconds. Set granular permission roles like Viewer or Editor for total control.",
    badge: "Teamwork",
    category: "Collaboration"
  },
  {
    id: "feat-presence",
    title: "Live Presence & Cursors",
    description: "See active collaborator avatars at the top and track their text cursors on the screen in real-time.",
    badge: "Supabase Realtime",
    category: "Real-Time"
  },
  {
    id: "feat-rich-text",
    title: "Rich Text Editing",
    description: "Format notes beautifully with bold header styles, code listings, lists, quotes, and custom structured details.",
    badge: "WYSIWYG Editor",
    category: "UI/UX"
  },
  {
    id: "feat-autosave",
    title: "Smart Auto-Save",
    description: "Your edits are saved as you type without lag. Experience real-time backup on every keystroke and sync state tracking.",
    badge: "Reliability",
    category: "Content"
  },
  {
    id: "feat-attachments",
    title: "File Attachments",
    description: "Seamlessly attach document files, PDFs, slides, assets, or images directly to any note with automatic download and quick-delete controls.",
    badge: "Secure Storage",
    category: "Storage"
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for students, individuals, and lightweight note-takers mapping out daily ideas.",
    features: [
      "Up to 50 active notes",
      "Standard rich editor tools",
      "Local browser storage",
      "Organized tags & search",
      "Lightweight responsive web client"
    ],
    isPopular: false,
    ctaText: "Start taking notes"
  },
  {
    name: "Pro Account",
    price: "$8",
    period: "user / month",
    description: "For creators, developers, and knowledge professionals demanding deep organization tools.",
    features: [
      "Infinite notes & subfolders",
      "Instant multi-device cloud sync",
      "Advanced AI Categorization",
      "Rich media & document uploads",
      "Collaborative shared shareable links",
      "Priority customer helpdesk 24/7"
    ],
    isPopular: true,
    ctaText: "Go Pro free for 14 Days"
  }
];
