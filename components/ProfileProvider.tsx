'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';

export type Profile = {
  id?: string;
  name?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  school?: string | null;
  role?: string | null; // 'admin' | 'user' | null
};

type ProfileContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userOverride?: User | null) => {
    setLoading(true);
    const resolvedUser =
      userOverride ?? (await supabase.auth.getUser()).data.user ?? null;

    setUser(resolvedUser);

    if (!resolvedUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,country,state,city,school,role')
      .eq('id', resolvedUser.id)
      .maybeSingle(); // <- avoids throw if the row hasn't been created yet

    if (error) {
      // optional: console.error('[ProfileProvider] load error:', error);
    }

    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let active = true;

    // initial load
    fetchProfile();

    // keep in sync with auth changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      fetchProfile(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, supabase]);

  // Realtime subscription to this user's profile row
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    (async () => {
      if (!user || cancelled) return;

      channel = supabase
        .channel('profiles_realtime')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` } as any,
          (payload) => setProfile(payload.new as Profile)
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` } as any,
          (payload) => setProfile(payload.new as Profile)
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` } as any,
          () => setProfile(null)
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const value = useMemo(
    () => ({ user, profile, loading, refreshProfile: fetchProfile }),
    [user, profile, loading, fetchProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
