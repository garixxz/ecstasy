import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateCompatibility } from "@/lib/matching-algorithm"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get current user's music preferences
    const currentUserPrefs = await prisma.musicPreference.findMany({
      where: { userId: session.user.id },
    })

    if (!currentUserPrefs.length) {
      return NextResponse.json({ error: "No music preferences found" }, { status: 400 })
    }

    // Get all users except current user
    const users = await prisma.user.findMany({
      where: {
        id: { not: session.user.id },
      },
      include: {
        profile: true,
        musicPreferences: true,
      },
    })

    // Calculate compatibility scores
    const potentialMatches = users
      .filter((user) => user.musicPreferences.length > 0)
      .map((user) => {
        const compatibilityScore = calculateCompatibility(currentUserPrefs, user.musicPreferences)

        return {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            profile: user.profile,
          },
          compatibilityScore,
        }
      })
      .filter((match) => match.compatibilityScore > 0)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

    return NextResponse.json(potentialMatches)
  } catch (error) {
    console.error("Error finding matches:", error)
    return NextResponse.json({ error: "Failed to find matches" }, { status: 500 })
  }
}

