'use client'

import { motion } from 'framer-motion'
import Reveal from '@/components/Reveal'

/* ---------- Small icon card ---------- */
function StatIcon({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
        <span
          className="absolute inset-0 rounded-2xl blur-md opacity-40"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(0,208,132,0.45) 0%, rgba(0,208,132,0) 100%)',
          }}
        />
        {children}
      </div>
      <div className="font-medium">{label}</div>
    </div>
  )
}

export default function AboutContent() {
  return (
    <section className="space-y-16">
      <Reveal>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/70">
            Launched in <b>August 2025</b> with one simple idea: if every <b>teen plants one tree</b>, the world changes
            quietly — street by street, school by school, city by city.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">What makes us different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold">Verified plantations</h3>
            <p className="text-white/70 mt-1">
              We review proof submissions so every tree logged is real, cared for, and accountable.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold">Student-led chapters</h3>
            <p className="text-white/70 mt-1">
              Teens lead local drives in schools and communities, turning climate intent into visible action.
            </p>
          </div>
        </div>
        </div>
      </Reveal>

      {/* Impact (Projected, compact, 3-line layout) */}
      <Reveal>
        <section className="max-w-5xl mx-auto">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* 1 */}
            <li className="metric">
              <p className="metric-kicker">IF 1,000,000 TEENS PLANT</p>
              <p className="metric-value whitespace-nowrap">1,000,000+</p>
              <p className="metric-label">
                Trees Planted <span className="text-white/50">(Projected)</span>
              </p>
            </li>

            {/* 2 */}
            <li className="metric">
              <p className="metric-kicker">ESTIMATED</p>
              <p className="metric-value whitespace-nowrap">
                420,000 <span className="metric-unit ml-1">tons</span>
              </p>
              <p className="metric-label">
                CO₂ Sequestered <span className="text-white/50">(Projected)</span>
              </p>
            </li>

            {/* 3 */}
            <li className="metric">
              <p className="metric-kicker">ESTIMATED</p>
              <p className="metric-value metric-value-tight whitespace-nowrap">
                800,000,000 <span className="metric-unit ml-1">L</span>
              </p>
              <p className="metric-label">
                Water Retained <span className="text-white/50">(Projected)</span>
              </p>
            </li>

            {/* 4 */}
            <li className="metric">
              <p className="metric-kicker">ESTIMATED</p>
              <p className="metric-value whitespace-nowrap">
                1,000,000 <span className="metric-unit ml-1">kg</span>
              </p>
              <p className="metric-label">
                Oxygen Released <span className="text-white/50">(Projected)</span>
              </p>
            </li>
          </ul>
        </section>
      </Reveal>

      {/* Mini animated infographic */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {/* Air Purified */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        >
          <StatIcon label="Air Purified">
            <svg width="28" height="28" viewBox="0 0 24 24" className="text-[var(--acc)]">
              <g fill="currentColor">
                <path
                  d="M4 10c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"
                  opacity=".7"
                />
                <path
                  d="M4 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"
                  opacity=".9"
                />
              </g>
            </svg>
          </StatIcon>
        </motion.div>

        {/* Habitat Created */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        >
          <StatIcon label="Habitat Created">
            <svg width="28" height="28" viewBox="0 0 24 24" className="text-[var(--acc)]">
              <g fill="currentColor">
                <path d="M12 3l8 6v10a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2V9l8-6z" />
                <circle cx="7.5" cy="14.5" r="1.2" opacity=".7" />
                <circle cx="16.5" cy="14.5" r="1.2" opacity=".7" />
              </g>
            </svg>
          </StatIcon>
        </motion.div>

        {/* Youth Connected */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        >
          <StatIcon label="Youth Connected">
            <svg width="28" height="28" viewBox="0 0 24 24" className="text-[var(--acc)]">
              <g fill="currentColor">
                <circle cx="6.5" cy="8" r="2.5" />
                <circle cx="17.5" cy="8" r="2.5" />
                <circle cx="12" cy="16" r="2.5" />
                <path
                  d="M8.5 10.2L10.8 13M15.5 10.2L13.2 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </StatIcon>
        </motion.div>
        </div>
      </Reveal>

      {/* Story — unified with site theme */}
      <Reveal>
        <div className="max-w-5xl mx-auto">
        <div className="card story-card px-6 md:px-8 py-8 md:py-10">
          <div className="eyebrow">Our Story</div>
          <h2 className="story-title">How a conversation became a movement</h2>

          <div className="prose-reset space-y-4">
            <p>
              <b>OneTeenOneTree</b> began in <b>Odisha, India</b> with two students,
              <b> Utkarsh Singh</b> and <b> Jahnasi Samal</b>, asking a simple question: “What can we do that’s easy
              enough for anyone, but powerful enough to matter?” We knew trees should have been planted yesterday —
              the <i>second-best</i> time is now.
            </p>

            <p>
              We wanted an action a teen could do anywhere — at home, in a school yard, or beside a road — something
              that didn’t need permission to begin. So we designed a pledge anyone could take in a minute, and a
              practice they could grow for years: <b>plant one tree, care for it, tell your story, inspire a friend.</b>
            </p>

            <p>
              What started as a conversation grew into a youth movement: chapters in schools, friendly leaderboards,
              practical guides for native species, and seasonal challenges. <b>Not a campaign; a habit.</b>
            </p>
          </div>
        </div>
        </div>
      </Reveal>

      {/* Vision & Pathway */}
      <Reveal>
        <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Where we’re going</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold">1M Teens, 1M Trees</h3>
            <p className="text-white/70 mt-1">
              The flagship goal — a global youth milestone that’s simple to understand and unforgettable to achieve.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold">100K Pledges</h3>
            <p className="text-white/70 mt-1">
              Our near-term push: unlock scale via schools/colleges, youth clubs, and city chapters.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold">Global Platform</h3>
            <p className="text-white/70 mt-1">
              Chapters across countries, localized species guides, and friendly leaderboards that celebrate
              consistency.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold">Real Eco-Education</h3>
            <p className="text-white/70 mt-1">
              Not just “plant trees.” Practical design: which <i>native species</i> suit your soil and climate, how to
              make your garden beautiful and biodiverse, and how to care through the seasons so survivorship rises.
            </p>
          </div>
        </div>
        </div>
      </Reveal>

      {/* Campus Unmuted Partnership Card */}
      <Reveal>
        <div className="max-w-5xl mx-auto">
        <div className="card flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="shrink-0">
            <img
              src="/campus-unmuted.svg"
              alt="Campus Unmuted partner logo with OneTeenOneTree"
              className="w-32 h-32 object-contain rounded-xl bg-white p-2"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">In partnership with Campus Unmuted 🎓</h3>
            <p className="text-white/70 mt-2">
              Campus Unmuted is a youth publishing platform for honest student voices — ideas, essays, and lived
              experiences. Together, we connect climate action with expression: plant a tree, then tell your story to
              inspire the next teen.
            </p>
            <div className="mt-4">
              <a href="https://campusunmuted.site" target="_blank" rel="noreferrer" className="btn">
                Visit Website
              </a>
            </div>
          </div>
        </div>
        </div>
      </Reveal>

      {/* UN SDGs */}
      <Reveal>
        <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Aligned with the UN SDGs</h2>
        <p className="text-white/70 mb-6">
          OneTeenOneTree advances global goals through youth-led, local action.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* SDG 6 */}
          <div className="card flex items-center gap-4">
            <img
              src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg"
              alt="OneTeenOneTree SDG 6 icon for clean water and sanitation"
              className="w-16 h-16 rounded"
            />
            <div>
              <div className="font-semibold">SDG 6 — Clean Water & Sanitation</div>
              <div className="text-white/70 text-sm">Trees improve infiltration and protect watersheds.</div>
            </div>
          </div>

          {/* SDG 7 */}
          <div className="card flex items-center gap-4">
            <img
              src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg"
              alt="OneTeenOneTree SDG 7 icon for affordable and clean energy"
              className="w-16 h-16 rounded"
            />
            <div>
              <div className="font-semibold">SDG 7 — Affordable & Clean Energy</div>
              <div className="text-white/70 text-sm">Shade lowers cooling demand; we promote efficient campuses.</div>
            </div>
          </div>

          {/* SDG 11 */}
          <div className="card flex items-center gap-4">
            <img
              src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg"
              alt="OneTeenOneTree SDG 11 icon for sustainable cities and communities"
              className="w-16 h-16 rounded"
            />
            <div>
              <div className="font-semibold">SDG 11 — Sustainable Cities</div>
              <div className="text-white/70 text-sm">Urban trees cool streets and build resilient neighborhoods.</div>
            </div>
          </div>

          {/* SDG 12 */}
          <div className="card flex items-center gap-4">
            <img
              src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg"
              alt="OneTeenOneTree SDG 12 icon for responsible consumption and production"
              className="w-16 h-16 rounded"
            />
            <div>
              <div className="font-semibold">SDG 12 — Responsible Consumption</div>
              <div className="text-white/70 text-sm">Native planting, composting, low-waste school drives.</div>
            </div>
          </div>

          {/* SDG 13 */}
          <div className="card flex items-center gap-4">
            <img
              src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg"
              alt="OneTeenOneTree SDG 13 icon for climate action"
              className="w-16 h-16 rounded"
            />
            <div>
              <div className="font-semibold">SDG 13 — Climate Action</div>
              <div className="text-white/70 text-sm">Plant, care, track — a practical pathway to resilience.</div>
            </div>
          </div>

          {/* SDG 15 */}
          <div className="card flex items-center gap-4">
            <img
              src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg"
              alt="OneTeenOneTree SDG 15 icon for life on land"
              className="w-16 h-16 rounded"
            />
            <div>
              <div className="font-semibold">SDG 15 — Life on Land</div>
              <div className="text-white/70 text-sm">Native species boost biodiversity and soil protection.</div>
            </div>
          </div>

          {/* SDG 17 */}
          <div className="card flex items-center gap-4">
            <img
              src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg"
              alt="OneTeenOneTree SDG 17 icon for partnerships for the goals"
              className="w-16 h-16 rounded"
            />
            <div>
              <div className="font-semibold">SDG 17 — Partnerships</div>
              <div className="text-white/70 text-sm">Schools, youth orgs, city chapters, and Campus Unmuted.</div>
            </div>
          </div>
        </div>
        </div>
      </Reveal>

      {/* Our Symbol (OTOT logo) */}
      <Reveal>
        <section className="max-w-5xl mx-auto text-center">
        <div className="logo-slab relative mx-auto w-[240px] md:w-[280px]">
          <img src="/logo.png" alt="OneTeenOneTree — OTOT logo" className="w-full h-auto drop-shadow-xl" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mt-6">Our Symbol</h2>
        <p className="text-white/70 max-w-3xl mx-auto mt-3 leading-relaxed">
          The logo unites two youth silhouettes with a rising stem that forms the <b>“1”</b> — a promise that{' '}
          <b>one teen plants one tree</b>. The enclosing circle suggests Earth and community. Its figure-ground harmony
          and bilateral balance reflect the science of <i> humans and nature growing together</i>: simple action,
          shared responsibility, lasting impact.
        </p>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <div className="text-center max-w-2xl mx-auto">
        <div className="card">
          <h3 className="text-2xl font-bold">Be the generation that restores Earth 🌍</h3>
          <p className="text-white/70 mt-2">
            Join <b>OneTeenOneTree</b> — your single tree can spark a forest of hope.
          </p>
          <a href="/pledge" className="btn mt-4">
            Take the Pledge
          </a>
        </div>
        </div>
      </Reveal>
    </section>
  )
}
