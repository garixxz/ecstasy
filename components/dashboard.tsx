"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, X, Music, Disc } from "lucide-react"
import MainLayout from "@/components/main-layout"
import MusicVisualizer from "@/components/music-visualizer"

type PotentialMatch = {
  user: {
    id: string
    name: string
    email: string
    image: string | null
    profile: {
      bio: string | null
      age: number | null
      gender: string | null
      location: string | null
      profileImage: string | null
    } | null
  }
  compatibilityScore: number
}

export default function Dashboard({ userId }: { userId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liking, setLiking] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    container: containerRef,
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.8, 0])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/matches")
        if (!response.ok) throw new Error("Failed to fetch matches")

        const data = await response.json()
        setPotentialMatches(data)
      } catch (error) {
        console.error("Error fetching matches:", error)
        toast({
          title: "Error",
          description: "Failed to load potential matches",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [toast])

  const handleLike = async (targetUserId: string) => {
    if (liking) return

    setLiking(true)
    try {
      const response = await fetch("/api/matches/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId }),
      })

      if (!response.ok) throw new Error("Failed to like user")

      const data = await response.json()

      if (data.isMatch) {
        toast({
          title: "It's a match!",
          description: "You both liked each other!",
        })
      } else {
        toast({
          title: "Liked!",
          description: "You liked this profile",
        })
      }

      // Move to next profile
      setCurrentIndex((prev) => prev + 1)
    } catch (error) {
      console.error("Error liking user:", error)
      toast({
        title: "Error",
        description: "Failed to like user",
        variant: "destructive",
      })
    } finally {
      setLiking(false)
    }
  }

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1)
  }

  const currentMatch = potentialMatches[currentIndex]

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <h1 className="text-3xl font-bold mb-8 neon-text">Find Your Music Match</h1>

        {loading ? (
          <Card className="w-full max-w-md p-6 neomorphic">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-40 w-40 rounded-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <div className="flex space-x-4 mt-4">
                <Skeleton className="h-10 w-20 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-full" />
              </div>
            </div>
          </Card>
        ) : potentialMatches.length === 0 ? (
          <Card className="w-full max-w-md p-6 neomorphic text-center">
            <Disc className="mx-auto h-16 w-16 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No matches found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find any potential matches based on your music taste. Try updating your preferences!
            </p>
            <Button onClick={() => router.push("/profile")}>Update Profile</Button>
          </Card>
        ) : currentIndex >= potentialMatches.length ? (
          <Card className="w-full max-w-md p-6 neomorphic text-center">
            <Music className="mx-auto h-16 w-16 mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">No more profiles</h2>
            <p className="text-muted-foreground mb-4">
              You've gone through all potential matches. Check back later for more!
            </p>
            <Button onClick={() => router.push("/matches")}>View Your Matches</Button>
          </Card>
        ) : (
          <div
            ref={containerRef}
            className="w-full max-w-md h-[70vh] overflow-y-auto neomorphic-inset rounded-lg p-4 hide-scrollbar"
          >
            <motion.div style={{ scale, opacity }} className="flex flex-col items-center">
              <Card className="w-full neomorphic overflow-hidden">
                <div className="relative aspect-square">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                      src={
                        currentMatch.user.profile?.profileImage ||
                        currentMatch.user.image ||
                        "/placeholder.svg?height=400&width=400"
                      }
                      alt={currentMatch.user.name || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl rounded-none">
                      {currentMatch.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h2 className="text-2xl font-bold text-white">
                      {currentMatch.user.name}, {currentMatch.user.profile?.age || "?"}
                    </h2>
                    <p className="text-white/80">{currentMatch.user.profile?.location || "Unknown location"}</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Music Compatibility</h3>
                    <MusicVisualizer score={currentMatch.compatibilityScore} />
                    <p className="text-center mt-2">{Math.round(currentMatch.compatibilityScore * 100)}% match</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">{currentMatch.user.profile?.bio || "No bio provided"}</p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center space-x-4 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                  onClick={handleSkip}
                >
                  <X className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={() => handleLike(currentMatch.user.id)}
                  disabled={liking}
                >
                  <Heart className="h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

