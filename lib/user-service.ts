import { prisma } from "@/lib/prisma"

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        musicPreferences: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

