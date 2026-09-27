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
          <div className="mt-5 flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="px-2 py-0.5 bg-neutral-100 rounded font-semibold text-neutral-700">H1</span>
            <span className="px-2 py-0.5 bg-neutral-100 rounded font-bold text-neutral-700">B</span>
            <span className="px-2 py-0.5 bg-neutral-100 rounded italic text-neutral-700">I</span>
            <span className="px-2 py-0.5 bg-neutral-100 rounded font-mono text-[11px] text-neutral-700">Code</span>
            <span className="text-neutral-300 mx-1">·</span>
            <span className="text-neutral-400 text-xs">Markdown supported</span>
          </div>
        );
      case "feat-search":
        return (
          <div className="mt-5 p-2.5 bg-neutral-50 border border-neutral-150 rounded-xl text-xs text-neutral-500 flex items-center gap-2">
            <Search size={13} className="text-neutral-400" />
            <span className="text-neutral-700 font-medium">Search notes or #tags...</span>
          </div>
        );
      case "feat-attachments":
        return (
          <div className="mt-5 flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-150 rounded-xl text-xs text-neutral-700">
            <Paperclip size={13} className="text-neutral-400" />
            <span className="font-medium truncate">project-document.pdf</span>
            <span className="text-neutral-400 ml-auto font-mono text-[11px]">1.2 MB</span>
          </div>
        );
      case "feat-sync":
        return (
          <div className="mt-5 flex items-center gap-2 text-xs text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Instant offline save & cloud backup</span>
          </div>
        );
      case "feat-google-auth":
        return (
          <div className="mt-5 flex items-center gap-2 text-xs text-neutral-600 font-medium">
            <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-700">
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
    <section className="py-24 bg-neutral-50/60 border-y border-neutral-200/50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-2 mb-3">
            Designed for Effortless Writing
          </h2>
          <p className="text-base text-neutral-600 font-sans font-light">
            Fast, minimal tools designed to keep you in flow state without visual distractions.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="features-bento-grid">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.id}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-2xl p-6 md:p-7 border border-neutral-200/70 hover:border-neutral-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center border border-neutral-100 mb-4">
                  {getIcon(feature.id)}
                </div>

                <h3 className="font-display text-base font-bold tracking-tight text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans">
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
