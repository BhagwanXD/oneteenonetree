'use client'

import Image from 'next/image'
import { useState } from 'react'
import Icon from '@/components/Icon'

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
    answer: 'We currently accept UPI payments. More options will be added over time.',
  },
]

export default function DonateClient() {
  const upiId = 'utkarshh@fam'
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [qrError, setQrError] = useState(false)

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
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="inline-flex items-center gap-2">
                <Icon name="volunteer" size={26} aria-hidden="true" />
                Donate via UPI
              </span>
            </h2>
            <p className="text-white/70 mt-2">
              Scan the QR or copy the UPI ID.
            </p>
          </div>

          <div className="mt-8">
            <div className="card">
              <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-white/60">UPI Payment</p>
                    <h3 className="text-2xl font-semibold text-white">
                      <span className="inline-flex items-center gap-2">
                        <Icon name="volunteer" size={20} aria-hidden="true" />
                        Donate via UPI
                      </span>
                    </h3>
                    <p className="text-sm text-white/60">Scan the QR or copy the UPI ID.</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-white/60">UPI ID</p>
                    <p className="text-xl font-semibold text-white tracking-wide">{upiId}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopy('upi', upiId)}
                      className="btn px-4 py-2 text-sm min-h-[44px]"
                      aria-label="Copy UPI ID"
                    >
                      Copy UPI ID
                    </button>
                    {!qrError ? (
                      <a
                        href="/images/donate/upi-qr.png"
                        download
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition"
                      >
                        <Icon name="download" size={16} aria-hidden="true" />
                        Download QR
                      </a>
                    ) : null}
                  </div>

                  <p className="text-xs text-[var(--acc)]" role="status" aria-live="polite">
                    {copiedKey === 'upi' ? 'Copied!' : ''}
                  </p>

                  <p className="text-sm text-white/60">
                    Tip: Add your name in the payment note so we can match your donation.
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-white/60">
                    <span className="inline-flex items-center gap-2">
                      <Icon name="verified" size={16} aria-hidden="true" />
                      UPI ID verified
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Icon name="shield" size={16} aria-hidden="true" />
                      No card details needed
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Icon name="smartphone" size={16} aria-hidden="true" />
                      Works with any UPI app
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center justify-center">
                  {!qrError ? (
                    <Image
                      src="/images/donate/upi-qr.png"
                      alt="OneTeenOneTree UPI QR code"
                      width={260}
                      height={260}
                      className="w-full max-w-[260px] h-auto rounded-lg"
                      onError={() => setQrError(true)}
                    />
                  ) : (
                    <div className="text-sm text-white/60 text-center">
                      QR unavailable. Use the UPI ID above.
                    </div>
                  )}
                </div>
              </div>
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
                    <Icon
                      name="chevronDown"
                      size={18}
                      className={`text-white/60 transition ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
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
