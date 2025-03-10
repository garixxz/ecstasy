import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ecstasy - Music-Based Dating",
  description: "Find your perfect match through the universal language of music",
  keywords: "dating, music, 80s, retro, matches, dating app",
  authors: [{ name: "Ecstasy Team" }],
  openGraph: {
    title: "Ecstasy - Music-Based Dating",
    description: "Find your perfect match through the universal language of music",
    url: "https://ecstasy-dating-app.netlify.app",
    siteName: "Ecstasy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

