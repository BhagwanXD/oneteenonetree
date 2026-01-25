'use client'

import SupabaseProvider from '@/components/SupabaseProvider'
import ProfileProvider from '@/components/ProfileProvider'
import Header from '@/components/Header'
import NavigationPerf from '@/components/NavigationPerf'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ProfileProvider>
        <Header />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      </ProfileProvider>
      <NavigationPerf />
    </SupabaseProvider>
  )
}
