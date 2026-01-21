'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

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

  return (
    <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className={className}>
      {children ?? (
        <>
          <span className="mr-2">🔐</span> Sign in
        </>
      )}
    </Link>
  );
}
