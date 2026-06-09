import { useState, FormEvent } from "react";
import { useAuth } from "../../lib/supabase/auth";
import { Mail, Lock, Eye, EyeOff, NotebookPen, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

interface LoginFormProps {
  onNavigateToSignup: () => void;
  onNavigateToHome: () => void;
  onSuccess: () => void;
}

export default function LoginForm({ onNavigateToSignup, onNavigateToHome, onSuccess }: LoginFormProps) {
  const { signIn, isDemoMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all email and password fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result && result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setLoading(false);
          onSuccess();
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign-in.");
      setLoading(false);
    }
  };

  const handleSandboxAutofill = () => {
    setEmail("rahmatthedev@gmail.com");
    setPassword("developerpassword123");
    setError(null);
  };

  return (
    <div id="login-container" className="w-full max-w-md mx-auto space-y-6">
      {/* Back to Home action */}
      <button
        onClick={onNavigateToHome}
        className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-xs font-semibold mb-2 group focus:outline-none"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Landing Page
      </button>

      {/* Main card box */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 md:p-10 shadow-xl shadow-neutral-100/50 relative overflow-hidden">
        {/* Decorative corner ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl -z-10" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-200/50 mb-4">
            <NotebookPen size={20} className="stroke-[2.5]" />
          </div>
          <h2 className="font-display font-bold text-2xl text-neutral-950">Welcome Back</h2>
          <p className="text-xs text-neutral-500 mt-1.5 font-sans">
            Access your secure workstation, task lists, and ideas.
          </p>
        </div>

        {/* Sandbox indicator and autofill shortcut */}
        {isDemoMode && (
          <div className="mb-6 p-3.5 rounded-xl bg-orange-50/70 border border-orange-100/80 text-[11px] text-orange-900 font-sans space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles size={12} className="text-orange-500 fill-orange-400 animate-pulse" />
              Developer Sandbox Active
            </div>
            <p className="text-orange-850">
              No live database variables configured. Easily simulate authenticated routes locally or autofill the sandbox user info below:
            </p>
            <button
              type="button"
              onClick={handleSandboxAutofill}
              className="w-full py-1.5 px-3 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold transition-all text-[11px]"
            >
              ⚡ Click to Quick Autofill (Sandbox Mode)
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Password</label>
              {isDemoMode && (
                <span className="text-[10px] text-neutral-400">At least 6 chars</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200 rounded-xl py-3 pl-10 pr-11 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-650 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Feedbacks */}
          {error && (
            <div className="text-[11px] text-red-650 bg-red-50 border border-red-100 p-3 rounded-xl leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          {/* Success Feedbacks */}
          {success && (
            <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Credentials validated! Redirecting you securely...
            </div>
          )}

          {/* Login CTA */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 bg-neutral-900 hover:bg-blue-600 disabled:bg-neutral-200 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-neutral-900/5 cursor-pointer disabled:cursor-not-allowed transform active:scale-98 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Signing in securely...
              </>
            ) : (
              "Sign In with Password"
            )}
          </button>
        </form>

        {/* Footer switch page navigation link */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs">
          <span className="text-neutral-400">Don't have an active account yet?</span>{" "}
          <button
            onClick={onNavigateToSignup}
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline bg-transparent border-0 cursor-pointer focus:outline-none"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}
