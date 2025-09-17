import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userData: any, redirectUrl?: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any, customRedirectUrl?: string) => {
    try {
      // First try to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: userData,
          emailRedirectTo: customRedirectUrl || `${window.location.origin}/`
        }
      });
      
      // If user already exists, try to sign them in directly
      if (error?.message?.includes('already registered') || error?.message?.includes('User already registered')) {
        console.log('User exists, attempting sign in...');
        const signInResult = await signIn(email, password);
        return { data: signInResult.data || null, error: signInResult.error };
      }
      
      // If signup was successful but user needs confirmation, auto-sign them in
      if (data?.user && error?.message?.includes('signup disabled')) {
        console.log('Signup disabled, trying sign in...');
        const signInResult = await signIn(email, password);
        return { data: signInResult.data || null, error: signInResult.error };
      }
      
      // For successful signup, immediately try to sign in to bypass email confirmation
      if (data?.user && !error) {
        console.log('User created, attempting immediate sign in...');
        const signInResult = await signIn(email, password);
        if (signInResult.data) {
          return { data: signInResult.data, error: null };
        }
      }
      
      return { data, error };
    } catch (err: any) {
      console.error('SignUp error:', err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      return { data, error };
    } catch (err: any) {
      console.error('SignIn error:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};