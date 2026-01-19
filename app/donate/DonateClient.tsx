'use client'

import Image from 'next/image'
import { useState } from 'react'

const breakdown = [
  { label: 'Saplings & materials', value: '40%' },
  { label: 'Site prep & protection', value: '20%' },
  { label: 'Logistics & transport', value: '20%' },
  { label: 'Community events & volunteers', value: '10%' },
  { label: 'Admin & compliance', value: '10%' },
]

const faqs = [
  {
    question: 'Is my donation tax-deductible?',
    answer:
      'Tax benefits depend on local regulations and registration status. We can share documentation when applicable.',
  },
  {
    question: 'Can I donate in-kind (saplings/tools)?',
    answer:
      'Yes. In-kind support is welcome. Please share item details and location so we can coordinate logistics.',
  },
  {
    question: 'How do I get updates on impact?',
    answer:
      'We publish updates through our community channels and periodic impact summaries.',
  },
  {
    question: 'Can I sponsor a drive in my city?',
    answer:
      'Absolutely. We can co-create a local plan with schools and volunteers in your city.',
  },
  {
    question: 'How do I request a receipt?',
    answer:
      'Download the receipt request form below and submit it through our Contact page.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'UPI and bank transfers are supported. More options will be added over time.',
  },
]

export default function DonateClient() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      setCopiedKey(null)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold">Donate</h1>
            <p className="text-white/70 mt-3 text-lg">
              Your support funds plantation drives, saplings, logistics, and community programs led
              by young changemakers.
            </p>
            <a href="#payment-details" className="btn mt-6">
              View payment details
            </a>
          </div>
        </div>
      </section>

      <section id="payment-details" className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Payment Details</h2>
            <p className="text-white/70 mt-2">
              Choose UPI or bank transfer. Copy details with one click.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60">UPI</p>
                  <p className="text-lg font-semibold text-white">oneteenonetree@upi</p>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleCopy('upi', 'oneteenonetree@upi')}
                    className="btn px-3 py-2 text-sm min-h-[44px]"
                  >
                    Copy UPI ID
                  </button>
                  <p
                    className="text-xs text-[var(--acc)] mt-1"
                    role="status"
                    aria-live="polite"
                  >
                    {copiedKey === 'upi' ? 'Copied!' : ''}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-center">
                <Image
                  src="/images/donate/upi-qr.png"
                  alt="OneTeenOneTree UPI QR code"
                  width={220}
                  height={220}
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm text-white/60">
                Scan the QR or use the UPI ID above for quick payments.
              </p>
            </div>

            <div className="card space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60">Bank Transfer</p>
                <p className="text-lg font-semibold text-white">OneTeenOneTree</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-white/60">Bank Name</p>
                    <p className="text-white">Bank Name</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-white/60">Account No.</p>
                    <p className="text-white font-medium tracking-wide">XXXXXXXXXXXX</p>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy('account', 'XXXXXXXXXXXX')}
                      className="btn px-3 py-2 text-sm min-h-[44px]"
                    >
                      Copy
                    </button>
                    <p className="text-xs text-[var(--acc)] mt-1" role="status" aria-live="polite">
                      {copiedKey === 'account' ? 'Copied!' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-white/60">IFSC</p>
                    <p className="text-white font-medium tracking-wide">XXXX0000000</p>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy('ifsc', 'XXXX0000000')}
                      className="btn px-3 py-2 text-sm min-h-[44px]"
                    >
                      Copy
                    </button>
                    <p className="text-xs text-[var(--acc)] mt-1" role="status" aria-live="polite">
                      {copiedKey === 'ifsc' ? 'Copied!' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-white/60">Branch</p>
                    <p className="text-white">Branch Name</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/60">
                Include your name in the transfer note to help us match donations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Where your money goes</h2>
            <p className="text-white/60 mt-2">Indicative breakdown (updated periodically).</p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {breakdown.map((item) => (
              <div key={item.label} className="card text-center space-y-2">
                <div className="text-3xl font-extrabold text-[var(--acc)]">{item.value}</div>
                <p className="text-sm text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">FAQs</h2>
            <p className="text-white/60 mt-2">Quick answers to common donation questions.</p>
          </div>

          <div className="mt-8 max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/[0.04]">
                  <button
                    type="button"
                    id={`faq-trigger-${index}`}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <span className="text-white/60 text-lg">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                    className={`px-5 pb-4 text-sm text-white/70 ${isOpen ? 'block' : 'hidden'}`}
                  >
                    {faq.answer}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="card text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold">Receipt request</h2>
            <p className="text-white/70">
              Download the form and submit it after your donation.
            </p>
            <a
              href="/forms/receipt-request-form.html"
              download
              className="btn justify-center"
            >
              Download Receipt Request Form
            </a>
            <p className="text-sm text-white/60">
              Fill this form and submit via our Contact page.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
