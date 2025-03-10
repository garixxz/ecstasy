"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="relative w-24 h-24 mb-6">
        <div className="cassette-body border-2 border-neon-pink bg-black p-4 rounded-md">
          <div className="cassette-reels flex justify-between">
            <div className="reel w-6 h-6 rounded-full border border-neon-blue"></div>
            <div className="reel w-6 h-6 rounded-full border border-neon-blue"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-neon-pink text-4xl">!</span>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
      <p className="text-zinc-400 mb-6 text-center max-w-md">
        We apologize for the inconvenience. Our team has been notified and is working on a fix.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} className="bg-neon-blue hover:bg-neon-blue/90 text-black font-bold">
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline" className="border-neon-pink text-neon-pink hover:bg-neon-pink/10">
            Go home
          </Button>
        </Link>
      </div>
    </div>
  )
}

