import SocialClient from "./SocialClient";

export const metadata = {
  title: "Instagram — OneTeenOneTree",
  description:
    "See the latest posts from OneTeenOneTree on Instagram — youth-led environmental stories and pledges directly from our movement.",
  openGraph: {
    title: "Instagram — OneTeenOneTree",
    description:
      "See the latest posts from OneTeenOneTree on Instagram — youth-led environmental stories and pledges directly from our movement.",
    url: "https://www.OneTeenOneTree.org/social",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function SocialPage() {
  return <SocialClient />;
}