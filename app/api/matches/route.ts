import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id

    // Get all matches (where isMatch is true)
    // First, get likes where the current user is the sender
    const sentLikes = await prisma.like.findMany({
      where: {
        fromUserId: userId,
      },
      include: {
        toUser: {
          include: {
            profile: {
              include: {
                musicPreferences: true,
                userImages: true,
              },
            },
          },
        },
      },
    })

    // Then, get likes where the current user is the receiver
    const receivedLikes = await prisma.like.findMany({
      where: {
        toUserId: userId,
        isMatch: true,
      },
      include: {
        fromUser: {
          include: {
            profile: {
              include: {
                musicPreferences: true,
                userImages: true,
              },
            },
          },
        },
      },
    })

    // Map sent likes to the expected format
    const sentMatches = sentLikes.map((like) => {
      const user = like.toUser
      const profile = user.profile

      // Extract genres and artists
      const genres = profile?.musicPreferences.filter((pref) => pref.type === "genre").map((pref) => pref.name) || []

      const artists = profile?.musicPreferences.filter((pref) => pref.type === "artist").map((pref) => pref.name) || []

      // Extract images
      const images = profile?.userImages.map((img) => img.url) || []

      // Calculate age from birthdate
      const birthdate = profile?.birthdate
      const age = birthdate
        ? Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : null

      return {
        id: user.id,
        name: user.name || "Anonymous",
        age: age || 25, // Default age if not available
        location: profile?.location || "Unknown",
        bio: profile?.bio || "",
        genres,
        artists,
        image: profile?.imageUrl || "/placeholder.svg?height=400&width=300",
        images,
        matchDate: like.createdAt,
        isMatch: like.isMatch,
        status: like.isMatch ? "match" : "liked",
      }
    })

    // Map received likes to the expected format
    const receivedMatches = receivedLikes.map((like) => {
      const user = like.fromUser
      const profile = user.profile

      // Extract genres and artists
      const genres = profile?.musicPreferences.filter((pref) => pref.type === "genre").map((pref) => pref.name) || []

      const artists = profile?.musicPreferences.filter((pref) => pref.type === "artist").map((pref) => pref.name) || []

      // Extract images
      const images = profile?.userImages.map((img) => img.url) || []

      // Calculate age from birthdate
      const birthdate = profile?.birthdate
      const age = birthdate
        ? Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : null

      return {
        id: user.id,
        name: user.name || "Anonymous",
        age: age || 25, // Default age if not available
        location: profile?.location || "Unknown",
        bio: profile?.bio || "",
        genres,
        artists,
        image: profile?.imageUrl || "/placeholder.svg?height=400&width=300",
        images,
        matchDate: like.createdAt,
        isMatch: true,
        status: "match",
      }
    })

    // Combine both arrays and remove duplicates
    const allMatches = [...sentMatches, ...receivedMatches]
    const uniqueMatches = Array.from(new Map(allMatches.map((match) => [match.id, match])).values())

    return NextResponse.json({ matches: uniqueMatches })
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

