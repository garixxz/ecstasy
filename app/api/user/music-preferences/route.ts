import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { genres, artists, bio } = await request.json()
    const userId = session.user.id

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Update the profile bio
    await prisma.profile.update({
      where: { id: profile.id },
      data: { bio },
    })

    // Delete existing music preferences
    await prisma.musicPreference.deleteMany({
      where: { profileId: profile.id },
    })

    // Create genre preferences
    const genrePreferences = genres.map((genre: string) => ({
      profileId: profile.id,
      type: "genre",
      name: genre,
    }))

    // Create artist preferences
    const artistPreferences = artists.map((artist: string) => ({
      profileId: profile.id,
      type: "artist",
      name: artist,
    }))

    // Save all music preferences
    await prisma.musicPreference.createMany({
      data: [...genrePreferences, ...artistPreferences],
    })

    return NextResponse.json({ success: true, message: "Music preferences saved successfully" })
  } catch (error) {
    console.error("Error saving music preferences:", error)
    return NextResponse.json({ error: "Failed to save music preferences" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.id

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        musicPreferences: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Separate genres and artists
    const genres = profile.musicPreferences.filter((pref) => pref.type === "genre").map((pref) => pref.name)

    const artists = profile.musicPreferences.filter((pref) => pref.type === "artist").map((pref) => pref.name)

    return NextResponse.json({
      success: true,
      data: {
        genres,
        artists,
        bio: profile.bio,
      },
    })
  } catch (error) {
    console.error("Error fetching music preferences:", error)
    return NextResponse.json({ error: "Failed to fetch music preferences" }, { status: 500 })
  }
}

