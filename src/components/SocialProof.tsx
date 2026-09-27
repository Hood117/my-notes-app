import { motion } from "motion/react";
import { Star, BadgeCheck, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  tag: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "elena",
    name: "Elena Rostova",
    role: "Staff Product Designer",
    company: "Craft Labs",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    tag: "Design & UX",
    content:
      "My Notes completely strips away the visual noise that plagues other apps. It launches in milliseconds, Markdown formatting feels effortless, and the typography makes deep writing a joy.",
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    role: "Tech Lead",
    company: "DevCore Studio",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    tag: "Engineering",
    content:
      "The instant keyboard search and offline-first responsiveness are exceptional. Our engineering team replaced bulky documentation silos with My Notes for agile RFCs and sprint notes.",
  },
  {
    id: "sarah",
    name: "Dr. Sarah Jenkins",
    role: "Author & Research Fellow",
    company: "Oxford Horizon",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    tag: "Writing & Research",
    content:
      "Finally a workspace that respects deep focus. The distraction-free dark mode and lightning-fast tag indexing let me capture fleeting thoughts before they disappear.",
  },
];

export default function SocialProof() {
  return (
    <section
      className="py-24 relative overflow-hidden bg-white dark:bg-neutral-950 border-t border-neutral-200/50 dark:border-neutral-800 transition-colors duration-300"
      id="testimonials"
    >
      {/* Ambient gradient orbs behind the glass cards */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-400/10 dark:bg-rose-600/10 rounded-full blur-[90px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 shadow-xs">
            <BadgeCheck size={14} className="text-blue-600 dark:text-blue-400" />
            Social Proof
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mt-1 transition-colors">
            Loved by Builders, Writers, and Teams
          </h2>
        </div>

        {/* 3 Glass-Morphism Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" id="social-proof-cards">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative group rounded-3xl p-7 flex flex-col justify-between backdrop-blur-xl bg-white/70 dark:bg-neutral-900/60 border border-white/80 dark:border-neutral-800/80 shadow-lg shadow-neutral-900/5 dark:shadow-black/30 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 overflow-hidden"
            >
              {/* Card top subtle shine accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-neutral-700/60 to-transparent pointer-events-none" />

              <div>
                {/* Header row: Tag and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50">
                    {item.tag}
                  </span>
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-amber-400 fill-amber-400 drop-shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Quote Icon */}
                <Quote
                  size={24}
                  className="text-neutral-300/80 dark:text-neutral-700/80 mb-3"
                  aria-hidden="true"
                />

                {/* Testimonial Text */}
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed font-sans mb-6">
                  "{item.content}"
                </p>
              </div>

              {/* Author / Avatar Info */}
              <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/70 flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-neutral-800 shadow-sm"
                    loading="lazy"
                  />
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center shadow-xs"
                    title="Verified User"
                  >
                    <BadgeCheck size={10} className="text-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {item.role} · <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
