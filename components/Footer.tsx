import Link from 'next/link'
import { FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="container py-8 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} OneTeenOneTree.org — A youth-led green pledge.
        </p>

        {/* Center: social links */}
        <div className="flex items-center gap-4 text-lg">
          <a
            href="https://www.instagram.com/oneteen.onetree/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-pink-400 transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/company/oneteen-onetree"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-400 transition"
            aria-label="LinkedIn Company"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Right: developed by */}
        <div className="text-center md:text-right text-white/60">
          Website Developed by{' '}
          <a
            href="https://www.linkedin.com/in/utkarshsngh/"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:text-[var(--acc)] font-medium transition"
          >
            Utkarsh Singh
          </a>
        </div>
      </div>
    </footer>
  )
}