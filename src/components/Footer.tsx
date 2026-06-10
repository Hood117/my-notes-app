import { NotebookPen, Github, X, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-400 py-16" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-neutral-800">
          
          {/* Footer Logo block with Premium Summary */}
          <div className="flex flex-col items-start gap-2.5 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
                <NotebookPen size={15} className="stroke-[2.5]" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight flex items-center">
                My Notes
                <span className="text-[9px] font-sans font-extrabold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/25 ml-2 uppercase tracking-wider">
                  Premium
                </span>
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-sans text-left">
              An elegant modular notes client enriched with real-time team collaboration, live text cursors, Google auth, and cloud document attachments.
            </p>
          </div>

          {/* Footer Legal/Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-xs font-medium">
            <a
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#preview"
              className="hover:text-white transition-colors"
            >
              Demo Preview
            </a>
            <a
              href="#pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </a>
            <span className="text-neutral-600 cursor-default select-none">
              Privacy Clariﬁed
            </span>
            <span className="text-neutral-600 cursor-default select-none">
              Terms & Licensing
            </span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/renuxdev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter) Profile"
              className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <X size={15} />
            </a>
            <a
              href="https://github.com/Hood117"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <Github size={15} />
            </a>
            <a
              href="https://www.linkedin.com/in/rahmatullah-zadran-148074278?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <Linkedin size={15} />
            </a>
          </div>
        </div>

        {/* Copywrite notes and design stamp */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {currentYear} My Notes Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Beautifully built with</span>
            <span className="text-rose-500">❤️</span>
            <span>for cognitive clarity.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
