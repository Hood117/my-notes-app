import { motion } from "motion/react";
import { Search, CloudLightning, UserCheck, Users, Type, Paperclip } from "lucide-react";
import { FEATURES } from "../data";

export default function Features() {
  const getIcon = (id: string) => {
    switch (id) {
      case "feat-collaboration":
        return <Users className="text-blue-600" size={22} />;
      case "feat-rich-text":
        return <Type className="text-indigo-600" size={22} />;
      case "feat-search":
        return <Search className="text-violet-600" size={22} />;
      case "feat-attachments":
        return <Paperclip className="text-amber-600" size={22} />;
      case "feat-sync":
        return <CloudLightning className="text-emerald-600" size={22} />;
      case "feat-google-auth":
        return <UserCheck className="text-cyan-600" size={22} />;
      default:
        return <Users className="text-blue-600" size={22} />;
    }
  };

  const getVisualComponent = (id: string) => {
    switch (id) {
      case "feat-collaboration":
        return (
          <div className="mt-5 flex items-center -space-x-1.5">
            <span className="w-7 h-7 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-white shadow-xs">JD</span>
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-white shadow-xs">AL</span>
            <span className="w-7 h-7 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-white shadow-xs">MK</span>
            <span className="text-xs text-neutral-400 font-medium ml-3">Live cursor sync</span>
          </div>
        );
      case "feat-rich-text":
        return (
          <div className="mt-5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-semibold text-neutral-700 dark:text-neutral-300">H1</span>
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-bold text-neutral-700 dark:text-neutral-300">B</span>
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded italic text-neutral-700 dark:text-neutral-300">I</span>
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-[11px] text-neutral-700 dark:text-neutral-300">Code</span>
            <span className="text-neutral-300 dark:text-neutral-600 mx-1">·</span>
            <span className="text-neutral-400 text-xs">Markdown supported</span>
          </div>
        );
      case "feat-search":
        return (
          <div className="mt-5 p-2.5 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-150 dark:border-neutral-700 rounded-xl text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Search size={13} className="text-neutral-400" />
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">Search notes or #tags...</span>
          </div>
        );
      case "feat-attachments":
        return (
          <div className="mt-5 flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-150 dark:border-neutral-700 rounded-xl text-xs text-neutral-700 dark:text-neutral-300">
            <Paperclip size={13} className="text-neutral-400" />
            <span className="font-medium truncate">project-document.pdf</span>
            <span className="text-neutral-400 ml-auto font-mono text-[11px]">1.2 MB</span>
          </div>
        );
      case "feat-sync":
        return (
          <div className="mt-5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Instant offline save & cloud backup</span>
          </div>
        );
      case "feat-google-auth":
        return (
          <div className="mt-5 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
              G
            </div>
            <span>Fast Google authentication</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-neutral-100/50 dark:bg-neutral-950/80 border-y border-neutral-200/70 dark:border-neutral-800 transition-colors duration-300" id="features">
      {/* Background ambient orbs to create physical refraction through the liquid glass */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/25 dark:bg-blue-600/10 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400/25 dark:bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mt-2 mb-3 transition-colors">
            Designed for Effortless Writing
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 font-sans font-normal transition-colors">
            Fast, minimal tools designed to keep you in flow state without visual distractions.
          </p>
        </div>

        {/* 6 Features Bento Grid with Liquid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="features-bento-grid">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.id}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="liquid-glass rounded-3xl p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-none"
            >
              <div>
                <div className="w-11 h-11 bg-white/95 dark:bg-neutral-800/80 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/10 shadow-xs mb-4">
                  {getIcon(feature.id)}
                </div>

                <h3 className="font-display text-base font-bold tracking-tight text-neutral-950 dark:text-white mb-2 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-400 leading-relaxed font-sans transition-colors">
                  {feature.description}
                </p>
              </div>

              {getVisualComponent(feature.id)}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
