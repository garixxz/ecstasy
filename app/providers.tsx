"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider" // ✅ Using the corrected theme-provider
import { Toaster } from "sonner" // ✅ Sonner for notifications

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Toaster position="top-right" /> {/* ✅ Sonner Notifications */}
      </ThemeProvider>
    </SessionProvider>
  )
}
