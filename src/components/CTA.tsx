import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 3) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden" id="cta">
      {/* Visual background gradient blurs for the call-to-action */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-100/30 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-tr from-neutral-900 to-neutral-950 text-white rounded-[3rem] px-6 py-16 md:p-20 text-center shadow-2xl overflow-hidden border border-neutral-800"
          id="cta-wrapper"
        >
          {/* Subtle decoration elements inside the card */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300">
              <Sparkles size={11} className="text-amber-400 fill-amber-400" />
              Instant Free Access
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
              Start Collaborating with My Notes Premium
            </h2>
            
            <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-lg mx-auto leading-relaxed">
              Unlock real-time collaborative productivity, lightning-fast Google Sign-In, and secure file management. Write, attach, share, and design your team's thoughts in perfect sync.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl max-w-sm mx-auto flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="text-emerald-400" size={18} />
                <span className="text-xs sm:text-xs text-emerald-200 font-semibold text-left">
                  Success Check! Please verify your inbox to activate premium features.
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-800/80 border border-neutral-700/80 rounded-xl py-3.5 pl-11 pr-4 text-xs font-sans text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white hover:bg-neutral-100 text-neutral-950 font-semibold py-3 px-6 rounded-xl text-xs transition-colors hover:shadow-lg focus:outline-none focus:scale-98 cursor-pointer shrink-0"
                >
                  Create Premium Account
                </button>
              </form>
            )}

            {/* Simulated Sign In triggers linked to actual hash route router */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-500 font-medium">Already have an active account?</span>
                <button
                  onClick={() => { window.location.hash = "#/login"; }}
                  className="text-[11px] text-white hover:text-blue-400 font-bold underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
              <span className="hidden sm:inline text-neutral-700">|</span>
              <button
                onClick={() => { window.location.hash = "#/login"; }}
                className="inline-flex items-center gap-1.5 text-[11px] text-neutral-300 hover:text-white font-medium bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full hover:bg-neutral-850 duration-200 transition-all"
              >
                <span>🚀 Sign in with Google</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
