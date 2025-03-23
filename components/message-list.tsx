"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Heart } from 'lucide-react'
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  fromUserId: string
  toUserId: string
  read: boolean
  createdAt: string
  fromUser: {
    id: string
    name: string | null
    image: string | null
    profile: {
      imageUrl: string | null
    } | null
  }
}

interface MessageListProps {
  userId: string
  userName: string
  userImage?: string
}

export function MessageList({ userId, userName, userImage }: MessageListProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isMatch, setIsMatch] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const checkIfMatch = useCallback(async () => {
    try {
      const response = await fetch("/api/matches")
      const data = await response.json()

      if (response.ok) {
        const match = data.matches.find((m: any) => m.id === userId)
        setIsMatch(match ? match.status === "match" : false)
      }
    } catch (error) {
      console.error("Error checking match status:", error)
    }
  }, [userId])

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setMessages(data.messages || [])
      } else {
        toast.error(data.error || "Failed to fetch messages")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsFetching(false)
    }
  }, [userId])

  useEffect(() => {
    checkIfMatch()
    fetchMessages()

    // Poll for new messages every 5 seconds instead of 10
    const interval = setInterval(fetchMessages, 5000)

    return () => clearInterval(interval)
  }, [fetchMessages, checkIfMatch])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          toUserId: userId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewMessage("")
        fetchMessages()
      } else {
        toast.error(data.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarImage 
                src={userImage || `/placeholder.svg?height=40&width=40&text=${userName.charAt(0)}`}
                onError={(e) => {
                  // Replace with placeholder if image fails to load
                  (e.target as HTMLImageElement).src = `/placeholder.svg?height=40&width=40&text=${userName.charAt(0)}`
                }}
              />
              <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span>{userName}</span>
          </CardTitle>
          {isMatch === false && (
            <Badge className="bg-pink-500">
              <Heart className="h-3 w-3 mr-1" /> Liked
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {isFetching ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.fromUser.id === session?.user?.id

            return (
              <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || isMatch === false}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black"
            title={isMatch === false ? "You can only message users who have matched with you" : ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {isMatch === false && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            You can only message users who have matched with you. Wait for them to like you back!
          </p>
        )}
      </div>
    </Card>
  )
}
