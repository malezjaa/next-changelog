import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { getBaseUrl } from "@/utils/urls";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const baseUrl = getBaseUrl();
const siteImageUrl = new URL("siteimage.png", baseUrl).toString();

const siteName = "Next.js Changelog";
const siteDescription =
  "Track the latest Next.js releases and release notes. Compare stable and canary versions, see what changed, and open the source on GitHub.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  authors: [{ name: siteName, url: baseUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  referrer: "strict-origin-when-cross-origin",
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website",
    url: baseUrl,
    siteName,
    locale: "en_US",
    images: [
      {
        url: siteImageUrl,
        width: 1858,
        height: 931,
        alt: "Next.js Changelog release notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [siteImageUrl],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#040506",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        name: siteName,
        description: siteDescription,
        url: baseUrl,
        inLanguage: "en",
        publisher: { "@id": `${baseUrl}#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: siteName,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: new URL("icon.svg", baseUrl).toString(),
        },
        sameAs: ["https://github.com/malezjaa/next-changelog"],
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}#webpage`,
        name: siteName,
        description: siteDescription,
        url: baseUrl,
        isPartOf: { "@id": `${baseUrl}#website` },
        about: {
          "@type": "SoftwareApplication",
          name: "Next.js",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Cross-platform",
          url: "https://nextjs.org/",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Analytics />
        <Navbar />

        <div className="w-full">{children}</div>
        <ScrollToTop />
      </body>
    </html>
  );
}
