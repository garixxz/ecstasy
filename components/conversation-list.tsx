"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Conversation {
  otherUserId: string
  otherUserName: string
  otherUserImage: string | null
  lastMessage: string | null
  lastMessageTime: string | null
  unreadCount: number
  isMatch?: boolean
}

interface ConversationListProps {
  onSelectConversation: (userId: string, userName: string, userImage?: string) => void
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages")
      const data = await response.json()

      if (response.ok) {
        setConversations(data.conversations || [])
      } else {
        toast.error(data.error || "Failed to fetch conversations")
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/matches")
      const data = await response.json()

      if (response.ok) {
        setMatches(data.matches || [])
      } else {
        toast.error(data.error || "Failed to fetch matches")
      }
    } catch (error) {
      console.error("Error fetching matches:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchConversations()
      await fetchMatches()
    }

    loadData()

    // Poll for new messages every 5 seconds instead of 10
    const interval = setInterval(fetchConversations, 5000)

    return () => clearInterval(interval)
  }, [])

  // Create a combined list of conversations and matches without duplicates
  const allConversations = [...conversations]

  // Add matches that don't already have a conversation
  matches.forEach((match) => {
    if (!allConversations.some((conv) => conv.otherUserId === match.id)) {
      allConversations.push({
        otherUserId: match.id,
        otherUserName: match.name,
        otherUserImage: match.image,
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: 0,
        isMatch: match.status === "match",
      })
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    )
  }

  if (allConversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40 text-gray-500">
            <p>No conversations yet. Match with someone to start chatting!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {allConversations.map((conversation) => (
        <Button
          key={conversation.otherUserId}
          className="w-full justify-start p-3 h-auto"
          onClick={() =>
            onSelectConversation(
              conversation.otherUserId,
              conversation.otherUserName,
              conversation.otherUserImage || undefined,
            )
          }
        >
          <div className="flex items-center gap-3 w-full">
            <Avatar>
              <AvatarImage 
                src={conversation.otherUserImage || `/placeholder.svg?height=40&width=40&text=${conversation.otherUserName.charAt(0)}`} 
                onError={(e) => {
                  // Replace with placeholder if image fails to load
                  (e.target as HTMLImageElement).src = `/placeholder.svg?height=40&width=40&text=${conversation.otherUserName.charAt(0)}`
                }}
              />
              <AvatarFallback>{conversation.otherUserName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{conversation.otherUserName}</p>
                  {conversation.isMatch === false && <Badge className="bg-pink-500 text-white">Liked</Badge>}
                </div>
                {conversation.lastMessageTime && (
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.lastMessageTime).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{conversation.lastMessage || "Start a conversation"}</p>
            </div>
            {conversation.unreadCount > 0 && (
              <span className="bg-black text-white dark:bg-white dark:text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </Button>
      ))}
    </div>
  )
}
