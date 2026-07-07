import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

const defaultSocialImage = "/images/hero-gem-poster.jpg";

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
  image = defaultSocialImage,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      siteName: SITE_NAME,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
