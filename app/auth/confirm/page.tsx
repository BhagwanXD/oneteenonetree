'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Confirm() {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange(() => {
      // When session is set, go home (or dashboard)
      window.location.replace('/');
    });
  }, []);
  return <p>Signing you in…</p>;
}