'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Icon from '@/components/Icon';

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
          <Icon name="lock" size={16} className="text-black/80" aria-hidden="true" />
          <span>Sign in</span>
        </>
      )}
    </Link>
  );
}
