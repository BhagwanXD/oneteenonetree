import SocialClient from "./SocialClient";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const metadata = {
  title: "Social | OneTeenOneTree",
  description:
    "Explore the latest OneTeenOneTree updates across Instagram and LinkedIn.",
  alternates: {
    canonical: "https://www.oneteenonetree.org/social",
  },
  openGraph: {
    title: "Social | OneTeenOneTree",
    description:
      "Explore the latest OneTeenOneTree updates across Instagram and LinkedIn.",
    url: "https://www.oneteenonetree.org/social",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Social | OneTeenOneTree",
    description:
      "Explore the latest OneTeenOneTree updates across Instagram and LinkedIn.",
    images: ["/og-image.jpg"],
  },
};

export default async function SocialPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })
  const { data } = await supabase
    .from('social_posts')
    .select('id, platform, url, title, description, image_url, post_date, created_at')
    .eq('published', true)
    .order('post_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(9)

  return <SocialClient initialPosts={data ?? []} />;
}
