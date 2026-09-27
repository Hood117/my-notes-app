import { motion } from "motion/react";
import { Check } from "lucide-react";
import { PRICING_TIERS } from "../data";

export default function Pricing() {
  return (
    <section className="py-24 relative overflow-hidden bg-neutral-100/50 dark:bg-neutral-950/80 border-t border-neutral-200/70 dark:border-neutral-800 transition-colors duration-300" id="pricing">
      {/* Ambient background refraction orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/15 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mt-2 mb-3 transition-colors">
            Simple, Transparent Plans
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 font-sans font-normal transition-colors">
            Start free for personal note-taking, or choose Pro for unlimited workspace power.
          </p>
        </div>

        {/* Pricing Cards with Apple Liquid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto" id="pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`rounded-3xl p-8 relative flex flex-col justify-between transition-all duration-300 ${
                tier.isPopular
                  ? "liquid-glass-featured ring-1 ring-blue-500/40 shadow-xl"
                  : "liquid-glass hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-none"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-7 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-blue-500/25">
                  Popular
                </div>
              )}

              <div>
                <h3 className="font-display text-lg font-bold text-neutral-950 dark:text-white mb-1 transition-colors">{tier.name}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-5 font-sans leading-relaxed transition-colors">{tier.description}</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-3xl font-bold text-neutral-950 dark:text-white transition-colors">{tier.price}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">/ {tier.period}</span>
                </div>

                <div className="border-t border-black/5 dark:border-white/10 pt-5 mb-6">
                  <ul className="space-y-3" id="pricing-list">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <Check size={14} className={tier.isPopular ? "text-blue-600 dark:text-blue-400 stroke-[2.5]" : "text-neutral-400 dark:text-neutral-500"} />
                        <span className="text-xs text-neutral-700 dark:text-neutral-300 font-sans">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href="#/signup"
                className={`w-full py-3 px-4 rounded-2xl text-xs font-semibold text-center transition-all block ${
                  tier.isPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 active:scale-98"
                    : "bg-neutral-900/5 dark:bg-white/10 hover:bg-neutral-900/10 dark:hover:bg-white/15 text-neutral-900 dark:text-white border border-neutral-900/10 dark:border-white/10 active:scale-98"
                }`}
              >
                {tier.ctaText}
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
