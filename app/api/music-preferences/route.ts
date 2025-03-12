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
    const data = await request.json()

    // Delete existing preferences first
    await prisma.musicPreference.deleteMany({
      where: { userId: session.user.id },
    })

    // Create new preferences
    const preferences = await prisma.musicPreference.createMany({
      data: data.preferences.map((pref: any) => ({
        userId: session.user.id,
        type: pref.type,
        name: pref.name,
        weight: pref.weight || 1,
      })),
    })

    return NextResponse.json({ success: true, count: preferences.count })
  } catch (error) {
    console.error("Error saving music preferences:", error)
    return NextResponse.json({ error: "Failed to save music preferences" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const preferences = await prisma.musicPreference.findMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error fetching music preferences:", error)
    return NextResponse.json({ error: "Failed to fetch music preferences" }, { status: 500 })
  }
}

