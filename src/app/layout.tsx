import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";

import { SEOJsonLd } from "@/components/shared/SEOJsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aurelia Gems | Rare Stones, Timeless Stories",
    template: "%s | Aurelia Gems",
  },
  description:
    "Discover fine jewellery, exceptional gemstones, and private maison services from Aurelia Gems.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aurelia Gems | Rare Stones, Timeless Stories",
    description: "Discover fine jewellery, exceptional gemstones, and private maison services from Aurelia Gems.",
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: "/",
    images: [{ url: "/images/hero-gem-poster.jpg", alt: "Aurelia Gems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurelia Gems | Rare Stones, Timeless Stories",
    description: "Discover fine jewellery, exceptional gemstones, and private maison services from Aurelia Gems.",
    images: ["/images/hero-gem-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SEOJsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Aurelia Gems",
              url: SITE_URL,
              image: `${SITE_URL}/images/hero-gem-poster.jpg`,
              description: "A premium jewellery and gemstone maison.",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Aurelia Gems",
              url: SITE_URL,
              inLanguage: "en",
            },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
