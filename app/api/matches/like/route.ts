import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { targetUserId } = await request.json()

    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID is required" }, { status: 400 })
    }

    // Check if the target user has already liked the current user
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: targetUserId,
        targetUserId: session.user.id,
      },
    })

    // Create the like
    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        targetUserId: targetUserId,
      },
    })

    // If there's a mutual like, create a match
    let match = null
    if (existingLike) {
      match = await prisma.match.create({
        data: {
          user1Id: session.user.id,
          user2Id: targetUserId,
        },
      })
    }

    return NextResponse.json({
      success: true,
      like,
      match,
      isMatch: !!match,
    })
  } catch (error) {
    console.error("Error creating like:", error)
    return NextResponse.json({ error: "Failed to create like" }, { status: 500 })
  }
}

