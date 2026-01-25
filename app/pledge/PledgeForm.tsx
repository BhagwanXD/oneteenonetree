'use client';

import { useEffect, useState } from 'react';
import useNavigateWithLoader from '@/components/site/useNavigateWithLoader';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useProfile } from '@/components/ProfileProvider';

export default function PledgeForm({ userId }: { userId: string }) {
  const supabase = createClientComponentClient();
  const { push } = useNavigateWithLoader();
  const { profile, loading } = useProfile();

  const [trees, setTrees] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    if (!profile?.name || !profile?.country || !profile?.state || !profile?.city || !profile?.school) {
      setSubmitting(false);
      setStatus({
        ok: false,
        msg: 'Please complete your profile first in the Dashboard.',
      });
      return;
    }

    const payload = {
      user_id: userId,
      // do not persist name; always read from profiles
      trees: Math.max(1, Number(trees) || 1),
      country: profile.country,
      state: profile.state,
      city: profile.city,
      school: profile.school,
    };

    const { error } = await supabase.from('pledges').insert([payload]);
    setSubmitting(false);
    if (error) setStatus({ ok: false, msg: error.message });
    else {
      setStatus({ ok: true, msg: 'Thank you! Redirecting…' });
      setTrees(1);
      // Navigate immediately without artificial delay
      push('/pledge/success');
    }
  };

  if (loading)
    return (
      <div className="text-center py-12 text-white/60">Loading your profile…</div>
    );

  return (
    <section className="mx-auto max-w-3xl w-full">
      <div className="card md:p-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Make your pledge
        </h2>

        {!profile ? (
          <div className="text-center text-white/70">
            Please fill out your profile first on your{' '}
            <a href="/dashboard" className="text-[var(--acc)] underline">
              Dashboard
            </a>
            .
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div className="text-white/80 text-sm bg-white/5 rounded-xl p-4 border border-white/10">
              <p>
                <b>Name:</b> {profile.name}
              </p>
              <p>
                <b>School:</b> {profile.school}
              </p>
              <p>
                <b>Location:</b> {profile.city}, {profile.state}, {profile.country}
              </p>
              <p className="text-[var(--acc)] mt-1">
                (Edit these anytime from your{' '}
                <a href="/dashboard" className="underline">
                  Dashboard
                </a>
                )
              </p>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                Trees to pledge
              </label>
              <input
                type="number"
                min={1}
                value={trees}
                onChange={(e) => setTrees(Number(e.target.value))}
                className="w-full rounded-xl bg-white/[0.08] text-white placeholder-white/50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 border border-white/10"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={submitting}
                className="rounded-xl px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/30 disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Pledge'}
              </button>
              {status && (
                <span
                  className={
                    status.ok ? 'text-emerald-400' : 'text-red-400'
                  }
                >
                  {status.msg}
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
