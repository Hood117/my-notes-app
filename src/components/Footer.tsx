import { NotebookPen, Github, X, Linkedin, Heart } from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 dark:bg-black border-t border-neutral-800 dark:border-neutral-900 text-neutral-400 py-12 transition-colors duration-300" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
              <NotebookPen size={15} className="stroke-[2.5]" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              My Notes
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-xs font-medium">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-white transition-colors">
              Preview
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="hover:text-white transition-colors">
              Reviews
            </a>
            <a href="#/login" className="hover:text-white transition-colors">
              Sign In
            </a>
          </div>

          {/* Social Icons & Attribution */}
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/rahmatdev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
              >
                <X size={15} />
              </a>
              <a
                href="https://github.com/Hood117"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
              >
                <Github size={15} />
              </a>
              <a
                href="https://www.linkedin.com/in/rahmatullah-zadran-148074278?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
              >
                <Linkedin size={15} />
              </a>
            </div>

            <p className="text-xs text-neutral-400 flex items-center justify-center gap-1 text-center">
              Made with{" "}
              <motion.span
                animate={{ scale: [1, 1.3, 1, 1.3, 1] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center justify-center mx-0.5"
              >
                <Heart size={12} className="text-rose-500 fill-rose-500" />
              </motion.span>{" "}
              by{" "}
              <a
                href="https://x.com/rahmatdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-white transition-colors font-medium"
              >
                Rahmat
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {currentYear} My Notes. All rights reserved.</p>
          <p className="text-neutral-500">Designed for focus and simple note-taking.</p>
        </div>
      </div>
    </footer>
  );
}
