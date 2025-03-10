"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircleIcon, MusicIcon } from "lucide-react"

// Mock data for matches
const mockMatches = [
  {
    id: 1,
    name: "Jessica",
    age: 28,
    image: "/placeholder.svg?height=300&width=300",
    lastActive: "2 hours ago",
    compatibility: 85,
    topArtists: ["The Smiths", "Arctic Monkeys", "Tame Impala"],
    hasUnreadMessages: true,
  },
  {
    id: 2,
    name: "Michael",
    age: 31,
    image: "/placeholder.svg?height=300&width=300",
    lastActive: "Just now",
    compatibility: 92,
    topArtists: ["Depeche Mode", "New Order", "The Cure"],
    hasUnreadMessages: false,
  },
  {
    id: 3,
    name: "Sophia",
    age: 26,
    image: "/placeholder.svg?height=300&width=300",
    lastActive: "Yesterday",
    compatibility: 78,
    topArtists: ["Madonna", "Prince", "Miles Davis"],
    hasUnreadMessages: false,
  },
]

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredMatches =
    activeTab === "all"
      ? mockMatches
      : activeTab === "new"
        ? mockMatches.filter((match) => match.hasUnreadMessages)
        : mockMatches.filter((match) => match.compatibility > 85)

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Your Matches</h1>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
          <TabsTrigger
            value="all"
            className="text-white data-[state=active]:bg-neon-purple data-[state=active]:text-black"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="text-white data-[state=active]:bg-neon-pink data-[state=active]:text-black"
          >
            New
          </TabsTrigger>
          <TabsTrigger
            value="top"
            className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black"
          >
            Top Matches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <MatchList matches={filteredMatches} />
        </TabsContent>

        <TabsContent value="new" className="mt-4">
          <MatchList matches={filteredMatches} />
        </TabsContent>

        <TabsContent value="top" className="mt-4">
          <MatchList matches={filteredMatches} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MatchList({ matches }: { matches: typeof mockMatches }) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">No matches found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <Card key={match.id} className="overflow-hidden border-neon-purple/50 bg-black">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={match.image || "/placeholder.svg"}
                    alt={match.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                {match.hasUnreadMessages && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-pink rounded-full border-2 border-black"></div>
                )}
              </div>

              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">
                      {match.name}, {match.age}
                    </h3>
                    <p className="text-xs text-zinc-400">Active {match.lastActive}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-12 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"></div>
                    <span className="ml-2 text-xs text-white">{match.compatibility}%</span>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {match.topArtists.slice(0, 1).map((artist, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-neon-purple/20 border border-neon-purple text-white rounded-full text-xs"
                    >
                      {artist}
                    </span>
                  ))}
                  {match.topArtists.length > 1 && (
                    <span className="px-2 py-0.5 text-zinc-400 text-xs">+{match.topArtists.length - 1} more</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex border-t border-zinc-800">
              <Link href={`/profile/${match.id}`} className="flex-1">
                <Button variant="ghost" className="w-full rounded-none h-12 text-neon-blue hover:bg-neon-blue/10">
                  <MusicIcon className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <div className="w-px bg-zinc-800"></div>
              <Link href={`/messages/${match.id}`} className="flex-1">
                <Button variant="ghost" className="w-full rounded-none h-12 text-neon-pink hover:bg-neon-pink/10">
                  <MessageCircleIcon className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

