import { useState, FormEvent } from "react";
import { useAuth } from "../../lib/supabase/auth";
import { Mail, Lock, User, Eye, EyeOff, NotebookPen, ArrowLeft, Loader2, CheckCircle2, Sparkles } from "lucide-react";

interface SignupFormProps {
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
  onSuccess: () => void;
}

export default function SignupForm({ onNavigateToLogin, onNavigateToHome, onSuccess }: SignupFormProps) {
  const { signUp, signInWithGoogle, isDemoMode } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle();

      if (result && result.error) {
        setError(result.error);
        setGoogleLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setGoogleLoading(false);
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during Google Sign-Up.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client input checks
    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all available signup fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(email, password, name);

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 1000);
    }
  };

  const handleSandboxAutofill = () => {
    setName("Rahmat");
    setEmail("rahmatthedev@gmail.com");
    setPassword("developerpassword123");
    setConfirmPassword("developerpassword123");
    setError(null);
  };

  return (
    <div id="signup-container" className="w-full max-w-md mx-auto">
      {/* Back to Home action */}
      <button
        onClick={onNavigateToHome}
        className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-xs font-semibold mb-6 group focus:outline-none"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Landing Page
      </button>

      {/* Main card box */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 md:p-10 shadow-xl shadow-neutral-100/50 relative overflow-hidden">
        {/* Decorative corner ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/30 rounded-full blur-2xl -z-10" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-200/50 mb-4">
            <NotebookPen size={20} className="stroke-[2.5]" />
          </div>
          <h2 className="font-display font-bold text-2xl text-neutral-950">Create Account</h2>
          <p className="text-xs text-neutral-500 mt-1.5 font-sans">
            Start organizing your daily notes and ideas for free.
          </p>
        </div>

        {/* Sandbox indicator link */}
        {isDemoMode && (
          <div className="mb-6 p-3.5 rounded-xl bg-orange-50/70 border border-orange-100/80 text-[11px] text-orange-900 font-sans space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles size={12} className="text-orange-500 fill-orange-400 animate-pulse" />
              Developer Sandbox Active
            </div>
            <p className="text-orange-850">
              New accounts register instantly to local memory storage so you can test secure dashboard tabs immediately:
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

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading || success}
          className="w-full mb-5 py-3.5 bg-white hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        >
          {googleLoading ? (
            <Loader2 size={15} className="animate-spin text-neutral-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22-.04-.6z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335"/>
            </svg>
          )}
          <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
        </button>

        {/* Separator block */}
        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-neutral-150"></div>
          <span className="flex-shrink mx-4 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">or sign up with email</span>
          <div className="flex-grow border-t border-neutral-150"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
          {/* Name input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="text"
                required
                placeholder="Rahmat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>

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

          {/* Password inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200 rounded-xl py-3 pl-10 pr-10 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-650 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-neutral-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* Errors Alerts */}
          {error && (
            <div className="text-[11px] text-red-650 bg-red-50 border border-red-100 p-3 rounded-xl leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          {/* Success Alerts */}
          {success && (
            <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Account registered successfully! Mounting workspace...
            </div>
          )}

          {/* Register Submit button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 bg-neutral-900 hover:bg-blue-600 disabled:bg-neutral-200 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-neutral-900/5 cursor-pointer disabled:cursor-not-allowed transform active:scale-98 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Provisioning secure workstation...
              </>
            ) : (
              "Create My Free Account"
            )}
          </button>
        </form>

        {/* Footer toggles */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs">
          <span className="text-neutral-400">Already registered?</span>{" "}
          <button
            onClick={onNavigateToLogin}
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline bg-transparent border-0 cursor-pointer focus:outline-none"
          >
            Sign In Instead
          </button>
        </div>
      </div>
    </div>
  );
}
