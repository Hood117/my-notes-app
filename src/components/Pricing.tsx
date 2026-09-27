import { motion } from "motion/react";
import { Check } from "lucide-react";
import { PRICING_TIERS } from "../data";

export default function Pricing() {
  return (
    <section className="py-24 bg-neutral-50/60 border-t border-neutral-200/50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-2 mb-3">
            Simple, Transparent Plans
          </h2>
          <p className="text-base text-neutral-500 font-sans font-light">
            Start free for personal note-taking, or choose Pro for unlimited workspace power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto" id="pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl p-7 relative flex flex-col justify-between border ${
                tier.isPopular
                  ? "bg-white border-blue-600 shadow-md ring-1 ring-blue-600/20"
                  : "bg-white border-neutral-200/80 shadow-xs"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Popular
                </div>
              )}

              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-1">{tier.name}</h3>
                <p className="text-xs text-neutral-500 mb-5 font-sans leading-relaxed">{tier.description}</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-3xl font-bold text-neutral-950">{tier.price}</span>
                  <span className="text-xs text-neutral-400">/ {tier.period}</span>
                </div>

                <div className="border-t border-neutral-100 pt-5 mb-6">
                  <ul className="space-y-3" id="pricing-list">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <Check size={14} className={tier.isPopular ? "text-blue-600" : "text-neutral-400"} />
                        <span className="text-xs text-neutral-600 font-sans">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href="#/signup"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center transition-all block ${
                  tier.isPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
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
