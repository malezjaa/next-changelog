import './globals.css'
import { Inter } from 'next/font/google'
import {Metadata} from "next";
import Navbar from "@/components/Navbar";
import {getBaseUrl} from "@/utils/urls";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'Next.js Changelog',
    template: '%s | Next.js Changelog',
  },
  description: 'The latest updates to the Next.js framework',
  alternates: {
    canonical: getBaseUrl(),
  },
  openGraph: {
    title: {
      default: 'Next.js Discord Changelog',
      template: '%s | Next.js Discord Changelog',
    },
    description: 'The latest updates to the Next.js framework',
    type: 'website',
    url: getBaseUrl(),
    images: [
        "/siteimage.png"
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Next.js Discord Changelog',
    description: 'The latest updates to the Next.js framework',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
          <Navbar/>

          <div className="w-full">{children}</div>
      </body>
    </html>
  )
}
