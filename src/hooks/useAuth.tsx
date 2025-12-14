/**
 * FedSecure AI - Authentication Hook
 * 
 * Uses Flask backend JWT authentication instead of Supabase.
 * Manages user session with localStorage token storage.
 * 
 * @author FedSecure AI Team
 * @course MCA Cybersecurity Project
 */

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

// ============================================================
// Type Definitions
// ============================================================

interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

interface AuthResponse {
  success: boolean;
  message: string;
  access_token?: string;
  user?: AuthUser;
  error?: string;
}

// ============================================================
// Configuration
// ============================================================

// Backend API URL - matches Flask server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Token storage key
const TOKEN_KEY = 'fedsecure_auth_token';
const USER_KEY = 'fedsecure_user';

// ============================================================
// Helper Functions
// ============================================================

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function getStoredUser(): AuthUser | null {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

function storeAuth(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ============================================================
// Auth Context
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        // Verify token is still valid by calling /api/auth/me
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser({ email: userData.email, name: userData.name });
            console.log('[FedSecure Auth] Session restored for:', userData.email);
          } else {
            // Token invalid or expired - clear storage
            console.log('[FedSecure Auth] Token expired, clearing session');
            clearAuth();
            setUser(null);
          }
        } catch (error) {
          // Backend might be offline - keep user logged in with stored data
          console.log('[FedSecure Auth] Backend offline, using stored session');
          setUser(storedUser);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Authenticates user with email and password.
   * On success, stores JWT token and user info.
   */
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      console.log('[FedSecure Auth] Attempting login for:', email);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.error || data.message || 'Login failed';
        console.log('[FedSecure Auth] Login failed:', errorMessage);
        return { error: new Error(errorMessage) };
      }

      // Store token and user data
      if (data.access_token && data.user) {
        storeAuth(data.access_token, data.user);
        setUser(data.user);
        console.log('[FedSecure Auth] Login successful for:', data.user.email);
      }

      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error - backend may be offline';
      console.error('[FedSecure Auth] Login error:', message);
      return { error: new Error(message) };
    }
  };

  /**
   * Registers new user account.
   * On success, automatically logs in the user.
   */
  const signUp = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      console.log('[FedSecure Auth] Attempting registration for:', email);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.error || data.message || 'Registration failed';
        console.log('[FedSecure Auth] Registration failed:', errorMessage);
        return { error: new Error(errorMessage) };
      }

      // Store token and user data (auto-login after registration)
      if (data.access_token && data.user) {
        storeAuth(data.access_token, data.user);
        setUser(data.user);
        console.log('[FedSecure Auth] Registration successful for:', data.user.email);
      }

      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error - backend may be offline';
      console.error('[FedSecure Auth] Registration error:', message);
      return { error: new Error(message) };
    }
  };

  /**
   * Signs out current user.
   * Clears stored token and user data.
   */
  const signOut = async (): Promise<void> => {
    console.log('[FedSecure Auth] Signing out');
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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

/**
 * Gets stored auth token for API calls.
 * Use this in API service for protected endpoints.
 */
export function getAuthToken(): string | null {
  return getStoredToken();
}
