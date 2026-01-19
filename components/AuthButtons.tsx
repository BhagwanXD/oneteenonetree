"use client";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function GoogleSignInButton() {
  const signIn = async () => {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
  };
  return <button onClick={signIn}>Continue with Google</button>;
}

export function SignOutButton() {
  const router = useRouter();
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };
  return <button onClick={signOut}>Sign out</button>;
}
