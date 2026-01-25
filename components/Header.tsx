'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SignInButton from '@/app/pledge/SignInButton';
import { useProfile } from '@/components/ProfileProvider';
import { accountNavItems, filterAccountItems, publicNavItems } from '@/lib/navigation';
import Icon from '@/components/Icon';
import { markNavClick } from '@/components/NavigationPerf';
import type { IconName } from '@/components/icons';

type MoreMenuItem = {
  label: string;
  href: string;
  icon: IconName;
};

type MoreMenuGroup = {
  label: string;
  items: MoreMenuItem[];
};

const moreMenuGroups: MoreMenuGroup[] = [
  {
    label: 'Community',
    items: [
      { label: 'Our Team', href: '/our-team', icon: 'groups' },
      { label: 'Leaderboard', href: '/leaderboard', icon: 'leaderboard' },
      { label: 'Social', href: '/social', icon: 'share' },
    ],
  },
  {
    label: 'Impact',
    items: [
      { label: 'Gallery', href: '/gallery', icon: 'camera' },
      { label: 'Blog', href: '/blog', icon: 'article' },
      { label: 'Press', href: '/press', icon: 'newspaper' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'FAQ', href: '/faq', icon: 'help' },
      { label: 'Contact', href: '/contact', icon: 'mail' },
    ],
  },
  {
    label: 'Extras',
    items: [
      { label: 'Create', href: '/create', icon: 'edit' },
      { label: 'Games', href: '/games', icon: 'games' },
    ],
  },
] as const;


const NavLink = ({
  href,
  children,
  onClick,
  onPrefetch,
  isActive,
  prefetch = true,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  onPrefetch?: (href: string) => void;
  isActive?: boolean;
  prefetch?: boolean;
}) => {
  const pathname = usePathname();
  const active = isActive ?? pathname === href;
  return (
    <Link
      href={href}
      prefetch={prefetch}
      onClick={onClick}
      onMouseEnter={() => onPrefetch?.(href)}
      onFocus={() => onPrefetch?.(href)}
      className={`px-3 py-1.5 rounded-xl transition-colors ${
        active ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
      } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]`}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const moreMenuCloseTimer = useRef<number | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const prefetched = useRef(new Set<string>());

  const { profile, loading: profileLoading, user } = useProfile();

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

  const role = profile?.role ?? null;
  const primaryItems = publicNavItems.filter((item) => item.desktop === 'primary');
  const moreMenuItems = moreMenuGroups.flatMap((group) => group.items);
  const showMoreActive = moreMenuItems.some((item) => item.href === pathname);
  const accountItems = filterAccountItems({ items: accountNavItems, isAuthed: !!user, role });
  const resolveHref = (href: string) =>
    href === '/plant' && !user ? (profileLoading ? '/plant' : '/pledge') : href;

  const handleCloseMenus = () => {
    setIsMoreOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleNavClick = (href: string, cb?: () => void) => () => {
    markNavClick(href);
    cb?.();
  };

  const prefetchRoute = useCallback((href: string) => {
    if (!href || href.startsWith('http')) return;
    if (href.startsWith('/admin')) return;
    if (prefetched.current.has(href)) return;
    prefetched.current.add(href);
    router.prefetch(href);
  }, [router]);

  useEffect(() => {
    const coreRoutes = [
      '/',
      '/about',
      '/pledge',
      '/plant',
      '/donate',
      '/gallery',
      '/insights',
      '/faq',
      '/contact',
      '/leaderboard',
    ];
    const navRoutes = [
      ...publicNavItems.map((item) => item.href),
      ...moreMenuGroups.flatMap((group) => group.items.map((item) => item.href)),
    ];
    const uniqueRoutes = Array.from(new Set([...coreRoutes, ...navRoutes]));
    uniqueRoutes.forEach((href) => prefetchRoute(href));
  }, [prefetchRoute]);

  const openMoreMenu = () => {
    if (moreMenuCloseTimer.current) {
      window.clearTimeout(moreMenuCloseTimer.current);
      moreMenuCloseTimer.current = null;
    }
    setIsMoreOpen(true);
  };

  const scheduleCloseMoreMenu = () => {
    if (moreMenuCloseTimer.current) {
      window.clearTimeout(moreMenuCloseTimer.current);
    }
    moreMenuCloseTimer.current = window.setTimeout(() => {
      setIsMoreOpen(false);
      moreMenuCloseTimer.current = null;
    }, 140);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node) &&
        isMoreOpen
      ) {
        setIsMoreOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        isUserMenuOpen
      ) {
        setIsUserMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (moreMenuCloseTimer.current) {
        window.clearTimeout(moreMenuCloseTimer.current);
      }
    };
  }, [isMoreOpen, isUserMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)] border-b border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
      <div className="container flex items-center justify-between h-16">
        {/* Left: logo + title */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="OneTeenOneTree logo"
            width={36}
            height={36}
            sizes="36px"
            className="rounded-lg"
            priority
          />
          <span className="text-white font-semibold tracking-tight text-base md:text-lg">
            OneTeenOneTree
          </span>
        </Link>

        {/* Center: nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {primaryItems.map((item) => {
            const href = resolveHref(item.href);
            return (
            <NavLink
              key={item.href}
              href={href}
              isActive={pathname === item.href}
              onClick={handleNavClick(href)}
              onPrefetch={prefetchRoute}
              prefetch
            >
              {item.label}
            </NavLink>
          )})}

          <div
            className="relative"
            ref={moreMenuRef}
            onMouseEnter={openMoreMenu}
            onMouseLeave={scheduleCloseMoreMenu}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isMoreOpen}
              aria-controls="more-menu"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                showMoreActive || isMoreOpen
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                More
                <Icon
                  name="chevronDown"
                  size={16}
                  className={`transition ${isMoreOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            {isMoreOpen && (
              <div
                id="more-menu"
                role="menu"
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[var(--bg)] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
                onMouseEnter={openMoreMenu}
                onMouseLeave={scheduleCloseMoreMenu}
              >
                <div className="space-y-3">
                  {moreMenuGroups.map((group, index) => (
                    <div key={group.label}>
                      <p className="text-[11px] uppercase tracking-wider text-white/50">
                        {group.label}
                      </p>
                      <div className="mt-2 grid gap-1">
                        {group.items.map((item) => {
                          const href = resolveHref(item.href)
                          const active = pathname === item.href
                          return (
                          <Link
                            key={item.href}
                            href={href}
                            prefetch
                            role="menuitem"
                            onClick={handleNavClick(href, () => setIsMoreOpen(false))}
                            onMouseEnter={() => prefetchRoute(href)}
                            onFocus={() => prefetchRoute(href)}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] ${
                              active
                                ? 'bg-white/10 text-white'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Icon name={item.icon} size={16} className="text-white/60" aria-hidden="true" />
                            {item.label}
                          </Link>
                        )})}
                      </div>
                      {index < moreMenuGroups.length - 1 ? (
                        <div className="mt-3 h-px bg-white/10" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: auth */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
            aria-label="Open navigation menu"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen(true)}
          >
            <Icon name="menu" size={18} aria-hidden="true" />
          </button>
          {profileLoading ? (
            <span className="text-white/60 text-sm">…</span>
          ) : user ? (
            <div className="relative hidden lg:block" ref={userMenuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-controls="user-menu"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                <Icon name="user" size={16} className="text-white/70" aria-hidden="true" />
                {profileLoading ? 'Hi…' : displayName || 'Account'}
                <Icon
                  name="chevronDown"
                  size={16}
                  className={`transition ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {isUserMenuOpen && (
                <div
                  id="user-menu"
                  role="menu"
                  className="absolute right-0 mt-2 w-44 rounded-2xl border border-white/10 bg-[var(--bg)] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
                >
                  {accountItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:block">
              <SignInButton className="btn" />
            </div>
          )}
        </div>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[var(--bg)] border-l border-white/10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold text-lg">Menu</span>
              <button
                type="button"
                className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon name="close" size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-sm">
              {(['explore', 'community', 'resources'] as const).map((section) => {
                const sectionItems = publicNavItems.filter((item) => item.section === section);
                return (
                  <div key={section}>
                    <p className="text-xs uppercase tracking-wider text-white/50">
                      {section === 'explore'
                        ? 'Explore'
                        : section === 'community'
                          ? 'Community'
                          : 'Resources'}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {sectionItems.map((item) => {
                        const href = resolveHref(item.href)
                        return (
                        <NavLink
                          key={item.href}
                          href={href}
                          isActive={pathname === item.href}
                          onClick={handleNavClick(href, () => {
                            setIsMobileOpen(false);
                            handleCloseMenus();
                          })}
                          onPrefetch={prefetchRoute}
                          prefetch
                        >
                          {item.label}
                        </NavLink>
                      )})}
                    </div>
                  </div>
                );
              })}

              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Account</p>
                <div className="mt-3 grid gap-2">
                  {user ? (
                    <>
                      {accountItems.map((item) => (
                        <NavLink
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          onPrefetch={prefetchRoute}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileOpen(false);
                          handleSignOut();
                        }}
                        className="btn justify-center"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <SignInButton className="btn justify-center" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
