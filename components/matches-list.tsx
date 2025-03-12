"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Music, MessageSquare } from "lucide-react"
import MainLayout from "@/components/main-layout"
import MusicVisualizer from "@/components/music-visualizer"

type Match = {
  id: string
  user1Id: string
  user2Id: string
  createdAt: string
  user1: {
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
  user2: {
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
}

export default function MatchesList({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/matches/list")
        if (!response.ok) throw new Error("Failed to fetch matches")

        const data = await response.json()
        setMatches(data)
      } catch (error) {
        console.error("Error fetching matches:", error)
        toast({
          title: "Error",
          description: "Failed to load matches",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [toast])

  const getMatchedUser = (match: Match) => {
    return match.user1Id === userId ? match.user2 : match.user1
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 neon-text text-center">Your Matches</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="neomorphic overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <Card className="max-w-md mx-auto p-6 neomorphic text-center">
            <Music className="mx-auto h-16 w-16 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
            <p className="text-muted-foreground">Keep exploring profiles to find your music soulmate!</p>
          </Card>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {matches.map((match) => {
              const matchedUser = getMatchedUser(match)
              return (
                <motion.div key={match.id} variants={item}>
                  <Card className="neomorphic overflow-hidden h-full">
                    <CardContent className="p-0">
                      <div className="p-4 flex items-center space-x-4">
                        <Avatar className="h-16 w-16 border-2 border-primary">
                          <AvatarImage
                            src={
                              matchedUser.profile?.profileImage ||
                              matchedUser.image ||
                              "/placeholder.svg?height=64&width=64"
                            }
                            alt={matchedUser.name || "User"}
                          />
                          <AvatarFallback>{matchedUser.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {matchedUser.name}
                            {matchedUser.profile?.age && `, ${matchedUser.profile.age}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {matchedUser.profile?.location || "Unknown location"}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 pb-4">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Music Compatibility</h4>
                          <MusicVisualizer score={0.85} height={40} />
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {matchedUser.profile?.bio || "No bio provided"}
                        </p>

                        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>Message</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </MainLayout>
  )
}

