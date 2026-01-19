'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useProfile } from '@/components/ProfileProvider'
import { useRouter } from 'next/navigation'

type Profile = {
  name: string | null
  country: string | null
  state: string | null
  city: string | null
  school: string | null
  role?: string | null
}

export default function ProfileForm({ initialProfile }: { initialProfile: Profile | null }) {
  const supabase = createClientComponentClient()
  const { refreshProfile } = useProfile()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState<'idle' | 'ok' | 'err'>('idle')

  const [name, setName] = useState(initialProfile?.name ?? '')
  const [country, setCountry] = useState(initialProfile?.country ?? '')
  const [stateVal, setStateVal] = useState(initialProfile?.state ?? '')
  const [city, setCity] = useState(initialProfile?.city ?? '')
  const [school, setSchool] = useState(initialProfile?.school ?? '')

  // ---- Geo data (countries -> states -> cities) ---------------------------
  type GeoState = { name: string; cities: string[] }
  type GeoCountry = { name: string; states: GeoState[] }
  const [geo, setGeo] = useState<{ countries: GeoCountry[] } | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/geo.json')
        if (!res.ok) return
        const data = (await res.json()) as { countries: GeoCountry[] }
        if (mounted) setGeo(data)
      } catch {}
    })()
    return () => {
      mounted = false
    }
  }, [])

  const statesOptions = useMemo(() => {
    const c = geo?.countries.find((x) => x.name === country)
    return c?.states?.map((s) => s.name) ?? []
  }, [geo, country])

  const citiesOptions = useMemo(() => {
    const c = geo?.countries.find((x) => x.name === country)
    const s = c?.states?.find((x) => x.name === stateVal)
    return s?.cities ?? []
  }, [geo, country, stateVal])

  // Sync if profile loads later (e.g., slow server)
  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name ?? '')
      setCountry(initialProfile.country ?? '')
      setStateVal(initialProfile.state ?? '')
      setCity(initialProfile.city ?? '')
      setSchool(initialProfile.school ?? '')
    }
  }, [initialProfile])

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved('idle');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaved('err'); setLoading(false); return;
    }

    const { error } = await supabase.rpc('upsert_profile', {
      p_name: name.trim() || null,
      p_country: country.trim() || null,
      p_state: stateVal.trim() || null,
      p_city: city.trim() || null,
      p_school: school.trim() || null,
    });

    if (error) {
      console.error('[upsert_profile]', error);
      setSaved('err');
    } else {
      await refreshProfile();   // from ProfileProvider
      router.refresh();         // refetch server components
      setSaved('ok');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-white/70">Full Name</span>
          <input
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-white/70">School</span>
          <input
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Your school"
          />
        </label>

        <label className="block">
          <span className="text-sm text-white/70">Country</span>
          <select
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              setStateVal('')
              setCity('')
            }}
            required
          >
            <option value="" disabled>
              Select country
            </option>
            {(geo?.countries ?? []).map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-white/70">State</span>
          <select
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            value={stateVal}
            onChange={(e) => {
              setStateVal(e.target.value)
              setCity('')
            }}
            required
            disabled={!country}
          >
            <option value="" disabled>
              {country ? 'Select state' : 'Select country first'}
            </option>
            {statesOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm text-white/70">City</span>
          <select
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            disabled={!stateVal}
          >
            <option value="" disabled>
              {stateVal ? 'Select city' : 'Select state first'}
            </option>
            {citiesOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn disabled:opacity-60">
          {loading ? 'Saving…' : 'Save profile'}
        </button>
        {saved === 'ok' && <span className="text-emerald-400 text-sm">Saved ✓</span>}
        {saved === 'err' && <span className="text-red-400 text-sm">Couldn’t save, try again</span>}
      </div>

      <p className="text-xs text-white/50">
        You can update these details anytime. Changes reflect across all pages instantly.
      </p>
    </form>
  )
}
