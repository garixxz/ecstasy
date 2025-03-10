"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MusicIcon, Edit, User, Heart, MessageCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const mockUserProfile = {
  name: "Alex Johnson",
  age: 28,
  bio: "Indie rock enthusiast and vinyl collector. Looking for someone to share headphones with.",
  image: "/placeholder.svg?height=300&width=300",
  gender: "male",
  lookingFor: "everyone",
  favoriteGenres: ["Indie", "Rock", "Alternative", "Synthwave"],
  favoriteArtists: ["The Smiths", "Arctic Monkeys", "Tame Impala", "Depeche Mode"],
  matchCount: 12,
  likeCount: 24,
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockUserProfile)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (status === "authenticated") {
      // In a real app, fetch user profile from API
      // fetchUserProfile()

      // Using mock data for now
      setTimeout(() => {
        setProfile(mockUserProfile)
        setIsLoading(false)
      }, 1000)
    }
  }, [status, router])

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
        <p className="mt-4 text-neon-pink">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-neon-purple bg-black overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-neon-purple to-neon-blue">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-black">
              <Image src={profile.image || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
            onClick={() => router.push("/settings")}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        <CardHeader className="pt-20 text-center">
          <CardTitle className="text-2xl text-white">
            {profile.name}, {profile.age}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {profile.gender === "male" ? "Male" : profile.gender === "female" ? "Female" : "Other"} • Looking for{" "}
            {profile.lookingFor === "men" ? "Men" : profile.lookingFor === "women" ? "Women" : "Everyone"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-neon-pink">{profile.matchCount}</div>
              <div className="text-xs text-zinc-400">Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-blue">{profile.likeCount}</div>
              <div className="text-xs text-zinc-400">Likes</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">About Me</h3>
            <p className="text-zinc-300">{profile.bio}</p>
          </div>

          <Tabs defaultValue="music" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
              <TabsTrigger
                value="music"
                className="text-white data-[state=active]:bg-neon-purple data-[state=active]:text-black"
              >
                Music Taste
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="text-white data-[state=active]:bg-neon-pink data-[state=active]:text-black"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="music" className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Favorite Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.favoriteGenres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neon-purple/20 border border-neon-purple text-white rounded-full text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Favorite Artists</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.favoriteArtists.map((artist, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neon-blue/20 border border-neon-blue text-white rounded-full text-xs"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link href="/connect-spotify">
                  <Button
                    variant="outline"
                    className="w-full border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954]/10"
                    className="w-full border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954]/10"
                  >
                    <MusicIcon className="mr-2 h-4 w-4" />
                    Connect Spotify
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-md">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-neon-pink mr-3" />
                  <div>
                    <p className="text-white text-sm">You liked Sarah</p>
                    <p className="text-xs text-zinc-400">2 days ago</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-md">
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 text-neon-blue mr-3" />
                  <div>
                    <p className="text-white text-sm">You messaged Michael</p>
                    <p className="text-xs text-zinc-400">3 days ago</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-md">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-neon-purple mr-3" />
                  <div>
                    <p className="text-white text-sm">Updated your profile</p>
                    <p className="text-xs text-zinc-400">1 week ago</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full bg-neon-pink hover:bg-neon-pink/90 text-black font-bold"
            onClick={() => router.push("/settings")}
          >
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

