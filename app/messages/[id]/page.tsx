"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon, SendIcon, MusicIcon } from "lucide-react"

// Mock data for the conversation
const mockMatch = {
  id: "1",
  name: "Jessica",
  age: 28,
  image: "/placeholder.svg?height=300&width=300",
  lastActive: "Online now",
}

const initialMessages = [
  {
    id: 1,
    senderId: "other",
    content: "Hey there! I saw we both like The Smiths. What's your favorite album?",
    timestamp: "Yesterday, 8:30 PM",
  },
  {
    id: 2,
    senderId: "me",
    content: "Hi Jessica! Nice to meet you. I'd have to say 'The Queen Is Dead' is my all-time favorite. You?",
    timestamp: "Yesterday, 8:45 PM",
  },
  {
    id: 3,
    senderId: "other",
    content: "Same here! 'There Is a Light That Never Goes Out' is such a perfect song. Have you ever seen them live?",
    timestamp: "Yesterday, 9:02 PM",
  },
  {
    id: 4,
    senderId: "me",
    content:
      "Unfortunately no, I was born too late for that! But I did see Morrissey solo a few years ago. What about you?",
    timestamp: "Yesterday, 9:15 PM",
  },
  {
    id: 5,
    senderId: "other",
    content:
      "Same, just Morrissey solo. Hey, there's an 80s night at Vinyl Club this weekend. Would you want to check it out?",
    timestamp: "Yesterday, 9:30 PM",
  },
]

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      senderId: "me",
      content: newMessage,
      timestamp: "Just now",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center p-4 border-b border-zinc-800 bg-black">
        <Link href="/messages" className="mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center flex-1">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image src={mockMatch.image || "/placeholder.svg"} alt={mockMatch.name} fill className="object-cover" />
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-white">
              {mockMatch.name}, {mockMatch.age}
            </h2>
            <p className="text-xs text-neon-pink">{mockMatch.lastActive}</p>
          </div>
        </div>

        <Link href={`/profile/${params.id}`}>
          <Button variant="ghost" size="sm" className="text-neon-blue">
            <MusicIcon className="h-4 w-4 mr-1" />
            Profile
          </Button>
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}>
              {message.senderId !== "me" && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 mt-1">
                  <Image
                    src={mockMatch.image || "/placeholder.svg"}
                    alt={mockMatch.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="max-w-[70%]">
                <div
                  className={`p-3 rounded-lg ${
                    message.senderId === "me" ? "bg-neon-pink text-black" : "bg-zinc-800 text-white"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-black">
        <div className="flex items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-900 border-zinc-700 text-white"
          />
          <Button
            type="submit"
            size="icon"
            className="ml-2 bg-neon-pink hover:bg-neon-pink/90 text-black"
            disabled={!newMessage.trim()}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

