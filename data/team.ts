export type TeamMember = {
  slug: string
  name: string
  role: string
  educationOrProfession: string
  badge?: string
  tagline?: string
  location?: string
  longBio?: string[]
  highlights?: string[]
  seo?: {
    title?: string
    description?: string
  }
  placeholder?: boolean
  socials: {
    instagram: string
    linkedin: string
    twitter: string
    youtube: string
  }
  image: string
}

export const teamMembers: TeamMember[] = [
  {
    slug: 'utkarsh-singh',
    name: 'Utkarsh Singh',
    role: 'Founder',
    educationOrProfession: 'Founder',
    badge: 'Founder',
    tagline: 'Student • Climate & Community Initiatives',
    location: 'India',
    longBio: [
      'Utkarsh Singh is a student founder focused on building youth-led climate action through OneTeenOneTree. He works with schools and community leaders to organize tree plantation drives that are practical, verified, and easy for students to participate in.',
      'His work centers on simplifying climate action into a pledge that leads to real, measurable impact, and on helping students share their planting stories in a safe, verified way.',
    ],
    highlights: [
      'Leads product strategy and community partnerships',
      'Builds verification and impact reporting workflows',
      'Focuses on student-led climate action and outreach',
    ],
    seo: {
      title: 'Utkarsh Singh | OneTeenOneTree',
      description:
        'Utkarsh Singh is the Founder of OneTeenOneTree, a student-led climate action initiative focused on verified tree plantation drives.',
    },
    socials: {
      instagram: '',
      linkedin: 'https://www.linkedin.com/in/utkarshsngh/',
      twitter: '',
      youtube: '',
    },
    image: '/images/team/utkarsh-singh.jpg',
  },
  {
    slug: 'jahnasi-samal',
    name: 'Jahnasi Samal',
    role: 'Co-Founder',
    educationOrProfession: 'Co-Founder',
    badge: 'Co-Founder',
    tagline: 'Student Leader • Outreach & Strategy',
    location: 'India',
    longBio: [
      'Jahnasi Samal is a student co-founder who shapes outreach and collaboration for OneTeenOneTree. She supports schools, volunteers, and community partners in creating meaningful planting experiences.',
      'Her focus is on storytelling, student engagement, and making climate action welcoming to first-time planters.',
    ],
    highlights: [
      'Leads outreach strategy and school partnerships',
      'Supports volunteer onboarding and coordination',
      'Advocates for student-led environmental action',
    ],
    seo: {
      title: 'Jahnasi Samal | OneTeenOneTree',
      description:
        'Jahnasi Samal is the Co-Founder of OneTeenOneTree, focused on outreach, partnerships, and student-led tree plantation drives.',
    },
    socials: {
      instagram: '',
      linkedin: 'https://in.linkedin.com/in/jahnasi-samal-65693b382',
      twitter: '',
      youtube: '',
    },
    image: '/images/team/jahnasi-samal.jpg',
  },
  {
    slug: 'full-name',
    name: 'Full Name',
    role: 'Team Member',
    educationOrProfession: 'Education / Profession',
    placeholder: true,
    socials: { instagram: '', linkedin: '', twitter: '', youtube: '' },
    image: '/images/team/full-name.jpg',
  },
  {
    slug: 'full-name',
    name: 'Full Name',
    role: 'Team Member',
    educationOrProfession: 'Education / Profession',
    placeholder: true,
    socials: { instagram: '', linkedin: '', twitter: '', youtube: '' },
    image: '/images/team/full-name.jpg',
  },
  {
    slug: 'full-name',
    name: 'Full Name',
    role: 'Team Member',
    educationOrProfession: 'Education / Profession',
    placeholder: true,
    socials: { instagram: '', linkedin: '', twitter: '', youtube: '' },
    image: '/images/team/full-name.jpg',
  },
  {
    slug: 'full-name',
    name: 'Full Name',
    role: 'Team Member',
    educationOrProfession: 'Education / Profession',
    placeholder: true,
    socials: { instagram: '', linkedin: '', twitter: '', youtube: '' },
    image: '/images/team/full-name.jpg',
  },
]

export const visibleTeamMembers = teamMembers.filter((member) => !member.placeholder)

export const getTeamMemberBySlug = (slug: string) =>
  teamMembers.find((member) => member.slug === slug && !member.placeholder)
