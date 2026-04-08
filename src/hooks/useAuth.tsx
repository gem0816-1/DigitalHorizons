import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { User } from '@supabase/supabase-js';

import { supabase, supabaseConfigError } from '@/lib/supabase';
import type { AppUser } from '@/types/auth';

export interface AuthActionResult {
  error?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapAuthUser(user: User | null): AppUser | null {
  if (!user?.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) {
          return;
        }

        if (error) {
          setUser(null);
          return;
        }

        setUser(mapAuthUser(data.session?.user ?? null));
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapAuthUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
    if (!supabase) {
      return { error: supabaseConfigError };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      setUser(mapAuthUser(data.user));
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign in failed.' };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
    if (!supabase) {
      return { error: supabaseConfigError };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (!data.session) {
        return { error: 'Please verify your email before signing in.' };
      }

      setUser(mapAuthUser(data.session.user));
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign up failed.' };
    }
  }, []);

  const signOut = useCallback(async (): Promise<AuthActionResult> => {
    if (!supabase) {
      setUser(null);
      return {};
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: error.message };
      }

      setUser(null);
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign out failed.' };
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [loading, signIn, signOut, signUp, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
