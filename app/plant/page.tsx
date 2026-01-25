import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PlantForm from './plant-form'
import PlantGuard from './PlantGuard'
import PageShell from '@/components/site/PageShell'
import PageHeader from '@/components/site/PageHeader'
import Icon from '@/components/Icon'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('name,country,state,city,school')
    .eq('id', user.id)
    .single()

  if (!profile?.name) redirect('/dashboard')

  return (
    <PlantGuard initiallyAuthed>
      <PageShell
        header={
          <PageHeader
            title="Submit your planting"
            description="Upload at least 1 video and 3 photos of your planting. Your submission will be reviewed to prevent plagiarism."
            icon={<Icon name="eco" size={22} aria-hidden="true" />}
          />
        }
      >
        <section className="max-w-4xl mx-auto">
          <div className="card p-6 md:p-8">
            <PlantForm />
          </div>
        </section>
      </PageShell>
    </PlantGuard>
  )
}
