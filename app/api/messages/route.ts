import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

// Send a new message
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId, content } = body
    const senderId = session.user.id

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Receiver ID and content are required" }, { status: 400 })
    }

    // Check if there's a match between the users
    const match = await prisma.like.findFirst({
      where: {
        OR: [
          {
            senderId,
            receiverId,
            isMatch: true,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
            isMatch: true,
          },
        ],
      },
    })

    if (!match) {
      return NextResponse.json({ error: "You can only message users you've matched with" }, { status: 403 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

// Get conversation with a specific user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get("userId")

    if (!otherUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get all messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

