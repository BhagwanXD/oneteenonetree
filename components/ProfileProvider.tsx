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
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,country,state,city,school,role')
      .eq('id', user.id)
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
    } = supabase.auth.onAuthStateChange(() => {
      if (!active) return;
      fetchProfile();
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
  }, [fetchProfile, supabase]);

  const value = useMemo(
    () => ({ profile, loading, refreshProfile: fetchProfile }),
    [profile, loading, fetchProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
