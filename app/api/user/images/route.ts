import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

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
        userImages: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Extract image URLs
    const images = profile.userImages.map((img) => img.url)

    return NextResponse.json({
      success: true,
      images,
    })
  } catch (error) {
    console.error("Error fetching user images:", error)
    return NextResponse.json({ error: "Failed to fetch user images" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { imageUrl } = await request.json()
    const userId = session.user.id

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Add the image to the user's profile
    await prisma.userImage.create({
      data: {
        profileId: profile.id,
        url: imageUrl,
      },
    })

    return NextResponse.json({ success: true, message: "Image added successfully" })
  } catch (error) {
    console.error("Error adding user image:", error)
    return NextResponse.json({ error: "Failed to add user image" }, { status: 500 })
  }
}

