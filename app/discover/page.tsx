"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeartIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// This will be replaced with actual API data
const mockProfiles = [
  {
    id: 1,
    name: "Jessica",
    age: 28,
    bio: "Indie rock enthusiast and vinyl collector. Looking for someone to share headphones with.",
    image: "/placeholder.svg?height=500&width=400",
    topArtists: ["The Smiths", "Arctic Monkeys", "Tame Impala"],
    compatibility: 85,
  },
  {
    id: 2,
    name: "Michael",
    age: 31,
    bio: "Synth-wave producer by night, coffee addict by day. Let's talk about 80s music.",
    image: "/placeholder.svg?height=500&width=400",
    topArtists: ["Depeche Mode", "New Order", "The Cure"],
    compatibility: 92,
  },
  {
    id: 3,
    name: "Sophia",
    age: 26,
    bio: "Jazz lover with a soft spot for 80s pop. Always looking for new music recommendations!",
    image: "/placeholder.svg?height=500&width=400",
    topArtists: ["Madonna", "Prince", "Miles Davis"],
    compatibility: 78,
  },
]

export default function DiscoverPage() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [profiles, setProfiles] = useState(mockProfiles)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const router = useRouter()

  const currentProfile = profiles[currentProfileIndex]

  // Check authentication and fetch profiles
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (status === "authenticated") {
      fetchProfiles()
    }
  }, [status, router])

  const fetchProfiles = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from your API
      // const response = await fetch('/api/matches')
      // const data = await response.json()
      // setProfiles(data)

      // Using mock data for now
      setTimeout(() => {
        setProfiles(mockProfiles)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching profiles:", error)
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (!currentProfile) return

    setIsLiking(true)
    try {
      // In a real app, this would call your API
      // const response = await fetch('/api/likes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ receiverId: currentProfile.id })
      // })
      // const data = await response.json()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate a match (1 in 3 chance)
      const isMatch = Math.random() > 0.66

      if (isMatch) {
        setShowConfetti(true)
        toast({
          title: "It's a Match!",
          description: `You and ${currentProfile.name} liked each other!`,
          variant: "default",
        })

        // Hide confetti after 3 seconds
        setTimeout(() => {
          setShowConfetti(false)
        }, 3000)
      } else {
        toast({
          title: "Liked!",
          description: `You liked ${currentProfile.name}`,
          variant: "default",
        })
      }

      // Move to next profile
      if (currentProfileIndex < profiles.length - 1) {
        setCurrentProfileIndex(currentProfileIndex + 1)
      } else {
        // Reset for demo purposes or show "no more profiles" message
        fetchProfiles()
        setCurrentProfileIndex(0)
      }
    } catch (error) {
      console.error("Error liking profile:", error)
      toast({
        title: "Error",
        description: "Failed to like profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
        <div className="relative w-16 h-16">
          <div className="cassette-loading">
            <div className="cassette-body border-2 border-neon-pink bg-black p-2 rounded-md">
              <div className="cassette-reels flex justify-between">
                <div className="reel w-5 h-5 rounded-full border border-neon-blue animate-spin"></div>
                <div className="reel w-5 h-5 rounded-full border border-neon-blue animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-neon-pink">Loading profiles...</p>
      </div>
    )
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
        <h2 className="text-2xl font-bold text-white mb-4">No more profiles to show</h2>
        <p className="text-zinc-400 mb-8">Check back later for new matches!</p>
        <Button
          onClick={() => {
            fetchProfiles()
            setCurrentProfileIndex(0)
          }}
          className="bg-neon-pink hover:bg-neon-pink/90 text-black font-bold"
        >
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Discover</h1>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 confetti-container">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="relative">
        <Card className="w-full overflow-hidden border-2 border-neon-purple bg-black cassette-card transition-transform duration-300 hover:scale-[1.02]">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={currentProfile.image || "/placeholder.svg"}
              alt={currentProfile.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h2 className="text-2xl font-bold text-white">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <div className="flex items-center mt-1 mb-2">
                <div
                  className="h-2 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"
                  style={{ width: `${currentProfile.compatibility}%` }}
                ></div>
                <span className="ml-2 text-sm text-white">{currentProfile.compatibility}% Match</span>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-zinc-300 mb-4">{currentProfile.bio}</p>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Top Artists</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.topArtists.map((artist, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-neon-purple/20 border border-neon-purple text-white rounded-full text-xs"
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black transition-colors duration-300 shadow-[0_0_15px_rgba(255,105,180,0.3)] hover:shadow-[0_0_20px_rgba(255,105,180,0.5)]"
                onClick={handleLike}
                disabled={isLiking}
              >
                <HeartIcon className="h-8 w-8" />
                <span className="sr-only">Like</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

