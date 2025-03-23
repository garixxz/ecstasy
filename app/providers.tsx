"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastContainer } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

// Update the Providers component to include ToastContainer
export function Providers({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast()

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <ToastContainer toasts={toasts} />
      </ThemeProvider>
    </SessionProvider>
  )
}

