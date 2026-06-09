import { useState, useEffect } from "react";
import { NotebookPen, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Workspace Preview", href: "#preview" },
    { label: "Pricing Pricing", href: "#pricing" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel bg-white/85 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none"
            id="nav-logo"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-200/50 transition-transform group-hover:scale-105 duration-300">
              <NotebookPen size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-neutral-900 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text">
              My Notes
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8" id="desktop-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 hover:text-blue-600 transition-colors duration-200"
              >
                {link.label.replace(" Pricing", "")}
              </a>
            ))}
          </div>

          {/* Desktop Custom CTAs */}
          <div className="hidden md:flex items-center gap-3" id="desktop-ctas">
            <a
              href="#/login"
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200"
              id="navbar-login-btn"
            >
              Sign In
            </a>
            <a
              href="#/signup"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-neutral-900 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-100 rounded-xl transition-all duration-300 active:scale-98"
              id="navbar-cta-btn"
            >
              Get Started
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle Menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden animate-in fade-in slide-in-from-top-4 duration-200 ease-out" id="mobile-nav-panel">
          <div className="px-4 pt-2 pb-6 bg-white border-b border-neutral-100 shadow-lg space-y-1.5 mt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-600 hover:text-blue-600 hover:bg-neutral-50 transition-all"
              >
                {link.label.replace(" Pricing", "")}
              </a>
            ))}
            <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
              <a
                href="#/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 text-base font-semibold text-neutral-600 hover:bg-neutral-50 rounded-xl"
              >
                Sign In
              </a>
              <a
                href="#/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
