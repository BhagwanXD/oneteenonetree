export type FaqAnswerPart = string | { type: 'link'; label: string; href: string }

export type FaqItem = {
  id: string
  question: string
  answer: FaqAnswerPart[]
  answerText: string
}

export type FaqSection = {
  title: string
  items: FaqItem[]
}

const link = (label: string, href: string): FaqAnswerPart => ({
  type: 'link',
  label,
  href,
})

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const item = (question: string, answer: FaqAnswerPart[], answerText: string): FaqItem => ({
  id: slugify(question),
  question,
  answer,
  answerText,
})

export const faqSections: FaqSection[] = [
  {
    title: 'About OneTeenOneTree',
    items: [
      item(
        'What is OneTeenOneTree?',
        [
          'OneTeenOneTree is a youth-led environmental initiative and climate action movement based in India. ',
          'We turn pledges into real trees through verified community drives, student leadership, and impact storytelling.',
        ],
        'OneTeenOneTree is a youth-led environmental initiative and climate action movement based in India. We turn pledges into real trees through verified community drives, student leadership, and impact storytelling.'
      ),
      item(
        'Is OneTeenOneTree a book?',
        [
          'No. OneTeenOneTree is a youth-led climate action initiative based in India focused on tree plantation, student engagement, and verified community impact.',
        ],
        'No. OneTeenOneTree is a youth-led climate action initiative based in India focused on tree plantation, student engagement, and verified community impact.'
      ),
      item(
        'Is OneTeenOneTree an NGO?',
        [
          'We are a youth-led initiative working with schools, volunteers, and partners to scale verified trees. ',
          'If you need legal or registration details for your region, please ',
          link('contact the team', '/contact'),
          '.',
        ],
        'We are a youth-led initiative working with schools, volunteers, and partners to scale verified trees. If you need legal or registration details for your region, please contact the team.'
      ),
      item(
        'Who founded OneTeenOneTree?',
        [
          'OneTeenOneTree was founded by ',
          link('Utkarsh Singh', '/about'),
          ' with co-founder Jahnasi Samal. ',
          'Read our origin story on the about page.',
        ],
        'OneTeenOneTree was founded by Utkarsh Singh with co-founder Jahnasi Samal. Read our origin story on the about page.'
      ),
      item(
        'Where does OneTeenOneTree operate?',
        [
          'We are based in India and focus on verified planting drives across Indian schools and communities. ',
          'We also welcome pledges from students worldwide.',
        ],
        'We are based in India and focus on verified planting drives across Indian schools and communities. We also welcome pledges from students worldwide.'
      ),
      item(
        'How can I learn more about the team?',
        [
          'Meet the people behind OneTeenOneTree on ',
          link('our team page', '/our-team'),
          '. ',
          'We share the story and the mission behind the student-led movement.',
        ],
        'Meet the people behind OneTeenOneTree on our team page. We share the story and the mission behind the student-led movement.'
      ),
      item(
        'How do I request a press or media inquiry?',
        [
          'For press kits, media requests, or interviews, visit ',
          link('the press page', '/press'),
          ' or send a note through ',
          link('Contact', '/contact'),
          '.',
        ],
        'For press kits, media requests, or interviews, visit the press page or send a note through Contact.'
      ),
    ],
  },
  {
    title: 'Pledge & Leaderboard',
    items: [
      item(
        'How does the OneTeenOneTree pledge work?',
        [
          'You commit to plant at least one tree and care for it, then submit proof for verification. ',
          'Start by visiting ',
          link('the pledge page', '/pledge'),
          ' and follow the steps.',
        ],
        'You commit to plant at least one tree and care for it, then submit proof for verification. Start by visiting the pledge page and follow the steps.'
      ),
      item(
        'Is the pledge free to join?',
        [
          'Yes, the pledge is free. ',
          'Our goal is to make student-led climate action easy and accessible to anyone.',
        ],
        'Yes, the pledge is free. Our goal is to make student-led climate action easy and accessible to anyone.'
      ),
      item(
        'How does the leaderboard work?',
        [
          'The leaderboard highlights verified plantings so honest contributions stand out. ',
          'Only verified trees count toward rankings to keep results fair.',
        ],
        'The leaderboard highlights verified plantings so honest contributions stand out. Only verified trees count toward rankings to keep results fair.'
      ),
      item(
        'Can I update my pledge details later?',
        [
          'Yes. You can update your profile and pledge details from ',
          link('your dashboard', '/dashboard'),
          '. ',
          'If you need help, use ',
          link('Contact', '/contact'),
          '.',
        ],
        'Yes. You can update your profile and pledge details from your dashboard. If you need help, use Contact.'
      ),
    ],
  },
  {
    title: 'Planting & Verification',
    items: [
      item(
        'How do you verify plantations?',
        [
          'Verification is based on clear photo or video proof, basic planting details, and ongoing care. ',
          'Our team reviews submissions to keep the impact record honest and transparent.',
        ],
        'Verification is based on clear photo or video proof, basic planting details, and ongoing care. Our team reviews submissions to keep the impact record honest and transparent.'
      ),
      item(
        'How do I submit planting proof?',
        [
          'After planting, upload photos and a short video from ',
          link('the planting page', '/plant'),
          '. ',
          'Our admins review submissions for verification.',
        ],
        'After planting, upload photos and a short video from the planting page. Our admins review submissions for verification.'
      ),
      item(
        'What counts as a verified tree?',
        [
          'A verified tree includes clear evidence that the sapling was planted and is being cared for. ',
          'We look for authentic, original photos or video and basic context from the planter.',
        ],
        'A verified tree includes clear evidence that the sapling was planted and is being cared for. We look for authentic, original photos or video and basic context from the planter.'
      ),
      item(
        'Why do you require photos or video for verification?',
        [
          'Verification protects the integrity of the community and ensures the leaderboard reflects real impact. ',
          'It also helps us learn what planting methods are working in different locations.',
        ],
        'Verification protects the integrity of the community and ensures the leaderboard reflects real impact. It also helps us learn what planting methods are working in different locations.'
      ),
      item(
        'How long does planting verification take?',
        [
          'Verification times vary based on submission volume. ',
          'If your submission needs more information, you will see a request in your account.',
        ],
        'Verification times vary based on submission volume. If your submission needs more information, you will see a request in your account.'
      ),
    ],
  },
  {
    title: 'Donations & Support',
    items: [
      item(
        'How do donations work?',
        [
          'Donations fund saplings, planting materials, local drive logistics, and volunteer-led operations. ',
          'You can contribute through ',
          link('the donate page', '/donate'),
          '.',
        ],
        'Donations fund saplings, planting materials, local drive logistics, and volunteer-led operations. You can contribute through the donate page.'
      ),
      item(
        'How can I donate to OneTeenOneTree?',
        [
          'You can donate using UPI on ',
          link('the donate page', '/donate'),
          '. ',
          'Your support funds saplings, protection, and community-led drives.',
        ],
        'You can donate using UPI on the donate page. Your support funds saplings, protection, and community-led drives.'
      ),
      item(
        'Is UPI donation available?',
        [
          'Yes. OneTeenOneTree currently accepts UPI donations. ',
          'Use any UPI app to scan the QR or copy the UPI ID.',
        ],
        'Yes. OneTeenOneTree currently accepts UPI donations. Use any UPI app to scan the QR or copy the UPI ID.'
      ),
      item(
        'Do you provide donation receipts?',
        [
          'Receipt support is being expanded. ',
          'If you need a receipt or documentation, please ',
          link('contact us', '/contact'),
          ' and we will help.',
        ],
        'Receipt support is being expanded. If you need a receipt or documentation, please contact us and we will help.'
      ),
      item(
        'How is my donation used?',
        [
          'Donations support saplings, planting materials, logistics, and volunteer-led operations. ',
          'We share updates and impact stories through community channels.',
        ],
        'Donations support saplings, planting materials, logistics, and volunteer-led operations. We share updates and impact stories through community channels.'
      ),
    ],
  },
  {
    title: 'Schools, Volunteers, Partnerships',
    items: [
      item(
        'How can schools partner?',
        [
          'Schools can organize student-led pledges, host planting days, and coordinate verified submissions. ',
          'Reach out through ',
          link('Contact', '/contact'),
          ' to plan a school drive.',
        ],
        'Schools can organize student-led pledges, host planting days, and coordinate verified submissions. Reach out through Contact to plan a school drive.'
      ),
      item(
        'How can I volunteer?',
        [
          'We welcome volunteers for local planting support, awareness, and mentoring. ',
          'Share your interests on ',
          link('the contact page', '/contact'),
          ' and we will follow up.',
        ],
        'We welcome volunteers for local planting support, awareness, and mentoring. Share your interests on the contact page and we will follow up.'
      ),
      item(
        'Can I sponsor a tree plantation drive?',
        [
          'Yes. Individuals and groups can sponsor drives, saplings, or student kits. ',
          'Tell us your goals through ',
          link('Contact', '/contact'),
          ' to co-create a plan.',
        ],
        'Yes. Individuals and groups can sponsor drives, saplings, or student kits. Tell us your goals through Contact to co-create a plan.'
      ),
      item(
        'Can companies or CSR partners collaborate?',
        [
          'We partner with CSR teams and community organizations for verified, student-led impact. ',
          'Start a partnership conversation via ',
          link('Contact', '/contact'),
          '.',
        ],
        'We partner with CSR teams and community organizations for verified, student-led impact. Start a partnership conversation via Contact.'
      ),
    ],
  },
  {
    title: 'Safety & Privacy',
    items: [
      item(
        'How is my data used?',
        [
          'We use your data to manage pledges, verification, and community updates. ',
          'We do not sell your data or use it for unrelated marketing.',
        ],
        'We use your data to manage pledges, verification, and community updates. We do not sell your data or use it for unrelated marketing.'
      ),
      item(
        'Will OneTeenOneTree post on my behalf?',
        [
          'No. We never post using your account. ',
          'Any social sharing is optional and initiated by you.',
        ],
        'No. We never post using your account. Any social sharing is optional and initiated by you.'
      ),
      item(
        'Is my email shared with anyone?',
        [
          'Your email stays private and is used only for OneTeenOneTree activity. ',
          'If you opt into updates, you can unsubscribe at any time.',
        ],
        'Your email stays private and is used only for OneTeenOneTree activity. If you opt into updates, you can unsubscribe at any time.'
      ),
      item(
        'Is the platform safe for students?',
        [
          'We design OneTeenOneTree to be student-friendly and moderation-focused. ',
          'If you have a concern, please reach out through ',
          link('Contact', '/contact'),
          '.',
        ],
        'We design OneTeenOneTree to be student-friendly and moderation-focused. If you have a concern, please reach out through Contact.'
      ),
    ],
  },
]
