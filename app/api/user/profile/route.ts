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

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: {
        ...userWithoutPassword,
        bio: user.profile?.bio,
        location: user.profile?.location,
        imageUrl: user.profile?.imageUrl,
      },
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, bio, location, imageUrl } = await request.json()
    const userId = session.user.id

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    })

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    })

    if (!profile) {
      // Create profile if it doesn't exist
      await prisma.profile.create({
        data: {
          userId,
          bio,
          location,
          imageUrl,
        },
      })
    } else {
      // Update existing profile
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          bio,
          location,
          imageUrl,
        },
      })
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}

