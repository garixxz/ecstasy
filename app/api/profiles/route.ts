import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { calculateMusicCompatibility } from "@/lib/utils"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id

    // Get the current user's profile with music preferences
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            musicPreferences: true,
          },
        },
        sentLikes: true, // Get likes sent by the user
      },
    })

    if (!currentUser || !currentUser.profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Get the IDs of users that the current user has already liked
    const likedUserIds = currentUser.sentLikes.map((like) => like.toUserId)

    // Get all users except the current user and those already liked
    const otherUsers = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
          notIn: likedUserIds,
        },
      },
      include: {
        profile: {
          include: {
            musicPreferences: true,
            userImages: true,
          },
        },
      },
    })

    // Extract current user's genres and artists
    const currentUserGenres = currentUser.profile.musicPreferences
      .filter((pref) => pref.type === "genre")
      .map((pref) => pref.name)

    const currentUserArtists = currentUser.profile.musicPreferences
      .filter((pref) => pref.type === "artist")
      .map((pref) => pref.name)

    // Map users to profiles with compatibility scores
    const profiles = otherUsers
      .filter((user) => user.profile) // Only include users with profiles
      .map((user) => {
        const userGenres =
          user.profile?.musicPreferences.filter((pref) => pref.type === "genre").map((pref) => pref.name) || []

        const userArtists =
          user.profile?.musicPreferences.filter((pref) => pref.type === "artist").map((pref) => pref.name) || []

        // Get user images
        const userImages = user.profile?.userImages.map((img) => img.url) || []

        // Calculate compatibility score
        const compatibilityScore = calculateMusicCompatibility(
          currentUserGenres,
          currentUserArtists,
          userGenres,
          userArtists,
        )

        // Calculate age from birthdate
        const birthdate = user.profile?.birthdate
        const age = birthdate
          ? Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : null

        return {
          id: user.id,
          name: user.name || "Anonymous",
          age: age || 25, // Default age if not available
          location: user.profile?.location || "Unknown",
          bio: user.profile?.bio || "",
          genres: userGenres,
          artists: userArtists,
          image: user.profile?.imageUrl || "/placeholder.svg?height=400&width=300",
          images: userImages,
          compatibilityScore,
        }
      })
      // Sort by compatibility score (highest first)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { like, profileId } = await request.json()
    const fromUserId = session.user.id

    if (like) {
      // Check if the other user has already liked the current user
      const existingLike = await prisma.like.findFirst({
        where: {
          fromUserId: profileId,
          toUserId: fromUserId,
        },
      })

      // Create a new like
      const newLike = await prisma.like.create({
        data: {
          fromUserId,
          toUserId: profileId,
          isMatch: !!existingLike, // It's a match if the other user has already liked the current user
        },
      })

      // If it's a match, update the other user's like
      if (existingLike) {
        await prisma.like.update({
          where: { id: existingLike.id },
          data: { isMatch: true },
        })

        return NextResponse.json({
          success: true,
          message: "It's a match!",
          isMatch: true,
        })
      }

      return NextResponse.json({
        success: true,
        message: "Like recorded successfully",
        isMatch: false,
      })
    }

    return NextResponse.json({ success: true, message: "Preference recorded successfully" })
  } catch (error) {
    console.error("Error recording preference:", error)
    return NextResponse.json({ error: "Failed to record preference" }, { status: 500 })
  }
}

