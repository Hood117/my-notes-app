import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-white" id="cta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900 text-white rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          id="cta-wrapper"
        >
          <div className="relative max-w-xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to Organize Your Thoughts?
            </h2>
            
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">
              Start writing in a clean, distraction-free environment. Free forever, no credit card required.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 text-sm font-semibold transition-all shadow-sm active:scale-98"
              >
                Get Started Free
                <ArrowRight size={15} />
              </a>
              <a
                href="#/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white text-sm font-medium transition-all"
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
