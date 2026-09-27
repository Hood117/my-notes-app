import { useState, useEffect } from "react";
import { NotebookPen, Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

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
    { label: "Preview", href: "#preview" },
    { label: "Pricing", href: "#pricing" },
    { label: "Reviews", href: "#testimonials" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/80 shadow-xs py-3"
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
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-200/50 dark:shadow-none transition-transform group-hover:scale-105 duration-300">
              <NotebookPen size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-neutral-900 dark:text-white transition-colors">
              My Notes
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8" id="desktop-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Custom CTAs & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3" id="desktop-ctas">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all focus:outline-none cursor-pointer border border-transparent dark:border-neutral-800"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              id="theme-toggle-btn"
            >
              {isDark ? (
                <Sun size={18} className="text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon size={18} className="text-neutral-600 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            <a
              href="#/login"
              className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
              id="navbar-login-btn"
            >
              Sign In
            </a>
            <a
              href="#/signup"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-blue-600 dark:hover:bg-neutral-200 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-none rounded-xl transition-all duration-300 active:scale-98"
              id="navbar-cta-btn"
            >
              Get Started
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile Right Bar: Theme Toggle & Menu Toggle */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none cursor-pointer"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              id="mobile-theme-toggle-btn"
            >
              {isDark ? (
                <Sun size={19} className="text-amber-400" />
              ) : (
                <Moon size={19} className="text-neutral-600" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none cursor-pointer"
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
          <div className="px-4 pt-2 pb-6 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 shadow-lg space-y-1.5 mt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
              <a
                href="#/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 text-base font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl"
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
