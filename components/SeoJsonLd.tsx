'use client'
import Script from 'next/script'

export default function SeoJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OneTeenOneTree",
    url: "https://www.oneteenonetree.org",
    logo: "https://www.oneteenonetree.org/logo.png",
    sameAs: [
      "https://www.instagram.com/oneteen.onetree/",
      "https://www.linkedin.com/company/oneteen-onetree/",
      "https://www.linkedin.com/in/utkarshsngh/"
    ],
    description:
      "OneTeenOneTree.org empowers students to take climate action by pledging to plant trees and inspire their peers.",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Utkarsh Singh",
      url: "https://www.linkedin.com/in/utkarshsngh/"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@oneteenonetree.org"
    }
  }

  return (
    <Script
      id="org-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
