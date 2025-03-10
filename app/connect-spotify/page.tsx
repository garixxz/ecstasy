"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Music, Check, Loader2 } from "lucide-react"

// Mock Spotify data
const mockTopArtists = [
  { id: "1", name: "The Smiths", image: "/placeholder.svg?height=300&width=300" },
  { id: "2", name: "Depeche Mode", image: "/placeholder.svg?height=300&width=300" },
  { id: "3", name: "New Order", image: "/placeholder.svg?height=300&width=300" },
  { id: "4", name: "The Cure", image: "/placeholder.svg?height=300&width=300" },
  { id: "5", name: "Madonna", image: "/placeholder.svg?height=300&width=300" },
  { id: "6", name: "Prince", image: "/placeholder.svg?height=300&width=300" },
]

const mockTopGenres = ["Indie Rock", "Synthpop", "New Wave", "Post-Punk", "80s Pop", "Alternative"]

export default function ConnectSpotifyPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedArtists, setSelectedArtists] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [topArtists, setTopArtists] = useState(mockTopArtists)
  const [topGenres, setTopGenres] = useState(mockTopGenres)

  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (status === "authenticated") {
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [status, router])

  const handleConnectSpotify = async () => {
    setIsConnecting(true)

    try {
      // In a real app, this would redirect to Spotify OAuth
      // window.location.href = '/api/auth/spotify'

      // Simulate Spotify connection
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsConnected(true)
      toast({
        title: "Spotify connected!",
        description: "Your music preferences have been imported",
      })

      // Pre-select all artists and genres
      setSelectedArtists(topArtists.map((artist) => artist.id))
      setSelectedGenres([...topGenres])
    } catch (error) {
      console.error("Error connecting to Spotify:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect to Spotify. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const toggleArtist = (artistId: string) => {
    setSelectedArtists((prev) => (prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId]))
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would save to your API
      // await fetch('/api/user/music-preferences', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ artists: selectedArtists, genres: selectedGenres })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Preferences saved!",
        description: "Your music preferences have been updated",
      })

      router.push("/discover")
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
        <p className="mt-4 text-neon-pink">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <Card className="border-neon-purple bg-black">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">Connect Your Music</CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Import your music taste from Spotify to find better matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#1DB954] flex items-center justify-center mb-6">
                <Music className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Connect with Spotify</h3>
              <p className="text-zinc-400 text-center mb-6">
                We'll use your listening history to find people with similar music taste
              </p>
              <Button
                onClick={handleConnectSpotify}
                className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-black font-bold"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Spotify"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Your Top Artists</h3>
                <div className="grid grid-cols-2 gap-3">
                  {topArtists.map((artist) => (
                    <div
                      key={artist.id}
                      className={`relative flex items-center p-2 rounded-md border cursor-pointer transition-all ${
                        selectedArtists.includes(artist.id)
                          ? "border-neon-pink bg-neon-pink/20"
                          : "border-zinc-700 bg-zinc-900"
                      }`}
                      onClick={() => toggleArtist(artist.id)}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden mr-3">
                        <Image
                          src={artist.image || "/placeholder.svg"}
                          alt={artist.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span
                        className={`text-sm ${selectedArtists.includes(artist.id) ? "text-neon-pink" : "text-white"}`}
                      >
                        {artist.name}
                      </span>
                      {selectedArtists.includes(artist.id) && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-neon-pink rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Your Top Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {topGenres.map((genre) => (
                    <div
                      key={genre}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-neon-blue/20 border border-neon-blue text-neon-blue"
                          : "bg-zinc-900 border border-zinc-700 text-white"
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {isConnected && (
          <CardFooter>
            <Button
              onClick={handleSave}
              className="w-full bg-neon-pink hover:bg-neon-pink/90 text-black font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

