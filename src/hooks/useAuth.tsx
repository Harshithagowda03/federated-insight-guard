/**
 * FedSecure AI - Authentication Hook
 * 
 * Uses Supabase authentication for secure user management.
 * 
 * @author FedSecure AI Team
 */

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// ============================================================
// Type Definitions
// ============================================================

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

// ============================================================
// Auth Context
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[FedSecure Auth] Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[FedSecure Auth] Initial session check:', session ? 'Found session' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Authenticates user with email and password.
   */
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      console.log('[FedSecure Auth] Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('[FedSecure Auth] Login failed:', error.message);
        return { error: new Error(error.message) };
      }

      console.log('[FedSecure Auth] Login successful for:', data.user?.email);
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('[FedSecure Auth] Login error:', message);
      return { error: new Error(message) };
    }
  };

  /**
   * Registers new user account.
   */
  const signUp = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      console.log('[FedSecure Auth] Attempting registration for:', email);

      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.log('[FedSecure Auth] Registration failed:', error.message);
        return { error: new Error(error.message) };
      }

      console.log('[FedSecure Auth] Registration successful for:', data.user?.email);
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('[FedSecure Auth] Registration error:', message);
      return { error: new Error(message) };
    }
  };

  /**
   * Signs out current user.
   */
  const signOut = async (): Promise<void> => {
    console.log('[FedSecure Auth] Signing out');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// Hook Export
// ============================================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
