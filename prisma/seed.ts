import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

async function main() {
  // Create genres
  const genres = [
    "80s Pop",
    "Synthwave",
    "New Wave",
    "Post-Punk",
    "Disco",
    "Hip Hop",
    "Rock",
    "Alternative",
    "Indie",
    "Electronic",
  ]

  const createdGenres = []
  for (const genre of genres) {
    const createdGenre = await prisma.genre.upsert({
      where: { name: genre },
      update: {},
      create: {
        id: uuidv4(),
        name: genre,
      },
    })
    createdGenres.push(createdGenre)
  }

  // Create artists
  const artists = [
    "The Smiths",
    "Depeche Mode",
    "New Order",
    "The Cure",
    "Madonna",
    "Prince",
    "Michael Jackson",
    "Duran Duran",
    "Tears for Fears",
    "A-ha",
  ]

  const createdArtists = []
  for (const artist of artists) {
    const createdArtist = await prisma.artist.upsert({
      where: { name: artist },
      update: {},
      create: {
        id: uuidv4(),
        name: artist,
      },
    })
    createdArtists.push(createdArtist)
  }

  // Create demo users
  const demoUsers = [
    {
      name: "Jessica",
      email: "jessica@example.com",
      password: "password123",
      age: 28,
      gender: "female",
      lookingFor: "everyone",
      bio: "Indie rock enthusiast and vinyl collector. Looking for someone to share headphones with.",
      favoriteGenres: ["Indie", "Rock", "Alternative"],
      favoriteArtists: ["The Smiths", "Arctic Monkeys", "Tame Impala"],
    },
    {
      name: "Michael",
      email: "michael@example.com",
      password: "password123",
      age: 31,
      gender: "male",
      lookingFor: "women",
      bio: "Synth-wave producer by night, coffee addict by day. Let's talk about 80s music.",
      favoriteGenres: ["Synthwave", "New Wave", "Electronic"],
      favoriteArtists: ["Depeche Mode", "New Order", "The Cure"],
    },
    {
      name: "Sophia",
      email: "sophia@example.com",
      password: "password123",
      age: 26,
      gender: "female",
      lookingFor: "men",
      bio: "Jazz lover with a soft spot for 80s pop. Always looking for new music recommendations!",
      favoriteGenres: ["80s Pop", "Disco", "Electronic"],
      favoriteArtists: ["Madonna", "Prince", "Michael Jackson"],
    },
  ]

  const createdUsers = []
  for (const user of demoUsers) {
    const hashedPassword = await hash(user.password, 10)

    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: uuidv4(),
        name: user.name,
        email: user.email,
        password: hashedPassword,
        age: user.age,
        gender: user.gender,
        lookingFor: user.lookingFor,
        bio: user.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    createdUsers.push(createdUser)

    // Connect genres
    for (const genreName of user.favoriteGenres) {
      const genre =
        createdGenres.find((g) => g.name === genreName) ||
        (await prisma.genre.findUnique({ where: { name: genreName } }))

      if (genre) {
        await prisma.user.update({
          where: { id: createdUser.id },
          data: {
            genres: {
              connect: { id: genre.id },
            },
          },
        })
      }
    }

    // Connect artists
    for (const artistName of user.favoriteArtists) {
      const artist =
        createdArtists.find((a) => a.name === artistName) ||
        (await prisma.artist.findUnique({ where: { name: artistName } }))

      if (artist) {
        await prisma.user.update({
          where: { id: createdUser.id },
          data: {
            artists: {
              connect: { id: artist.id },
            },
          },
        })
      }
    }
  }

  // Get the created users
  const jessica = createdUsers.find((u) => u.name === "Jessica")
  const michael = createdUsers.find((u) => u.name === "Michael")

  if (jessica && michael) {
    // Create mutual like (match)
    await prisma.like.create({
      data: {
        id: uuidv4(),
        senderId: michael.id,
        receiverId: jessica.id,
        isMatch: true,
        createdAt: new Date(),
      },
    })

    await prisma.like.create({
      data: {
        id: uuidv4(),
        senderId: jessica.id,
        receiverId: michael.id,
        isMatch: true,
        createdAt: new Date(),
      },
    })

    // Create some messages
    await prisma.message.create({
      data: {
        id: uuidv4(),
        content: "Hey there! I saw we both like The Smiths. What's your favorite album?",
        senderId: jessica.id,
        receiverId: michael.id,
        read: true,
        createdAt: new Date(),
      },
    })

    await prisma.message.create({
      data: {
        id: uuidv4(),
        content: "Hi Jessica! Nice to meet you. I'd have to say 'The Queen Is Dead' is my all-time favorite. You?",
        senderId: michael.id,
        receiverId: jessica.id,
        read: false,
        createdAt: new Date(),
      },
    })
  }

  console.log("Database has been seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

