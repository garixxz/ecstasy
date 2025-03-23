"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MusicIcon, MessageCircle, Bell } from "lucide-react"
import { motion } from "framer-motion"
import { DashboardNav } from "@/components/dashboard-nav"
import { ProfileCard } from "@/components/profile-card"
import { ConversationList } from "@/components/conversation-list"
import { MessageList } from "@/components/message-list"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface Profile {
  id: string
  name: string
  age: number
  location: string
  bio: string
  genres: string[]
  artists: string[]
  image: string
  compatibilityScore?: number
  isMatch?: boolean
  status?: "match" | "liked"
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("discover")
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [matches, setMatches] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMatchesLoading, setIsMatchesLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<{
    userId: string
    userName: string
    userImage?: string
  } | null>(null)

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles")
      const data = await response.json()

      if (response.ok) {
        // Ensure each profile has the correct image format
        const formattedProfiles = data.profiles.map((profile: any) => ({
          ...profile,
          // Make sure image is a string
          image:
            profile.image || `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(profile.name || "User")}`,
          // Make sure images is an array of strings
          images: Array.isArray(profile.images) ? profile.images : [],
        }))
        setProfiles(formattedProfiles)
      } else {
        toast.error(data.error || "Failed to fetch profiles")
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Similarly update the fetchMatches function
  const fetchMatches = async () => {
    setIsMatchesLoading(true)
    try {
      const response = await fetch("/api/matches")
      const data = await response.json()

      if (response.ok) {
        // Ensure each match has the correct image format
        const formattedMatches = data.matches.map((match: any) => ({
          ...match,
          // Make sure image is a string
          image:
            match.image || `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(match.name || "User")}`,
          // Make sure images is an array of strings
          images: Array.isArray(match.images) ? match.images : [],
        }))
        setMatches(formattedMatches)
      } else {
        toast.error(data.error || "Failed to fetch matches")
      }
    } catch (error) {
      console.error("Error fetching matches:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsMatchesLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
    fetchMatches()
  }, [])

  // Refetch matches when tab changes to matches
  useEffect(() => {
    if (activeTab === "matches") {
      fetchMatches()
    }
  }, [activeTab])

  const handleLike = async (profileId: string) => {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          like: true,
          profileId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Remove the profile from the list
        setProfiles(profiles.filter((profile) => profile.id !== profileId))

        if (data.isMatch) {
          toast.success("It's a match! 🎉")
          // Refresh matches
          fetchMatches()

          // Find the profile that was just matched
          const matchedProfile = profiles.find((p) => p.id === profileId)
          if (matchedProfile) {
            // Switch to messages tab and open conversation with the matched user
            setSelectedConversation({
              userId: matchedProfile.id,
              userName: matchedProfile.name,
              userImage: matchedProfile.image,
            })
            setActiveTab("messages")
          }
        } else {
          toast.success("You liked this profile!")
          // Refresh matches to show the liked profile
          fetchMatches()
        }
      } else {
        toast.error(data.error || "Failed to like profile")
      }
    } catch (error) {
      console.error("Error liking profile:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const handleDislike = (profileId: string) => {
    // Remove the profile from the list
    setProfiles(profiles.filter((profile) => profile.id !== profileId))
  }

  const handleSelectConversation = (userId: string, userName: string, userImage?: string) => {
    setSelectedConversation({ userId, userName, userImage })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MusicIcon className="h-6 w-6" />
            <span className="text-xl font-bold">Ecstasy</span>
          </div>
          <div className="flex items-center gap-4">
            <Button className="h-10 w-10 rounded-full p-0">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              className="h-10 w-10 rounded-full p-0"
              onClick={() => {
                setActiveTab("messages")
                setSelectedConversation(null)
              }}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src={session?.user?.image || "/placeholder.svg?height=40&width=40"} />
              <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-6">
        <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <Tabs defaultValue="discover" className="w-full" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="discover" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
                </div>
              ) : profiles.length > 0 ? (
                <div className="h-[calc(100vh-12rem)] overflow-y-auto px-1 py-2">
                  <div className="grid gap-6">
                    {profiles.map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="max-w-md mx-auto w-full"
                      >
                        <ProfileCard
                          profile={profile}
                          onLike={() => handleLike(profile.id)}
                          onDislike={() => handleDislike(profile.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center h-40 text-center gap-4">
                      <p className="text-gray-500">No more profiles to discover right now.</p>
                      <Button
                        onClick={() => {
                          setIsLoading(true)
                          fetchProfiles()
                        }}
                        className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
                      >
                        Refresh
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="matches">
              {isMatchesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
                </div>
              ) : matches.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {matches.map((match) => (
                    <Card key={match.id} className="overflow-hidden shadow-sm">
                      <CardContent className="p-0">
                        <div className="relative aspect-video w-full">
                          <Image
                            src={
                              match.image ||
                              `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(match.name)}`
                            }
                            alt={match.name}
                            fill
                            className="object-cover"
                            unoptimized
                            onError={(e) => {
                              // Replace with placeholder if image fails to load
                              ;(e.target as HTMLImageElement).src =
                                `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(match.name)}`
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4 text-white">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold">
                                {match.name}, {match.age}
                              </h3>
                              {match.status === "match" ? (
                                <Badge className="bg-green-500">Match</Badge>
                              ) : (
                                <Badge className="bg-pink-500">Liked</Badge>
                              )}
                            </div>
                            <p className="text-sm text-white/80">{match.location}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <Button
                            className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
                            onClick={() => {
                              setSelectedConversation({
                                userId: match.id,
                                userName: match.name,
                                userImage: match.image,
                              })
                              setActiveTab("messages")
                            }}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-40 text-gray-500">
                      <p>No matches yet. Keep exploring!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="messages">
              <div className="grid gap-4">
                {selectedConversation ? (
                  <div className="flex flex-col">
                    <Button className="self-start mb-4" onClick={() => setSelectedConversation(null)}>
                      ← Back to conversations
                    </Button>
                    <MessageList
                      userId={selectedConversation.userId}
                      userName={selectedConversation.userName}
                      userImage={selectedConversation.userImage}
                    />
                  </div>
                ) : (
                  <ConversationList onSelectConversation={handleSelectConversation} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

