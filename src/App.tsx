import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./lib/supabase/auth";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import DashboardPreview from "./components/DashboardPreview";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Dashboard from "./components/dashboard/Dashboard";

function AppContent() {
  const { user } = useAuth();
  const [view, setView] = useState<"landing" | "login" | "signup">("landing");

  // Track hash-routing for elegant single-page app view transitions
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/login") {
        setView("login");
      } else if (hash === "#/signup") {
        setView("signup");
      } else {
        setView("landing");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Programmatic view-switching helper
  const navigateTo = (newView: "landing" | "login" | "signup") => {
    if (newView === "landing") {
      window.location.hash = "";
    } else {
      window.location.hash = `#/${newView}`;
    }
    setView(newView);
  };

  // If a session exists securely, render the full Note workspace dashboard immediately
  if (user) {
    return <Dashboard />;
  }

  // Render Auth views
  if (view === "login") {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 selection:bg-blue-150 selection:text-blue-700">
        <LoginForm
          onNavigateToSignup={() => navigateTo("signup")}
          onNavigateToHome={() => navigateTo("landing")}
          onSuccess={() => {
            // Success handler runs; AuthProvider automatically updates the user state,
            // which redirects them to the <Dashboard /> above
          }}
        />
      </div>
    );
  }

  if (view === "signup") {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 selection:bg-blue-150 selection:text-blue-700">
        <SignupForm
          onNavigateToLogin={() => navigateTo("login")}
          onNavigateToHome={() => navigateTo("landing")}
          onSuccess={() => {
            // Success handler runs; AuthProvider updates state, triggering redirect
          }}
        />
      </div>
    );
  }

  // Default: marketing landing page
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-blue-100 selection:text-blue-700">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
