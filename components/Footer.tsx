import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="OneTeenOneTree logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-lg font-semibold text-white">OneTeenOneTree</span>
            </Link>
            <p className="text-sm text-white/70">A youth-led green pledge.</p>
            <a
              href="https://www.oneteenonetree.org/"
              className="text-sm text-white/60 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
            >
              oneteenonetree.org
            </a>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/"
                className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                About
              </Link>
              <Link
                href="/our-team"
                className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                Our Team
              </Link>
              <Link
                href="/pledge"
                className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                Pledge
              </Link>
              <Link
                href="/plant"
                className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                Plant
              </Link>
              <Link
                href="/donate"
                className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                Donate
              </Link>
              <Link
                href="/leaderboard"
                className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                Leaderboard
              </Link>
              <Link
                href="/press"
                className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                Press
              </Link>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-white">Connect</h3>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-3">
              <a
                href="https://www.instagram.com/oneteen.onetree/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                aria-label="Instagram"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                href="https://www.linkedin.com/company/oneteen-onetree"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                aria-label="LinkedIn Company"
              >
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-4 text-xs text-white/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} OneTeenOneTree - A youth-led green pledge.</p>
          <p>
            Website Developed by{' '}
            <a
              href="https://www.linkedin.com/in/utkarshsngh/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
            >
              Utkarsh Singh
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
