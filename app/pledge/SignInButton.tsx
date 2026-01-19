'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SignInButton({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const search = useSearchParams();
  const nextOverride = search?.get('next');
  const nextPath =
    nextOverride ||
    (search?.toString() ? `${pathname}?${search}` : pathname || '/');

  const handleSignIn = async () => {
    const supabase = createClientComponentClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, queryParams: { prompt: 'select_account' } },
    });
  };

  return (
    <button onClick={handleSignIn} className={className}>
      {children ?? (
        <>
          <span className="mr-2">🔐</span> Sign in with Google
        </>
      )}
    </button>
  );
}
