import Image from "next/image";
import { fetchRssFeed } from "@/lib/rss";

export default async function BlogPage() {
  const feedUrl =
    process.env.CAMPUS_UNMUTED_RSS ||
    "https://campusunmuted.site/rss.xml";

  let items: any[] = [];
  try {
    items = await fetchRssFeed(feedUrl);
  } catch (e) {
    // silent fail for MVP
  }

  return (
    <section className="py-16">
      <div className="container">
        {/* --- Partnership header --- */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-6">
            <Image
              src="/brand/campusunmuted-logo.svg"
              alt="Campus Unmuted logo"
              width={100}
              height={100}
              className="rounded-xl bg-white/5 p-3 border border-white/10"
            />
          </div>

          <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight">
            Campus Unmuted × One Teen One Tree
          </h1>
          <p className="text-white/70 mt-3 text-lg leading-relaxed">
            Together, <b>One Teen One Tree</b> and <b>Campus Unmuted</b> empower students
            to share their <i>ideas, stories, and experiences</i> that inspire real
            environmental action. Your words can plant change — just like your trees.
          </p>
          <p className="text-white/60 mt-2">
            Read, write, and raise your voice for a greener future.
          </p>
        </div>

        {/* --- Feed --- */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-2">Latest from Campus Unmuted</h2>
          <p className="text-white/70 mb-6">
            Curated youth blogs streamed directly from our partner platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.length === 0 && (
              <div className="card">
                Couldn’t load the feed yet. Please check the RSS URL or try again later.
              </div>
            )}

            {items.map((post, idx) => (
              <a
                key={idx}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="card hover:bg-white/10 transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  {post.pubDate && (
                    <p className="text-white/50 text-xs mt-1">
                      {new Date(post.pubDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  {post.description && (
                    <p className="text-white/70 mt-2 line-clamp-3">
                      {post.description}
                    </p>
                  )}
                </div>

                <p className="mt-3 text-[var(--acc)] font-semibold">
                  Read on Campus Unmuted →
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* --- CTA --- */}
        <div className="mt-12 text-center">
          <a
            className="btn inline-flex items-center gap-2"
            href="https://campusunmuted.site"
            target="_blank"
            rel="noreferrer"
          >
            ✍️ Write on Campus Unmuted
          </a>
        </div>
      </div>
    </section>
  );
}