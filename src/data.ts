import { NoteCard, FeatureItem, PricingTier } from "./types";

export const SAMPLE_NOTES: NoteCard[] = [
  {
    id: "note-1",
    title: "Weekly Sprint Goals",
    content: "Finalize core workspace release, review design feedback, and prepare team demo.",
    category: "Work",
    date: "Just now",
    isFavorite: true,
    color: "bg-blue-50 text-blue-900 border-blue-200",
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-100/60 text-blue-950 border-blue-200/50 shadow-blue-100/20",
    tags: ["sprint", "product"]
  },
  {
    id: "note-2",
    title: "Design Principles",
    content: "1. Generous whitespace over nested boxes.\n2. Fast, tactile feedback.\n3. Content comes first.",
    category: "Design",
    date: "10m ago",
    isFavorite: true,
    color: "bg-neutral-50 text-neutral-900 border-neutral-200",
    gradient: "bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-900 border-neutral-200/70 shadow-neutral-100/30",
    tags: ["principles", "ui"]
  },
  {
    id: "note-3",
    title: "Reading & Book Notes",
    content: "Key takeaways on deep work: protect uninterrupted morning blocks and keep tools distraction-free.",
    category: "Personal",
    date: "Yesterday",
    isFavorite: false,
    color: "bg-amber-50 text-amber-900 border-amber-200",
    gradient: "bg-gradient-to-br from-amber-50 to-orange-100/60 text-amber-950 border-amber-200/50 shadow-orange-100/20",
    tags: ["books", "focus"]
  },
  {
    id: "note-4",
    title: "Architecture & Sync",
    content: "Client-side offline storage with real-time cloud sync and conflict-free updates.",
    category: "Engineering",
    date: "2 days ago",
    isFavorite: false,
    color: "bg-emerald-50 text-emerald-900 border-emerald-200",
    gradient: "bg-gradient-to-br from-emerald-50 to-teal-100/60 text-teal-950 border-teal-200/50 shadow-teal-100/20",
    tags: ["tech", "sync"]
  }
];

export const FEATURES: FeatureItem[] = [
  {
    id: "feat-collaboration",
    title: "Real-Time Collaboration",
    description: "Work together on notes simultaneously with live text cursors and instant multi-editor sync.",
    badge: "Live Sync",
    category: "Teamwork"
  },
  {
    id: "feat-rich-text",
    title: "Rich Text & Markdown",
    description: "Format headings, checklists, code blocks, and blockquotes with simple keyboard shortcuts.",
    badge: "Editor",
    category: "Writing"
  },
  {
    id: "feat-search",
    title: "Instant Search & Tags",
    description: "Find any sentence, tag, or note title instantly across your entire workspace in milliseconds.",
    badge: "Fast Index",
    category: "Search"
  },
  {
    id: "feat-attachments",
    title: "File Attachments",
    description: "Attach PDFs, spreadsheets, and images directly to any note with one-click preview and download.",
    badge: "Cloud Files",
    category: "Storage"
  },
  {
    id: "feat-sync",
    title: "Cloud & Offline Sync",
    description: "Write anywhere—even without Wi-Fi. Changes save locally and sync automatically when reconnected.",
    badge: "Offline Ready",
    category: "Reliability"
  },
  {
    id: "feat-google-auth",
    title: "One-Click Sign-In",
    description: "Sign in securely with your Google account. No complex passwords to remember or set up.",
    badge: "Fast Auth",
    category: "Security"
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
