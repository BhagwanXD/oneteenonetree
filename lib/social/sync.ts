import type { SupabaseClient } from '@supabase/supabase-js'

type SyncResult = {
  platform: 'instagram' | 'linkedin'
  imported: number
  skipped: number
  error?: string
  configured: boolean
}

export const syncInstagram = async (supabase: SupabaseClient): Promise<SyncResult> => {
  const token = process.env.INSTAGRAM_GRAPH_ACCESS_TOKEN
  if (!token) {
    return { platform: 'instagram', imported: 0, skipped: 0, configured: false }
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&limit=12&access_token=${token}`,
      { headers: { Accept: 'application/json' } }
    )
    if (!response.ok) {
      return {
        platform: 'instagram',
        imported: 0,
        skipped: 0,
        configured: true,
        error: `Instagram API error ${response.status}`,
      }
    }
    const payload = await response.json()
    const items = Array.isArray(payload?.data) ? payload.data : []

    const rows = items.map((item: any) => ({
      platform: 'instagram',
      url: item.permalink,
      title: item.caption ? item.caption.split('\n')[0].slice(0, 120) : null,
      description: item.caption ?? null,
      image_url: item.media_url ?? null,
      post_date: item.timestamp ?? null,
      published: true,
      source: 'auto',
      external_id: item.id ?? null,
    }))

    if (!rows.length) {
      return { platform: 'instagram', imported: 0, skipped: 0, configured: true }
    }

    const { data, error } = await supabase
      .from('social_posts')
      .upsert(rows, { onConflict: 'platform,external_id' })
      .select('id')

    if (error) {
      return {
        platform: 'instagram',
        imported: 0,
        skipped: rows.length,
        configured: true,
        error: error.message,
      }
    }

    return {
      platform: 'instagram',
      imported: data?.length ?? 0,
      skipped: Math.max(rows.length - (data?.length ?? 0), 0),
      configured: true,
    }
  } catch (err) {
    return {
      platform: 'instagram',
      imported: 0,
      skipped: 0,
      configured: true,
      error: err instanceof Error ? err.message : 'Instagram sync failed',
    }
  }
}

export const syncLinkedIn = async (supabase: SupabaseClient): Promise<SyncResult> => {
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  const orgId = process.env.LINKEDIN_ORG_ID
  if (!token || !orgId) {
    return { platform: 'linkedin', imported: 0, skipped: 0, configured: false }
  }

  try {
    const url =
      'https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:organization:' +
      orgId +
      ')&sortBy=LAST_MODIFIED&count=12'
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0',
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return {
        platform: 'linkedin',
        imported: 0,
        skipped: 0,
        configured: true,
        error: `LinkedIn API error ${response.status}`,
      }
    }

    const payload = await response.json()
    const items = Array.isArray(payload?.elements) ? payload.elements : []

    const rows = items.map((item: any) => {
      const urn = item?.id || ''
      const commentary =
        item?.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || ''
      const media =
        item?.specificContent?.['com.linkedin.ugc.ShareContent']?.media?.[0]?.originalUrl || null
      const timestamp = item?.created?.time ? new Date(item.created.time).toISOString() : null
      const permalink = urn
        ? `https://www.linkedin.com/feed/update/${urn}`
        : item?.specificContent?.['com.linkedin.ugc.ShareContent']?.shareMediaCategory
      return {
        platform: 'linkedin',
        url: permalink || '',
        title: commentary ? commentary.split('\n')[0].slice(0, 120) : null,
        description: commentary || null,
        image_url: media,
        post_date: timestamp,
        published: true,
        source: 'auto',
        external_id: urn || null,
      }
    })

    const filtered = rows.filter((row: any) => row.url)
    if (!filtered.length) {
      return { platform: 'linkedin', imported: 0, skipped: 0, configured: true }
    }

    const { data, error } = await supabase
      .from('social_posts')
      .upsert(filtered, { onConflict: 'platform,external_id' })
      .select('id')

    if (error) {
      return {
        platform: 'linkedin',
        imported: 0,
        skipped: filtered.length,
        configured: true,
        error: error.message,
      }
    }

    return {
      platform: 'linkedin',
      imported: data?.length ?? 0,
      skipped: Math.max(filtered.length - (data?.length ?? 0), 0),
      configured: true,
    }
  } catch (err) {
    return {
      platform: 'linkedin',
      imported: 0,
      skipped: 0,
      configured: true,
      error: err instanceof Error ? err.message : 'LinkedIn sync failed',
    }
  }
}
