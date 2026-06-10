import { motion } from "motion/react";
import { FolderKanban, Search, Star, CloudLightning, Zap, ChevronRight, Hash, Sparkles, UserCheck, Users, MousePointer, Type, Save, Paperclip } from "lucide-react";
import { FEATURES } from "../data";

export default function Features() {
  // We match each feature data item to custom conceptual visual representations to prevent dry placeholder copy
  const getIcon = (id: string) => {
    switch (id) {
      case "feat-organize":
        return <FolderKanban className="text-blue-600" size={24} />;
      case "feat-search":
        return <Search className="text-indigo-600" size={24} />;
      case "feat-favorites":
        return <Star className="text-amber-500 fill-amber-100" size={24} />;
      case "feat-sync":
        return <CloudLightning className="text-violet-600" size={24} />;
      case "feat-responsive":
        return <Zap className="text-rose-500" size={24} />;
      case "feat-google-auth":
        return <UserCheck className="text-cyan-600" size={24} />;
      case "feat-collaboration":
        return <Users className="text-emerald-600" size={24} />;
      case "feat-presence":
        return <MousePointer className="text-orange-500" size={24} />;
      case "feat-rich-text":
        return <Type className="text-blue-500" size={24} />;
      case "feat-autosave":
        return <Save className="text-pink-500" size={24} />;
      case "feat-attachments":
        return <Paperclip className="text-amber-600" size={24} />;
      default:
        return <FolderKanban className="text-blue-600" size={24} />;
    }
  };

  const getVisualComponent = (id: string) => {
    switch (id) {
      case "feat-organize":
        return (
          <div className="mt-6 flex flex-wrap gap-2 overflow-hidden max-h-16 opacity-90 transition-transform group-hover:translate-x-1 duration-300">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/50 rounded-full text-xs font-semibold text-neutral-700 shadow-xs">
              <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full" />
              #marketing
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/50 rounded-full text-xs font-semibold text-neutral-700 shadow-xs">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
              #finance
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/50 rounded-full text-xs font-semibold text-neutral-700 shadow-xs">
              <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
              #ideas
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/50 rounded-full text-xs font-semibold text-neutral-700 shadow-xs">
              <span className="h-1.5 w-1.5 bg-rose-500 rounded-full" />
              #recipes
            </span>
          </div>
        );
      case "feat-search":
        return (
          <div className="mt-5 p-2 bg-white border border-neutral-100/60 rounded-xl shadow-sm text-xs text-neutral-400 font-mono flex items-center gap-2 group-hover:border-neutral-200 transition-all">
            <span className="text-blue-600">find</span>
            <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-900 rounded font-semibold text-[10px]">⌥ Shift + F</span>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-500 font-sans italic truncate">"SaaS Growth Plan"</span>
          </div>
        );
      case "feat-favorites":
        return (
          <div className="mt-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-xs">
              <Star size={14} className="fill-amber-400" />
            </div>
            <div className="w-40 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-amber-400 rounded-full transition-transform group-hover:scale-x-105 origin-left duration-500" />
            </div>
            <span className="text-[10px] text-neutral-400 font-mono font-bold">75% prioritized</span>
          </div>
        );
      case "feat-sync":
        return (
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="text-[10px] font-mono text-neutral-500 px-2 py-1 bg-emerald-50 border border-emerald-100/60 text-emerald-800 rounded-lg animate-pulse">
              Saved offline locally
            </div>
            <span className="text-xs text-neutral-400">→</span>
            <div className="text-[10px] font-mono text-neutral-500 px-2 py-1 bg-blue-50 border border-blue-100/60 text-blue-800 rounded-lg">
              Synchronized cloud
            </div>
          </div>
        );
      case "feat-responsive":
        return (
          <div className="mt-6 flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-semibold text-neutral-400 bg-neutral-100/80 px-2 py-0.5 rounded-md">
              Fast 60fps animations
            </span>
            <span className="text-[10px] font-mono font-semibold text-neutral-400 bg-neutral-100/80 px-2 py-0.5 rounded-md">
              Keyboard shortcut navigation
            </span>
          </div>
        );
      case "feat-google-auth":
        return (
          <div className="mt-5 p-2 bg-white border border-neutral-150 rounded-xl shadow-xs text-xs font-sans flex items-center gap-2 group-hover:bg-neutral-50/50 transition-all">
            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center font-extrabold text-[9px] text-red-600">G</span>
            <span className="text-neutral-700 font-bold text-[11px]">Google Single Sign-On Active</span>
          </div>
        );
      case "feat-collaboration":
        return (
          <div className="mt-5 flex items-center -space-x-1 px-1">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold border-2 border-white shadow-xs">JD</span>
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold border-2 border-white shadow-xs">AL</span>
            <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-[9px] flex items-center justify-center font-bold border-2 border-white shadow-xs">RB</span>
            <span className="text-[10px] text-neutral-400 font-medium ml-3">+ 3 team editors</span>
          </div>
        );
      case "feat-presence":
        return (
          <div className="mt-5 flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100/60 rounded-md text-[9px] font-mono animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Realtime Cursors On</span>
            </div>
          </div>
        );
      case "feat-rich-text":
        return (
          <div className="mt-5 flex gap-1 items-center">
            <span className="px-1.5 py-0.5 bg-neutral-100/80 rounded font-bold text-[10px] text-neutral-600 font-mono">B</span>
            <span className="px-1.5 py-0.5 bg-neutral-100/80 rounded italic text-[10px] text-neutral-600 font-mono">I</span>
            <span className="px-1.5 py-0.5 bg-neutral-100/80 rounded line-through text-[10px] text-neutral-600 font-mono">S</span>
            <span className="px-1.5 py-0.5 bg-neutral-100/80 rounded text-[10px] text-neutral-600 font-mono">H1</span>
            <span className="px-1.5 py-0.5 bg-neutral-100/80 rounded text-[10px] text-neutral-600 font-mono">Code</span>
          </div>
        );
      case "feat-autosave":
        return (
          <div className="mt-5 flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono font-medium">
            <span className="text-emerald-600 font-bold mb-0.5">✔</span>
            <span>All edits auto-saved dynamically</span>
          </div>
        );
      case "feat-attachments":
        return (
          <div className="mt-5 flex items-center gap-1.5 px-2 py-1.5 bg-neutral-50/50 border border-neutral-150 rounded-xl text-[10px] text-neutral-600 font-medium font-sans">
            <Paperclip size={10} className="text-neutral-400" />
            <span className="truncate">project_briefing_q3.pdf</span>
            <span className="text-neutral-400 font-mono ml-auto">1.4 MB</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-neutral-50 border-y border-neutral-200/50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header content describing target solutions */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
            <Sparkles size={11} className="fill-blue-100" />
            Premium Capabilities
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4 leading-tight">
            Designed for Intellectual Clarity
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-sans font-light">
            An elegant integration of robust client features ensuring you never let an inspiration, action item, or task fade away.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6" id="features-bento-grid">
          {FEATURES.map((feature, idx) => {
            // Distribute layout: Some features get 3 columns, some get 2 for modern asymmetrical bento system
            let columnSpan = "md:col-span-2";
            if (idx === 0 || idx === 1 || idx === 5 || idx === 6) {
              columnSpan = "md:col-span-3";
            } else if (idx === 10) {
              columnSpan = "md:col-span-6";
            }
            return (
              <motion.div
                key={feature.id}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`group bg-white rounded-3xl p-6 md:p-8 border border-neutral-200/50 hover:border-neutral-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${columnSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    {/* Visual custom themed icon container */}
                    <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                      {getIcon(feature.id)}
                    </div>
                    {feature.badge && (
                      <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase bg-neutral-100/50 border border-neutral-200/20 px-2.5 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg sm:text-lg font-bold tracking-tight text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>

                {/* Conceptual preview UI elements for the bento feature description */}
                {getVisualComponent(feature.id)}
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic visual hook for Linear comparison style */}
        <div className="mt-12 text-center">
          <p className="text-xs text-neutral-400 inline-flex items-center gap-1">
            Looking for something specific? 
            <a href="#cta" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold inline-flex items-center gap-0.5">
              Request customization
              <ChevronRight size={10} />
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
