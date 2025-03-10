import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { z } from "zod"

const prisma = new PrismaClient()

// Define validation schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().min(18, "You must be at least 18 years old").max(120, "Invalid age"))
    .optional(),
  gender: z.string().optional(),
  lookingFor: z.string().optional(),
  favoriteGenres: z.array(z.string()).optional(),
  favoriteArtists: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = userSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation error", details: validationResult.error.format() }, { status: 400 })
    }

    const { name, email, password, age, gender, lookingFor, favoriteGenres, favoriteArtists } = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: age ? Number(age) : null,
        gender,
        lookingFor,
      },
    })

    // Add genres
    if (favoriteGenres && favoriteGenres.length > 0) {
      for (const genreName of favoriteGenres) {
        // Find or create genre
        let genre = await prisma.genre.findUnique({
          where: { name: genreName },
        })

        if (!genre) {
          genre = await prisma.genre.create({
            data: { name: genreName },
          })
        }

        // Connect genre to user
        await prisma.user.update({
          where: { id: user.id },
          data: {
            genres: {
              connect: { id: genre.id },
            },
          },
        })
      }
    }

    // Add artists
    if (favoriteArtists && favoriteArtists.length > 0) {
      for (const artistName of favoriteArtists) {
        // Find or create artist
        let artist = await prisma.artist.findUnique({
          where: { name: artistName },
        })

        if (!artist) {
          artist = await prisma.artist.create({
            data: { name: artistName },
          })
        }

        // Connect artist to user
        await prisma.user.update({
          where: { id: user.id },
          data: {
            artists: {
              connect: { id: artist.id },
            },
          },
        })
      }
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

// Get user profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        genres: true,
        artists: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

