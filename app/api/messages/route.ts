import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const userId = session.user.id
    const otherUserId = url.searchParams.get("userId")

    if (otherUserId) {
      // Get conversation with specific user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { fromUserId: userId, toUserId: otherUserId },
            { fromUserId: otherUserId, toUserId: userId },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
              profile: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },
        },
      })

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          fromUserId: otherUserId,
          toUserId: userId,
          read: false,
        },
        data: {
          read: true,
        },
      })

      return NextResponse.json({ messages })
    } else {
      // Get all conversations
      // First, get all users the current user has exchanged messages with
      const messageUsers = await prisma.message.findMany({
        where: {
          OR: [{ fromUserId: userId }, { toUserId: userId }],
        },
        select: {
          fromUserId: true,
          toUserId: true,
        },
        distinct: ["fromUserId", "toUserId"],
      })

      // Extract unique user IDs
      const userIds = new Set<string>()
      messageUsers.forEach((msg) => {
        if (msg.fromUserId !== userId) userIds.add(msg.fromUserId)
        if (msg.toUserId !== userId) userIds.add(msg.toUserId)
      })

      // Get conversation details for each user
      const conversations = []

      for (const otherId of userIds) {
        // Get the last message
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { fromUserId: userId, toUserId: otherId },
              { fromUserId: otherId, toUserId: userId },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        // Get unread count
        const unreadCount = await prisma.message.count({
          where: {
            fromUserId: otherId,
            toUserId: userId,
            read: false,
          },
        })

        // Get user details
        const otherUser = await prisma.user.findUnique({
          where: { id: otherId },
          include: {
            profile: {
              select: {
                imageUrl: true,
              },
            },
          },
        })

        if (otherUser) {
          conversations.push({
            otherUserId: otherId,
            otherUserName: otherUser.name || "Unknown",
            otherUserImage: otherUser.profile?.imageUrl || null,
            lastMessage: lastMessage?.content || null,
            lastMessageTime: lastMessage?.createdAt.toISOString() || null,
            unreadCount,
          })
        }
      }

      return NextResponse.json({ conversations })
    }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { content, toUserId } = await request.json()
    const fromUserId = session.user.id

    // Check if users have a match
    const match = await prisma.like.findFirst({
      where: {
        OR: [
          { fromUserId, toUserId, isMatch: true },
          { fromUserId: toUserId, toUserId: fromUserId, isMatch: true },
        ],
      },
    })

    if (!match) {
      return NextResponse.json({ error: "You can only message users you've matched with" }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        content,
        fromUserId,
        toUserId,
        read: false,
      },
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

