"use client";

import { useEffect, useMemo, useState } from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

type SocialPost = {
  id: string;
  platform: "instagram" | "linkedin";
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  post_date: string | null;
  created_at: string;
};

const platformConfig = {
  instagram: {
    label: "Instagram",
    icon: <FaInstagram className="text-base" />,
    badge: "border-pink-500/40 bg-pink-600/20 text-pink-200",
  },
  linkedin: {
    label: "LinkedIn",
    icon: <FaLinkedin className="text-base" />,
    badge: "border-sky-500/40 bg-sky-600/20 text-sky-200",
  },
};

const PAGE_SIZE = 9;

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDisplayDate = (post: SocialPost) =>
  formatDate(post.post_date || post.created_at);

export default function SocialClient({
  initialPosts,
}: {
  initialPosts: SocialPost[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [postsByFilter, setPostsByFilter] = useState<Record<string, SocialPost[]>>({
    all: initialPosts,
  });
  const [offsetByFilter, setOffsetByFilter] = useState<Record<string, number>>({
    all: initialPosts.length,
  });
  const [hasMoreByFilter, setHasMoreByFilter] = useState<Record<string, boolean>>({
    all: initialPosts.length >= PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);

  const currentPosts = postsByFilter[activeFilter] ?? [];
  const hasMore = hasMoreByFilter[activeFilter] ?? false;

  const filters = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "instagram", label: "Instagram" },
      { key: "linkedin", label: "LinkedIn" },
    ],
    []
  );

  const fetchPosts = async (filter: string, offset: number, limit: number) => {
    const params = new URLSearchParams();
    params.set("offset", String(offset));
    params.set("limit", String(limit));
    if (filter === "instagram" || filter === "linkedin") {
      params.set("platform", filter);
    }
    const res = await fetch(`/api/social?${params.toString()}`);
    if (!res.ok) return [];
    const payload = await res.json();
    return Array.isArray(payload.posts) ? payload.posts : [];
  };

  useEffect(() => {
    if (activeFilter === "all") return;
    if (postsByFilter[activeFilter]) return;
    setLoading(true);
    fetchPosts(activeFilter, 0, PAGE_SIZE)
      .then((posts) => {
        setPostsByFilter((prev) => ({ ...prev, [activeFilter]: posts }));
        setOffsetByFilter((prev) => ({ ...prev, [activeFilter]: posts.length }));
        setHasMoreByFilter((prev) => ({
          ...prev,
          [activeFilter]: posts.length >= PAGE_SIZE,
        }));
      })
      .finally(() => setLoading(false));
  }, [activeFilter, postsByFilter]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const offset = offsetByFilter[activeFilter] ?? 0;
    const posts = await fetchPosts(activeFilter, offset, PAGE_SIZE);
    setPostsByFilter((prev) => ({
      ...prev,
      [activeFilter]: [...(prev[activeFilter] ?? []), ...posts],
    }));
    setOffsetByFilter((prev) => ({
      ...prev,
      [activeFilter]: offset + posts.length,
    }));
    setHasMoreByFilter((prev) => ({
      ...prev,
      [activeFilter]: posts.length >= PAGE_SIZE,
    }));
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Social
          </h1>
          <p className="text-white/70 mt-3 max-w-2xl mx-auto">
            Highlights from OneTeenOneTree across Instagram and LinkedIn.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {filters.map((filter) => {
              const selected = filter.key === activeFilter;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  aria-pressed={selected}
                  className={`w-20 sm:w-24 aspect-square rounded-2xl border text-xs sm:text-sm font-semibold tracking-tight grid place-items-center text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] ${
                    selected
                      ? "border-emerald-400/60 bg-emerald-600/20 text-emerald-200 shadow-[0_0_12px_rgba(0,208,132,0.2)]"
                      : "border-white/15 bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {currentPosts.length === 0 && !loading ? (
            <div className="card text-center max-w-xl mx-auto space-y-4">
              <h2 className="text-2xl font-semibold">No posts yet.</h2>
              <p className="text-white/70">
                Check back soon for the latest Instagram and LinkedIn updates.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post) => {
                  const platform = platformConfig[post.platform];
                  const dateLabel = getDisplayDate(post);
                  return (
                    <div key={post.id} className="card flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${platform.badge}`}
                        >
                          {platform.icon}
                          {platform.label}
                        </span>
                        {dateLabel ? (
                          <span className="text-xs text-white/50">{dateLabel}</span>
                        ) : null}
                      </div>

                      {post.image_url ? (
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          <img
                            src={post.image_url}
                            alt=""
                            className="h-40 w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-40 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-white/5 flex items-center justify-center text-white/50 text-sm">
                          Preview unavailable
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white line-clamp-2">
                          {post.title || `${platform.label} post`}
                        </h3>
                        {post.description ? (
                          <p className="text-sm text-white/70 line-clamp-2">
                            {post.description}
                          </p>
                        ) : null}
                      </div>

                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn justify-center"
                      >
                        View post
                      </a>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-center">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loading}
                    className="btn justify-center"
                  >
                    {loading ? "Loading..." : "Load more"}
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
