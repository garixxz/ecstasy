"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Jessica",
    age: 28,
    image: "/placeholder.svg?height=300&width=300",
    lastMessage: "Hey, there's an 80s night at Vinyl Club this weekend. Would you want to check it out?",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    name: "Michael",
    age: 31,
    image: "/placeholder.svg?height=300&width=300",
    lastMessage: "I've been listening to that New Order album you recommended. It's amazing!",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    name: "Sophia",
    age: 26,
    image: "/placeholder.svg?height=300&width=300",
    lastMessage: "What do you think of Prince's early work compared to his later albums?",
    timestamp: "3 days ago",
    unread: false,
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState(mockConversations)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (status === "authenticated") {
      // In a real app, fetch conversations from API
      // fetchConversations()

      // Using mock data for now
      setTimeout(() => {
        setConversations(mockConversations)
        setIsLoading(false)
      }, 1000)
    }
  }, [status, router])

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
        <p className="mt-4 text-neon-pink">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">Messages</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search conversations..."
          className="pl-10 bg-zinc-900 border-zinc-700 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredConversations.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No conversations yet</h3>
          <p className="text-zinc-400 mb-6">Start matching with people to begin conversations</p>
          <Link href="/discover">
            <Button className="bg-neon-pink hover:bg-neon-pink/90 text-black font-bold">Discover People</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <Link key={conversation.id} href={`/messages/${conversation.id}`}>
              <Card className="w-full overflow-hidden border-neon-purple/50 bg-black hover:bg-zinc-900 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={conversation.image || "/placeholder.svg"}
                          alt={conversation.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      {conversation.unread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-pink rounded-full border-2 border-black"></div>
                      )}
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-white">
                          {conversation.name}, {conversation.age}
                        </h3>
                        <span className="text-xs text-zinc-400">{conversation.timestamp}</span>
                      </div>
                      <p
                        className={`text-sm mt-1 line-clamp-1 ${conversation.unread ? "text-white font-medium" : "text-zinc-400"}`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

