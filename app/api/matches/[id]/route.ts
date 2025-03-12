import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const matchId = params.id

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: {
          include: {
            profile: true,
            musicPreferences: true,
          },
        },
        user2: {
          include: {
            profile: true,
            musicPreferences: true,
          },
        },
      },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    // Ensure the current user is part of this match
    if (match.user1Id !== userId && match.user2Id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Determine which user is the match (not the current user)
    const matchedUser = match.user1Id === userId ? match.user2 : match.user1

    return NextResponse.json({
      match,
      matchedUser,
    })
  } catch (error) {
    console.error("Error fetching match:", error)
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 })
  }
}

