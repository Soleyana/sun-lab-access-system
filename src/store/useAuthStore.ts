import { create } from 'zustand';
import { supabase } from '@/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';

type AuthUser = User & {
  role?: string;
};

interface SignUpData {
  email: string;
  password: string;
  options?: {
    data: {
      name: string;
      role: string;
    };
  };
}

interface SignInData {
  email: string;
  password: string;
}

type AuthResponse = {
  data: {
    user: AuthUser | null;
    session: Session | null;
  };
  error: AuthError | null;
};

type AuthStore = {
  user: AuthUser | null;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signIn: (data: SignInData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  signUp: async (data: SignUpData) => {
    const response = await supabase.auth.signUp(data);
    if (response.data.user) {
      set({ user: response.data.user as AuthUser });
    }
    return response;
  },
  signIn: async (data: SignInData) => {
    const response = await supabase.auth.signInWithPassword(data);
    if (response.data.user) {
      set({ user: response.data.user as AuthUser });
    }
    return response;
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  setUser: (user) => set({ user }),
}));

// Initialize the auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    useAuthStore.getState().setUser(session.user as AuthUser);
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    useAuthStore.getState().setUser(session.user as AuthUser);
  } else {
    useAuthStore.getState().setUser(null);
  }
});
