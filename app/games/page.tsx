import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Games Corner — OneTeenOneTree",
  description: "Play fun eco-themed mini games. Start with Eco Tac-Toe!",
};

export default function GamesPage() {
  const games = [
    {
      slug: "eco-tac-toe",
      title: "Eco Tac-Toe",
      blurb: "Classic Tic-Tac-Toe reimagined with 🌱 vs ☀️",
      thumb: "/games/eco-thumb.png", // optional; create when you want
      ready: true,
      chip: "2 players",
    },
    {
      slug: "coming-soon-1",
      title: "Recycle Rush",
      blurb: "Sort waste into the right bins.",
      ready: false,
      chip: "Coming soon",
    },
    {
      slug: "coming-soon-2",
      title: "Tree Tycoon",
      blurb: "Grow a tiny forest sustainably.",
      ready: false,
      chip: "Coming soon",
    },
  ];

  return (
    <section className="py-12">
      <div className="container">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">🎮 Games Corner</h1>
          <p className="text-white/70 mt-2">
            Quick mini-games with a planet-friendly twist.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((g) => (
            <article
              key={g.slug}
              className={`group rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex flex-col hover:bg-white/[0.07] transition ${
                !g.ready ? "opacity-60" : ""
              }`}
            >
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                {g.thumb ? (
                  <Image
                    src={g.thumb}
                    alt={g.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="text-5xl">🌱☀️</div>
                )}
              </div>

              <div className="mt-4 flex-1">
                <h3 className="text-lg font-semibold">{g.title}</h3>
                <p className="text-white/70 text-sm mt-1">{g.blurb}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10">
                  {g.chip}
                </span>
                {g.ready ? (
                  <Link
                    href={`/games/${g.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition"
                  >
                    Play
                  </Link>
                ) : (
                  <span className="text-white/50 text-sm">Soon</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
