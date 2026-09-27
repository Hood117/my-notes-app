import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 relative overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-300" id="cta">
      {/* Background glow for liquid glass refraction */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="liquid-glass rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          id="cta-wrapper"
        >
          <div className="relative max-w-xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Ready to Organize Your Thoughts?
            </h2>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              Start writing in a clean, distraction-free environment. Free forever, no credit card required.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-md shadow-blue-500/25 active:scale-98"
              >
                Get Started Free
                <ArrowRight size={15} />
              </a>
              <a
                href="#/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900/5 dark:bg-white/10 hover:bg-neutral-900/10 dark:hover:bg-white/15 text-neutral-900 dark:text-neutral-100 border border-neutral-900/10 dark:border-white/10 text-sm font-medium transition-all"
              >
                Sign In
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
