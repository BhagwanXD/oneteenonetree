import Image from 'next/image'
import { fetchRssFeed } from '@/lib/rss'

export default async function CampusUnmutedSection() {
  const cuItems = await (async () => {
    try {
      return await fetchRssFeed(
        process.env.CAMPUS_UNMUTED_RSS || 'https://campusunmuted.site/rss.xml'
      )
    } catch {
      return [] as { title: string; link: string; description?: string }[]
    }
  })()

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">From Campus Unmuted</h2>
          <p className="text-white/70 mt-3">
            <b>OneTeenOneTree</b> has partnered with <b>Campus Unmuted</b> to bring authentic{' '}
            <i>student voices</i> to the movement—read, write, and be heard.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
          <div className="text-center lg:text-left">
            <Image
              src="/brand/campusunmuted-logo.svg"
              alt="Campus Unmuted"
              width={180}
              height={180}
              className="mx-auto lg:mx-0 rounded-2xl border border-white/10 bg-white/5 p-5"
            />
            <ul className="text-sm text-white/70 mt-5 space-y-2">
              <li>🌍 Global student voices</li>
              <li>✍️ Easy, fast publishing</li>
              <li>🚀 Amplify impact with stories</li>
            </ul>
            <a
              href="https://www.campusunmuted.site"
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-5 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition"
            >
              Visit Campus Unmuted →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(cuItems?.slice(0, 3) ?? []).map((post: any, i: number) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition flex flex-col"
              >
                <div className="p-5 flex-1">
                  <h3 className="font-semibold group-hover:text-[var(--acc)] line-clamp-2">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-white/70 text-sm mt-2 line-clamp-3">
                      {post.description}
                    </p>
                  )}
                </div>
                <div className="px-5 py-3 text-xs text-white/50 border-t border-white/10 flex items-center gap-2">
                  <Image src="/brand/campusunmuted-mark.svg" alt="" width={16} height={16} />
                  campusunmuted.site →
                </div>
              </a>
            ))}
            {(!cuItems || cuItems.length === 0) &&
              [1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl h-44 bg-white/5 animate-pulse" />
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function CampusUnmutedSkeleton() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="h-9 w-72 mx-auto rounded-full bg-white/10 animate-pulse" />
        <div className="mt-3 h-4 w-96 mx-auto rounded-full bg-white/5 animate-pulse" />
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
          <div className="rounded-2xl border border-white/10 bg-white/5 h-56 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl h-44 bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
