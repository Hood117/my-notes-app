import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { PRICING_TIERS } from "../data";

export default function Pricing() {
  return (
    <section className="py-24 bg-neutral-50/60 border-t border-neutral-200/50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tier Pricing Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 bg-blue-50/60 rounded-full border border-blue-100">
            Flexible Pricing
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-4 mb-3">
            Simple Plans for Every Thinker
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans">
            Start free to map everyday notes, or upgrade to Pro to unlock advanced AI sorting models and continuous multi-device sync.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" id="pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className={`rounded-3xl p-8 relative flex flex-col justify-between border ${
                tier.isPopular
                  ? "bg-white border-blue-500 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/30"
                  : "bg-white/80 border-neutral-200/60 hover:bg-white transition-all shadow-2xs"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles size={11} className="fill-white" />
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-display text-xl font-bold text-neutral-900 mb-1">{tier.name}</h3>
                <p className="text-xs text-neutral-500 mb-6 font-sans leading-relaxed">{tier.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display text-4xl font-extrabold text-neutral-950">{tier.price}</span>
                  <span className="text-xs font-semibold text-neutral-400">/ {tier.period}</span>
                </div>

                <div className="border-t border-neutral-100 pt-6 mb-8">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Included Features</h4>
                  <ul className="space-y-3.5" id="pricing-list">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3">
                        <div className={`p-0.5 rounded-full shrink-0 ${tier.isPopular ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-500"}`}>
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm text-neutral-600 font-medium font-sans">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => alert(`Creating mock flow for the ${tier.name}`)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  tier.isPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 hover:shadow-md"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                }`}
              >
                {tier.ctaText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Dynamic secure note */}
        <p className="text-center text-[10px] text-neutral-400 mt-12 font-mono">
          🔒 Pay securely with standard Stripe encryption. Cancellation takes 1-click. No hidden fees.
        </p>
      </div>
    </section>
  );
}
