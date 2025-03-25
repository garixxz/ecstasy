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
            
          </motion.div>
        </div>
      </div>
    </section>
  )
}

