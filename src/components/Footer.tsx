import { NotebookPen, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-400 py-16" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-neutral-800">
          
          {/* Footer Logo block */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
              <NotebookPen size={15} className="stroke-[2.5]" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              My Notes
            </span>
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
            <button
              onClick={() => alert("Simulation: Privacy Policy details")}
              className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => alert("Simulation: Terms & Conditions detailed clause")}
              className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => alert("Simulation: Contact center form submission")}
              className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => alert("Follow on Twitter / X")}
              aria-label="Twitter link"
              className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Twitter size={15} />
            </button>
            <button
              onClick={() => alert("Follow on GitHub")}
              aria-label="GitHub Link"
              className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Github size={15} />
            </button>
            <button
              onClick={() => alert("Follow on LinkedIn")}
              aria-label="LinkedIn Link"
              className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Linkedin size={15} />
            </button>
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
