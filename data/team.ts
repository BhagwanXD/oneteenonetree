export type TeamMember = {
  slug: string
  name: string
  educationOrProfession: string
  badge?: string
  tagline?: string
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
    educationOrProfession: 'Founder',
    badge: 'Founder',
    tagline: 'Student • Climate & Community Initiatives',
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
    educationOrProfession: 'Co-Founder',
    badge: 'Co-Founder',
    tagline: 'Student Leader • Outreach & Strategy',
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
    educationOrProfession: 'Education / Profession',
    placeholder: true,
    socials: { instagram: '', linkedin: '', twitter: '', youtube: '' },
    image: '/images/team/full-name.jpg',
  },
  {
    slug: 'full-name',
    name: 'Full Name',
    educationOrProfession: 'Education / Profession',
    placeholder: true,
    socials: { instagram: '', linkedin: '', twitter: '', youtube: '' },
    image: '/images/team/full-name.jpg',
  },
  {
    slug: 'full-name',
    name: 'Full Name',
    educationOrProfession: 'Education / Profession',
    placeholder: true,
    socials: { instagram: '', linkedin: '', twitter: '', youtube: '' },
    image: '/images/team/full-name.jpg',
  },
  {
    slug: 'full-name',
    name: 'Full Name',
    educationOrProfession: 'Education / Profession',
    placeholder: true,
    socials: { instagram: '', linkedin: '', twitter: '', youtube: '' },
    image: '/images/team/full-name.jpg',
  },
]
