'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SignInButton from '@/app/pledge/SignInButton';
import type { User } from '@supabase/supabase-js';
import { useProfile } from '@/components/ProfileProvider';


const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-xl transition-colors ${
        active ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  // ← NEW: live profile from our DB
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) {
        setUser(data.user ?? null);
        setAuthLoading(false);
      }
    })();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Avoid full reload; refresh data and UI
    router.refresh();
  };

  // Prefer Dashboard name → then Google name → then email prefix
  const displayName = (
    profile?.name?.trim() ||
    (user?.user_metadata?.name as string | undefined) ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    ''
  )
    .split(' ')[0]; // show first name only

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[var(--bg)]/70 border-b border-white/10">
      <div className="container flex items-center justify-between h-16">
        {/* Left: logo + title */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="OneTeenOneTree logo"
            width={36}
            height={36}
            className="rounded-lg"
            priority
          />
          <span className="text-white font-semibold tracking-tight text-base md:text-lg">
            OneTeenOneTree<span className="text-white/60 text-sm font-normal">.org</span>
          </span>
        </Link>

        {/* Center: nav */}
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/pledge">Pledge</NavLink>
          <NavLink href="/plant">Plant</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
          <NavLink href="/social">Social</NavLink>
          <NavLink href="/games">Games</NavLink>
          {/* Show Dashboard once logged-in */}
          {user && <NavLink href="/dashboard">Dashboard</NavLink>}
          {/* Show Admin only for admin role */}
          {profile?.role === 'admin' && <NavLink href="/admin/review">Admin</NavLink>}
        </nav>

        {/* Right: auth */}
        <div className="flex items-center gap-3">
          {authLoading ? (
            <span className="text-white/60 text-sm">…</span>
          ) : user ? (
            <>
              <span className="text-white/70 text-sm hidden md:inline">
                {profileLoading ? 'Hi…' : `Hi, ${displayName || 'User'}`}
              </span>
              <button className="btn" onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <SignInButton className="btn" />
          )}
        </div>
      </div>
    </header>
  );
}
