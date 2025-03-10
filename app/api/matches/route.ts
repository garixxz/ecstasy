import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get current user with their music preferences
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        genres: true,
        artists: true,
      },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all users except current user
    const allUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        // Filter by gender preference if specified
        ...(currentUser.lookingFor && currentUser.lookingFor !== "everyone"
          ? { gender: currentUser.lookingFor === "men" ? "male" : "female" }
          : {}),
      },
      include: {
        genres: true,
        artists: true,
      },
    })

    // Get already liked users to exclude them
    const likedUsers = await prisma.like.findMany({
      where: {
        senderId: userId,
      },
      select: {
        receiverId: true,
      },
    })

    const likedUserIds = likedUsers.map((like) => like.receiverId)

    // Calculate compatibility scores with enhanced algorithm
    const usersWithCompatibility = allUsers
      .filter((user) => !likedUserIds.includes(user.id))
      .map((user) => {
        // Calculate genre compatibility
        const currentUserGenreIds = currentUser.genres.map((g) => g.id)
        const userGenreIds = user.genres.map((g) => g.id)
        const commonGenres = userGenreIds.filter((id) => currentUserGenreIds.includes(id))

        // Calculate genre score with weighted importance
        const genreScore =
          commonGenres.length > 0 ? (commonGenres.length / Math.max(currentUserGenreIds.length, 1)) * 100 : 0

        // Calculate artist compatibility
        const currentUserArtistIds = currentUser.artists.map((a) => a.id)
        const userArtistIds = user.artists.map((a) => a.id)
        const commonArtists = userArtistIds.filter((id) => currentUserArtistIds.includes(id))

        // Calculate artist score with weighted importance
        const artistScore =
          commonArtists.length > 0 ? (commonArtists.length / Math.max(currentUserArtistIds.length, 1)) * 100 : 0

        // Calculate listening habits compatibility (in a real app, this would use actual listening data)
        // For now, we'll simulate it with a random score between 0-100
        const listeningHabitsScore = Math.floor(Math.random() * 101)

        // Overall compatibility (weighted average)
        // 40% artist match, 30% genre match, 30% listening habits
        const compatibilityScore = Math.round(artistScore * 0.4 + genreScore * 0.3 + listeningHabitsScore * 0.3)

        // Get common artists and genres for display
        const commonArtistNames = user.artists
          .filter((artist) => currentUserArtistIds.includes(artist.id))
          .map((artist) => artist.name)

        const commonGenreNames = user.genres
          .filter((genre) => currentUserGenreIds.includes(genre.id))
          .map((genre) => genre.name)

        return {
          id: user.id,
          name: user.name,
          age: user.age,
          gender: user.gender,
          bio: user.bio,
          image: user.image,
          compatibilityScore,
          commonArtists: commonArtistNames,
          commonGenres: commonGenreNames,
          artistScore,
          genreScore,
          listeningHabitsScore,
        }
      })

    // Sort by compatibility score (highest first)
    usersWithCompatibility.sort((a, b) => b.compatibilityScore - a.compatibilityScore)

    return NextResponse.json(usersWithCompatibility)
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

