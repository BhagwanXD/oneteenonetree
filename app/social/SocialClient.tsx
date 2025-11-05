"use client";

import Script from "next/script";

export default function SocialClient() {
  return (
    <section className="py-16">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          🌿 OneTeenOneTree on Instagram
        </h1>
        <p className="text-white/70 mt-3 max-w-2xl mx-auto">
          Follow <a href="https://www.instagram.com/oneteen.onetree/">@oneteen.onetree</a> to see the latest moments from our
          youth-led green movement — directly embedded here.
        </p>

        {/* ---------- LightWidget Embed ---------- */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-[0_0_15px_rgba(0,0,0,0.15)]">
          {/* LightWidget script loader */}
          <Script
            src="https://cdn.lightwidget.com/widgets/lightwidget.js"
            strategy="lazyOnload"
          />
          {/* Responsive iframe */}
          <iframe
            src="//lightwidget.com/widgets/6fa0cf9663dd5cb2937abe01836450a3.html"
            scrolling="no"
            className="lightwidget-widget w-full"
            style={{
              border: "0",
              overflow: "hidden",
              width: "100%",
              aspectRatio: "1 / 1",
              minHeight: "550px",
            }}
          />
        </div>

        {/* ---------- CTA ---------- */}
        <div className="mt-10">
          <a
            href="https://www.instagram.com/oneteen.onetree/"
            target="_blank"
            rel="noreferrer"
            className="btn inline-flex items-center gap-2"
          >
            🌱 Follow @oneteen.onetree
          </a>
        </div>
      </div>
    </section>
  );
}
