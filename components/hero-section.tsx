"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20" />
      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              Find Your Perfect Match Through Music
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Ecstasy connects people based on their music taste. Discover compatible matches who share your passion for
              the same beats, melodies, and artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-full">
                  How It Works
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto lg:mr-0"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-[4/5] rounded-3xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                <div className="absolute inset-0 flex flex-col">
                  <div className="h-1/2 bg-gradient-to-br from-pink-400 to-purple-500 p-6 flex flex-col justify-end">
                    <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden mb-2">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Profile"
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                    {/* Removed the "Sarah, 26" text and "Music lover • Concert enthusiast" */}
                  </div>
                  <div className="flex-1 p-6">
                    {/* Removed the "Top Artists" section and artists list */}
                    {/* Removed the "Favorite Genres" section and genres list */}
                    <div className="flex flex-col items-center justify-center h-full">
                      <h3 className="text-xl font-bold text-center mb-2">Discover Your Musical Match</h3>
                      <p className="text-center text-gray-500">Connect with people who share your music taste</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

