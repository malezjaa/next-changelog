import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { getBaseUrl } from "@/utils/urls";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Next.js Changelog",
    template: "%s | Next.js Changelog",
  },
  description: "The latest updates to the Next.js framework",
  alternates: {
    canonical: getBaseUrl(),
  },
  openGraph: {
    title: {
      default: "Next.js Changelog",
      template: "%s | Next.js Changelog",
    },
    description: "The latest updates to the Next.js framework",
    type: "website",
    url: getBaseUrl(),
  },
  twitter: {
    card: "summary",
    title: "Next.js Changelog",
    description: "The latest updates to the Next.js framework",
    images: [
      {
        url: `${getBaseUrl()}siteimage.png`,
        width: 1858,
        height: 931,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Next.js Changelog",
    description: "The latest updates to the Next.js framework",
    url: getBaseUrl(),
    publisher: {
      "@type": "Organization",
      name: "Next.js Changelog",
      url: getBaseUrl(),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getBaseUrl()}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className}`}>
        <Analytics />
        <Navbar />

        <div className="w-full">{children}</div>
        <ScrollToTop />
      </body>
    </html>
  );
}
