import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function PledgeStats() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const { data: pledges, error } = await supabase
    .from('pledges')
    .select(`
      id,
      user_id,
      trees,
      school,
      city,
      state,
      country,
      created_at,
      profiles ( name )
    `)
    .order('created_at', { ascending: false })

  const total = pledges?.length ?? 0
  const trees = pledges?.reduce((a, p) => a + (p.trees || 0), 0) ?? 0
  const countries = new Set((pledges ?? []).map(p => (p.country || '').trim().toLowerCase())).size

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Live stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Pledges" value={total} />
        <StatCard label="Total Trees" value={trees} />
        <StatCard label="Countries" value={countries} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.06] text-white/80">
            <tr>
              <Th>Name</Th>
              <Th>Trees</Th>
              <Th>Location</Th>
              <Th>School</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody className="text-white/90">
            {(pledges ?? []).slice(0, 25).map((p: any) => {
              const name = p?.profiles?.name ?? '—'
              return (
                <tr key={p.id} className="border-t border-white/10">
                  <Td>{name}</Td>
                  <Td className="text-center">{p.trees}</Td>
                  <Td>{[p.city, p.state, p.country].filter(Boolean).join(', ')}</Td>
                  <Td>{p.school}</Td>
                  <Td>{new Date(p.created_at).toLocaleDateString()}</Td>
                </tr>
              )
            })}
            {total === 0 && (
              <tr>
                <Td colSpan={5} className="text-center text-white/60 py-6">
                  No pledges yet. Be the first!
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <div className="text-white/60 text-sm">{label}</div>
      <div className="text-2xl font-semibold text-white mt-1">{value.toLocaleString()}</div>
    </div>
  )
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-medium px-3 py-2">{children}</th>
}
function Td({ children, className = '', colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={`px-3 py-2 ${className}`}>{children}</td>
}
