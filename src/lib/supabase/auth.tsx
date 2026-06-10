import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "./client";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  provider: "supabase" | "sandbox";
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; user: any }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null; user: any }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Shared memory for sandbox bypass
const LOCAL_USERS_KEY = "my_notes_sandbox_users";
const CURRENT_USER_KEY = "my_notes_sandbox_current_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  const supabase = getSupabaseClient();

  useEffect(() => {
    // 1. If Supabase keys are configured, listen to real session triggers
    if (isSupabaseConfigured && supabase) {
      setIsDemoMode(false);
      
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            createdAt: session.user.created_at,
            provider: "supabase",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      // Listen to changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            createdAt: session.user.created_at,
            provider: "supabase",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Local memory storage auth session simulation for developer sandbox mode
      setIsDemoMode(true);
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, [supabase]);

  // Handle actual signing up
  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) return { error: error.message, user: null };
        return { error: null, user: data.user };
      } else {
        // Local simulation
        const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        
        if (users.some((u: any) => u.email === email)) {
          return { error: "An account with this email address already exists in the local sandbox.", user: null };
        }

        const newUser: UserProfile = {
          id: `sand-user-${Date.now()}`,
          email,
          name,
          createdAt: new Date().toISOString(),
          provider: "sandbox",
        };

        users.push({ ...newUser, password }); // In sandbox we keep it simple
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        setUser(newUser);
        return { error: null, user: newUser };
      }
    } catch (e: any) {
      return { error: e.message || "An unexpected error occurred during sign up.", user: null };
    } finally {
      setLoading(false);
    }
  };

  // Handle real or simulated signing in
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { error: error.message, user: null };
        return { error: null, user: data.user };
      } else {
        // Local simulation lookup matches
        const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const foundUser = users.find((u: any) => u.email === email);

        if (!foundUser) {
          return { error: "No account found with this email in local sandbox. Please register first.", user: null };
        }
        if (foundUser.password !== password) {
          return { error: "Incorrect sandbox password. Please verify and retry.", user: null };
        }

        const loggedProfile: UserProfile = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          createdAt: foundUser.createdAt,
          provider: "sandbox",
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedProfile));
        setUser(loggedProfile);
        return { error: null, user: loggedProfile };
      }
    } catch (e: any) {
      return { error: e.message || "An unexpected error occurred during sign in.", user: null };
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth sign in
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) return { error: error.message };
        return { error: null };
      } else {
        // Local simulation / Sandbox Mocking
        const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        let foundUser = users.find((u: any) => u.email === "google-user@example.com");

        if (!foundUser) {
          foundUser = {
            id: `sand-google-${Date.now()}`,
            email: "google-user@example.com",
            name: "Google Sandbox User",
            createdAt: new Date().toISOString(),
            provider: "sandbox",
          };
          users.push(foundUser);
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
        }

        const loggedProfile: UserProfile = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          createdAt: foundUser.createdAt,
          provider: "sandbox",
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedProfile));
        setUser(loggedProfile);
        return { error: null };
      }
    } catch (e: any) {
      return { error: e.message || "An unexpected error occurred during Google Sign In." };
    } finally {
      setLoading(false);
    }
  };

  // Handle signing out
  const signOut = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) return { error: error.message };
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
      setUser(null);
      return { error: null };
    } catch (e: any) {
      return { error: e.message || "An error occurred signing out user." };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be nested inside an AuthProvider module.");
  }
  return context;
}
