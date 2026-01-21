import type { SupabaseClient, User } from '@supabase/supabase-js'

export const ensureProfile = async (supabase: SupabaseClient, user: User) => {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (existing?.id) return

  const nameFromMetadata =
    (user.user_metadata?.name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined)
  const name = nameFromMetadata || user.email?.split('@')[0] || null

  await supabase.from('profiles').insert({
    id: user.id,
    role: 'user',
    name,
  })
}
