// app/plant/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PlantForm from './plant-form'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Plant - OneTeenOneTree',
  description:
    'Submit your tree planting photos and videos for review and get verified impact credits.',
  openGraph: {
    title: 'Plant - OneTeenOneTree',
    description:
      'Submit your tree planting photos and videos for review and get verified impact credits.',
    url: '/plant',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function PlantPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/pledge')

  // Optional: require profile basics first
  const { data: profile } = await supabase
    .from('profiles')
    .select('name,country,state,city,school')
    .eq('id', user.id)
    .single()

  if (!profile?.name) redirect('/dashboard')

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0E1512]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <header className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            🌱 Submit Your Planting
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Upload <b>at least 1 video and 3 photos</b> of your planting. Your submission
            will be reviewed to prevent plagiarism. Once approved, you’ll earn badges and a certificate.
          </p>
        </header>

        <section className="mt-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            <PlantForm />
          </div>
        </section>
      </div>
    </div>
  )
}
