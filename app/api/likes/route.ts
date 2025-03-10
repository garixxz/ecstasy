import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

// Create a new like
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId } = body
    const senderId = session.user.id

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 })
    }

    // Check if the like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        senderId,
        receiverId,
      },
    })

    if (existingLike) {
      return NextResponse.json({ error: "You already liked this user" }, { status: 400 })
    }

    // Check if there's a mutual like
    const mutualLike = await prisma.like.findFirst({
      where: {
        senderId: receiverId,
        receiverId: senderId,
      },
    })

    // Create the new like
    const like = await prisma.like.create({
      data: {
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
        isMatch: !!mutualLike,
      },
    })

    // If there's a mutual like, update it to be a match
    if (mutualLike) {
      await prisma.like.update({
        where: { id: mutualLike.id },
        data: { isMatch: true },
      })

      // Create a welcome message
      await prisma.message.create({
        data: {
          content: "You're a match! Start the conversation by sharing your favorite song right now.",
          sender: { connect: { id: receiverId } },
          receiver: { connect: { id: senderId } },
        },
      })

      return NextResponse.json({ like, isMatch: true })
    }

    return NextResponse.json({ like, isMatch: false })
  } catch (error) {
    console.error("Error creating like:", error)
    return NextResponse.json({ error: "Failed to create like" }, { status: 500 })
  }
}

// Get all likes for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all matches (mutual likes)
    const matches = await prisma.like.findMany({
      where: {
        senderId: userId,
        isMatch: true,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            age: true,
            image: true,
            genres: true,
            artists: true,
          },
        },
      },
    })

    // Get all likes sent by the user
    const sentLikes = await prisma.like.findMany({
      where: {
        senderId: userId,
        isMatch: false,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            age: true,
            image: true,
          },
        },
      },
    })

    // Get all likes received by the user (that aren't matches yet)
    const receivedLikes = await prisma.like.findMany({
      where: {
        receiverId: userId,
        isMatch: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            age: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({
      matches,
      sentLikes,
      receivedLikes,
    })
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

